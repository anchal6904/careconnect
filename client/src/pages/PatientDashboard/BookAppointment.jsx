import React, { useState, useEffect } from 'react';
import { Card, Form, Button, Row, Col, Alert } from 'react-bootstrap';
import { FaCalendarAlt, FaClock, FaUserMd, FaHospital } from 'react-icons/fa';
import './BookAppointment.css';

const BookAppointment = () => {
  const [formData, setFormData] = useState({
    department: '',
    doctor: '',
    date: '',
    timeSlot: '',
    reason: '',
    isFollowUp: false,
    previousDoctor: ''
  });

  const [availableTimeSlots, setAvailableTimeSlots] = useState([]);
  const [previousDoctors, setPreviousDoctors] = useState([]);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Mock data - Replace with actual API calls
  const departments = [
    { id: 1, name: 'Cardiology' },
    { id: 2, name: 'Neurology' },
    { id: 3, name: 'Orthopedics' },
    { id: 4, name: 'Pediatrics' }
  ];

  const doctors = {
    1: [
      { id: 1, name: 'Dr. John Smith', specialization: 'Cardiologist' },
      { id: 2, name: 'Dr. Sarah Johnson', specialization: 'Cardiologist' }
    ],
    2: [
      { id: 3, name: 'Dr. Michael Brown', specialization: 'Neurologist' },
      { id: 4, name: 'Dr. Emily Davis', specialization: 'Neurologist' }
    ],
    // Add more departments and doctors
  };

  const timeSlots = [
    '09:00 AM', '09:30 AM', '10:00 AM', '10:30 AM',
    '11:00 AM', '11:30 AM', '02:00 PM', '02:30 PM',
    '03:00 PM', '03:30 PM', '04:00 PM', '04:30 PM'
  ];

  useEffect(() => {
    // Mock previous doctors data - Replace with actual API call
    setPreviousDoctors([
      { id: 1, name: 'Dr. John Smith', department: 'Cardiology', lastVisit: '2024-02-15' },
      { id: 3, name: 'Dr. Michael Brown', department: 'Neurology', lastVisit: '2024-01-20' }
    ]);
  }, []);

  const handleInputChange = (e) => {
    const { name, value, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'isFollowUp' ? checked : value
    }));

    if (name === 'department') {
      setFormData(prev => ({ ...prev, doctor: '' }));
    }
  };

  const handleDateChange = (e) => {
    const selectedDate = e.target.value;
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const selectedDateObj = new Date(selectedDate);
    if (selectedDateObj < today || selectedDateObj > tomorrow) {
      setError('Please select today or tomorrow\'s date');
      return;
    }

    setFormData(prev => ({ ...prev, date: selectedDate }));
    setError('');
    // Mock available time slots - Replace with actual API call
    setAvailableTimeSlots(timeSlots.filter(slot => Math.random() > 0.3));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.department || !formData.doctor || !formData.date || !formData.timeSlot) {
      setError('Please fill in all required fields');
      return;
    }

    // Mock API call
    console.log('Booking appointment:', formData);
    setSuccess('Appointment booked successfully!');
    setFormData({
      department: '',
      doctor: '',
      date: '',
      timeSlot: '',
      reason: '',
      isFollowUp: false,
      previousDoctor: ''
    });
  };

  const handleFollowUp = (doctor) => {
    setFormData(prev => ({
      ...prev,
      department: doctor.department,
      doctor: doctor.id.toString(),
      isFollowUp: true,
      previousDoctor: doctor.id.toString()
    }));
  };

  return (
    <div className="book-appointment-container">
      <Card className="book-appointment-card">
        <Card.Body>
          <h3 className="text-center mb-4">Book an Appointment</h3>
          
          {error && <Alert variant="danger">{error}</Alert>}
          {success && <Alert variant="success">{success}</Alert>}

          <Form onSubmit={handleSubmit}>
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label><FaHospital className="me-2" />Department</Form.Label>
                  <Form.Select
                    name="department"
                    value={formData.department}
                    onChange={handleInputChange}
                    required
                  >
                    <option value="">Select Department</option>
                    {departments.map(dept => (
                      <option key={dept.id} value={dept.id}>{dept.name}</option>
                    ))}
                  </Form.Select>
                </Form.Group>
              </Col>

              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label><FaUserMd className="me-2" />Doctor</Form.Label>
                  <Form.Select
                    name="doctor"
                    value={formData.doctor}
                    onChange={handleInputChange}
                    required
                    disabled={!formData.department}
                  >
                    <option value="">Select Doctor</option>
                    {formData.department && doctors[formData.department]?.map(doc => (
                      <option key={doc.id} value={doc.id}>{doc.name}</option>
                    ))}
                  </Form.Select>
                </Form.Group>
              </Col>
            </Row>

            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label><FaCalendarAlt className="me-2" />Date</Form.Label>
                  <Form.Control
                    type="date"
                    name="date"
                    value={formData.date}
                    onChange={handleDateChange}
                    required
                  />
                </Form.Group>
              </Col>

              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label><FaClock className="me-2" />Time Slot</Form.Label>
                  <Form.Select
                    name="timeSlot"
                    value={formData.timeSlot}
                    onChange={handleInputChange}
                    required
                    disabled={!formData.date}
                  >
                    <option value="">Select Time Slot</option>
                    {availableTimeSlots.map(slot => (
                      <option key={slot} value={slot}>{slot}</option>
                    ))}
                  </Form.Select>
                </Form.Group>
              </Col>
            </Row>

            <Form.Group className="mb-3">
              <Form.Label>Reason for Visit</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                name="reason"
                value={formData.reason}
                onChange={handleInputChange}
                placeholder="Please describe your symptoms or reason for visit"
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Check
                type="checkbox"
                label="This is a follow-up appointment"
                name="isFollowUp"
                checked={formData.isFollowUp}
                onChange={handleInputChange}
              />
            </Form.Group>

            <Button variant="primary" type="submit" className="w-100">
              Book Appointment
            </Button>
          </Form>
        </Card.Body>
      </Card>

      {previousDoctors.length > 0 && (
        <Card className="previous-doctors-card mt-4">
          <Card.Body>
            <h4 className="mb-3">Previous Doctors</h4>
            <div className="previous-doctors-list">
              {previousDoctors.map(doctor => (
                <div key={doctor.id} className="previous-doctor-item">
                  <div className="doctor-info">
                    <h5>{doctor.name}</h5>
                    <p className="text-muted">{doctor.department}</p>
                    <p className="text-muted">Last Visit: {doctor.lastVisit}</p>
                  </div>
                  <Button
                    variant="outline-primary"
                    onClick={() => handleFollowUp(doctor)}
                  >
                    Book Follow-up
                  </Button>
                </div>
              ))}
            </div>
          </Card.Body>
        </Card>
      )}
    </div>
  );
};

export default BookAppointment; 