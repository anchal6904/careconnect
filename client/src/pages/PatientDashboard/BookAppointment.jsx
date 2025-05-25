import React, { useState, useEffect } from 'react';
import {
  Card, Form, Button, Row, Col, Alert, Spinner
} from 'react-bootstrap';
import {
  FaCalendarAlt, FaClock, FaUserMd, FaHospital
} from 'react-icons/fa';
import { fetchDoctorsVisible } from '../../api/api';
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
  const [doctors, setDoctors] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  const timeSlots = [
    '09:00 AM', '09:30 AM', '10:00 AM', '10:30 AM',
    '11:00 AM', '11:30 AM', '02:00 PM', '02:30 PM',
    '03:00 PM', '03:30 PM', '04:00 PM', '04:30 PM'
  ];

  useEffect(() => {
    const loadDoctors = async () => {
      try {
        const response = await fetchDoctorsVisible();
        if (response.data.success) {
          const visibleDoctors = response.data.data;
          setDoctors(visibleDoctors);

          const uniqueDepartments = Array.from(
            new Set(visibleDoctors.map(doc => doc.specialty))
          ).map(specialty => ({
            id: specialty,
            name: specialty.charAt(0).toUpperCase() + specialty.slice(1)
          }));

          setDepartments(uniqueDepartments);
        } else {
          setError('Failed to fetch doctors.');
        }
      } catch (err) {
        setError('Error loading doctors.');
      } finally {
        setIsLoading(false);
      }
    };

    loadDoctors();
  }, []);

  useEffect(() => {
    // Replace this with real API in future
    setPreviousDoctors([
      { id: 1, name: 'Dr. John Smith', department: 'Cardiology', lastVisit: '2024-02-15' },
      { id: 3, name: 'Dr. Michael Brown', department: 'Neurology', lastVisit: '2024-01-20' }
    ]);
  }, []);

  const handleInputChange = (e) => {
    const { name, value, checked } = e.target;
    const newValue = name === 'isFollowUp' ? checked : value;

    setFormData(prev => ({
      ...prev,
      [name]: newValue,
      ...(name === 'department' ? { doctor: '' } : {})
    }));
  };

  const handleDateChange = (e) => {
    const selected = new Date(e.target.value);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    if (selected < today || selected > tomorrow) {
      setError('Please select today or tomorrow only.');
      return;
    }

    setError('');
    setFormData(prev => ({ ...prev, date: e.target.value }));

    const available = timeSlots.filter(() => Math.random() > 0.3);
    setAvailableTimeSlots(available);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const { department, doctor, date, timeSlot } = formData;
    if (!department || !doctor || !date || !timeSlot) {
      setError('All required fields must be filled.');
      return;
    }

    console.log('Booking Data:', formData);
    setSuccess('Appointment booked successfully!');
    setError('');

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
    setFormData({
      department: doctor.department,
      doctor: doctor.id.toString(),
      date: '',
      timeSlot: '',
      reason: '',
      isFollowUp: true,
      previousDoctor: doctor.id.toString()
    });
  };

  const getDoctorsForDepartment = (dept) =>
    doctors.filter(doc => doc.specialty.toLowerCase() === dept.toLowerCase());

  if (isLoading) {
    return (
      <div className="text-center p-5">
        <Spinner animation="border" />
      </div>
    );
  }

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
                    {getDoctorsForDepartment(formData.department).map(doc => (
                      <option key={doc.id} value={doc.id}>
                        {doc.name} - ₹{doc.consultation_fee || 500}
                      </option>
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
                placeholder="Describe your symptoms or reason"
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
              {previousDoctors.map(doc => (
                <div key={doc.id} className="previous-doctor-item">
                  <div className="doctor-info">
                    <h5>{doc.name}</h5>
                    <p className="text-muted">{doc.department}</p>
                    <p className="text-muted">Last Visit: {doc.lastVisit}</p>
                  </div>
                  <Button
                    variant="outline-primary"
                    onClick={() => handleFollowUp(doc)}
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
