import React, { useState, useEffect } from 'react';
import { Form, Button, Card, Row, Col, Modal } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import doctorsData from '../../assets/doctors_data.json';
import { toast } from 'react-hot-toast';
import './BookAppointment.css';

const BookAppointment = ({ onBookAppointment }) => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    doctorId: '',
    date: '',
    time: '',
    reason: '',
    type: 'Regular'
  });

  const [searchQuery, setSearchQuery] = useState('');
  const [filteredDoctors, setFilteredDoctors] = useState(doctorsData);
  const [selectedDate, setSelectedDate] = useState('');
  const [availableTimeSlots, setAvailableTimeSlots] = useState([]);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [bookingDetails, setBookingDetails] = useState(null);
  const [errors, setErrors] = useState({});

  // Generate next 7 days
  const nextSevenDays = Array.from({ length: 7 }, (_, i) => {
    const date = new Date();
    date.setDate(date.getDate() + i + 1);
    return {
      date: date.toISOString().split('T')[0],
      day: date.toLocaleDateString('en-US', { weekday: 'short' }),
      dateNum: date.getDate()
    };
  });

  // Generate time slots based on day of week
  const generateTimeSlots = (date) => {
    const dayOfWeek = new Date(date).getDay();
    const slots = [];
    
    // Different time slots for different days
    if (dayOfWeek === 1 || dayOfWeek === 3) { // Monday and Wednesday
      for (let hour = 9; hour < 13; hour++) {
        slots.push(formatTimeSlot(hour, 0));
        slots.push(formatTimeSlot(hour, 30));
      }
    } else if (dayOfWeek === 2 || dayOfWeek === 4) { // Tuesday and Thursday
      for (let hour = 14; hour < 18; hour++) {
        slots.push(formatTimeSlot(hour, 0));
        slots.push(formatTimeSlot(hour, 30));
      }
    } else if (dayOfWeek === 5) { // Friday
      for (let hour = 10; hour < 16; hour++) {
        slots.push(formatTimeSlot(hour, 0));
        slots.push(formatTimeSlot(hour, 30));
      }
    } else { // Saturday and Sunday
      for (let hour = 11; hour < 15; hour++) {
        slots.push(formatTimeSlot(hour, 0));
        slots.push(formatTimeSlot(hour, 30));
      }
    }
    
    return slots;
  };

  // Format time slot in 12-hour format
  const formatTimeSlot = (hour, minute) => {
    const period = hour >= 12 ? 'PM' : 'AM';
    const displayHour = hour % 12 || 12;
    const nextHour = (hour + 1) % 12 || 12;
    const nextPeriod = (hour + 1) >= 12 ? 'PM' : 'AM';
    
    return `${displayHour}:${minute.toString().padStart(2, '0')} ${period} - ${nextHour}:${minute.toString().padStart(2, '0')} ${nextPeriod}`;
  };

  // Filter doctors based on search query
  useEffect(() => {
    const filtered = doctorsData.filter(doctor => 
      doctor.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doctor.specialty.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setFilteredDoctors(filtered);
  }, [searchQuery]);

  // Update time slots when date changes
  useEffect(() => {
    if (selectedDate) {
      setAvailableTimeSlots(generateTimeSlots(selectedDate));
    }
  }, [selectedDate]);

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.doctorId) {
      newErrors.doctorId = 'Please select a doctor';
    }
    if (!formData.date) {
      newErrors.date = 'Please select a date';
    }
    if (!formData.time) {
      newErrors.time = 'Please select a time';
    }
    if (!formData.type) {
      newErrors.type = 'Please select appointment type';
    }
    if (!formData.reason.trim()) {
      newErrors.reason = 'Please provide a reason for the appointment';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handleDateSelect = (date) => {
    setSelectedDate(date);
    setFormData(prev => ({
      ...prev,
      date,
      time: '' // Reset time when date changes
    }));
  };

  const handleTimeSelect = (time) => {
    setFormData(prev => ({
      ...prev,
      time
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      toast.error('Please fill in all required fields');
      return;
    }

    const selectedDoctor = doctorsData.find(doc => doc.id === formData.doctorId);
    const appointmentData = {
      ...formData,
      doctorName: selectedDoctor?.name,
      status: 'Scheduled',
      id: Date.now(),
      createdAt: new Date().toISOString()
    };
    
    // Save to localStorage with sorting
    const existingAppointments = JSON.parse(localStorage.getItem('appointments') || '[]');
    const updatedAppointments = [...existingAppointments, appointmentData].sort((a, b) => {
      // First sort by status (Scheduled first, then Completed, then Cancelled)
      const statusOrder = { 'Scheduled': 0, 'Completed': 1, 'Cancelled': 2 };
      if (statusOrder[a.status] !== statusOrder[b.status]) {
        return statusOrder[a.status] - statusOrder[b.status];
      }
      // Then sort by date
      return new Date(a.date) - new Date(b.date);
    });
    localStorage.setItem('appointments', JSON.stringify(updatedAppointments));
    
    // Update state and show success modal
    setBookingDetails(appointmentData);
    setShowSuccessModal(true);
    onBookAppointment(appointmentData);
    toast.success('Appointment booked successfully!');
    
    // Reset form
    setFormData({
      doctorId: '',
      date: '',
      time: '',
      type: 'Regular',
      reason: ''
    });
    setErrors({});
  };

  const handleCloseSuccessModal = () => {
    setShowSuccessModal(false);
    navigate('/patient-dashboard/appointments');
  };

  return (
    <div className="book-appointment-container">
      <Card className="appointment-form-card">
        <Card.Body>
          <h3 className="form-title">Book an Appointment</h3>
          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-4">
              <Form.Label>Search Doctor</Form.Label>
              <Form.Control
                type="text"
                placeholder="Search by name or specialization..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="mb-2"
              />
              <div className="doctor-list">
                <Row>
                  {filteredDoctors.map(doctor => (
                    <Col key={doctor.id} xs={6} className="mb-2">
                      <div
                        className={`doctor-option ${formData.doctorId === doctor.id ? 'selected' : ''}`}
                        onClick={() => handleInputChange({ target: { name: 'doctorId', value: doctor.id } })}
                      >
                        <div className="doctor-info">
                          <div className="doctor-details">
                            <h5>{doctor.name}</h5>
                            <p>{doctor.specialty} • {doctor.experience} years</p>
                          </div>
                          <div className="doctor-fee">
                            {doctor.fee}
                          </div>
                        </div>
                      </div>
                    </Col>
                  ))}
                </Row>
              </div>
            </Form.Group>

            <Form.Group className="mb-4">
              <Form.Label>Select Date</Form.Label>
              <div className="date-selection">
                {nextSevenDays.map(({ date, day, dateNum }) => (
                  <div
                    key={date}
                    className={`date-box ${selectedDate === date ? 'selected' : ''}`}
                    onClick={() => handleDateSelect(date)}
                  >
                    <div className="day">{day}</div>
                    <div className="date">{dateNum}</div>
                  </div>
                ))}
              </div>
            </Form.Group>

            {selectedDate && (
              <Form.Group className="mb-4">
                <Form.Label>Select Time Slot</Form.Label>
                <div className="time-slots">
                  {availableTimeSlots.map((slot, index) => (
                    <div
                      key={index}
                      className={`time-slot ${formData.time === slot ? 'selected' : ''}`}
                      onClick={() => handleTimeSelect(slot)}
                    >
                      {slot}
                    </div>
                  ))}
                </div>
              </Form.Group>
            )}

            <Form.Group className="mb-4">
              <Form.Label>Appointment Type</Form.Label>
              <Form.Select
                name="type"
                value={formData.type}
                onChange={handleInputChange}
                required
                isInvalid={!!errors.type}
              >
                <option value="Regular">Regular Checkup</option>
                <option value="Follow-up">Follow-up</option>
                <option value="Emergency">Emergency</option>
              </Form.Select>
              <Form.Control.Feedback type="invalid">
                {errors.type}
              </Form.Control.Feedback>
            </Form.Group>

            <Form.Group className="mb-4">
              <Form.Label>Reason for Visit</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                name="reason"
                value={formData.reason}
                onChange={handleInputChange}
                required
                isInvalid={!!errors.reason}
              />
              <Form.Control.Feedback type="invalid">
                {errors.reason}
              </Form.Control.Feedback>
            </Form.Group>

            <Button variant="success" type="submit" className="submit-button">
              Book Appointment
            </Button>
          </Form>
        </Card.Body>
      </Card>

      {/* Success Modal */}
      <Modal show={showSuccessModal} onHide={handleCloseSuccessModal} centered>
        <Modal.Header closeButton>
          <Modal.Title>Appointment Booked Successfully!</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {bookingDetails && (
            <div className="booking-details">
              <h5>Appointment Details:</h5>
              <div className="detail-item">
                <strong>Doctor:</strong> {bookingDetails.doctorName}
              </div>
              <div className="detail-item">
                <strong>Date:</strong> {new Date(bookingDetails.date).toLocaleDateString()}
              </div>
              <div className="detail-item">
                <strong>Time:</strong> {bookingDetails.time}
              </div>
              <div className="detail-item">
                <strong>Type:</strong> {bookingDetails.type}
              </div>
              <div className="detail-item">
                <strong>Reason:</strong> {bookingDetails.reason}
              </div>
            </div>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseSuccessModal}>
            Close
          </Button>
          <Button variant="primary" onClick={handleCloseSuccessModal}>
            View My Appointments
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default BookAppointment; 