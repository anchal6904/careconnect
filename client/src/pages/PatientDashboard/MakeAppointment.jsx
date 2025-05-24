import React, { useState, useEffect } from 'react';
import { Container, Form, Button, Card, Row, Col } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { getUsername } from '../../utils/auth';
import './MakeAppointment.css';

// Dummy data for doctors and departments
const DEPARTMENTS = [
  'Cardiology',
  'Neurology',
  'Dermatology',
  'Orthopedics',
  'Pediatrics',
  'Gynecology'
];

const DOCTORS = {
  'Cardiology': ['Dr. Sarah Wilson', 'Dr. Michael Brown'],
  'Neurology': ['Dr. Emily Davis', 'Dr. James Wilson'],
  'Dermatology': ['Dr. Robert Johnson', 'Dr. Lisa Anderson'],
  'Orthopedics': ['Dr. David Miller', 'Dr. Jennifer White'],
  'Pediatrics': ['Dr. Thomas Clark', 'Dr. Mary Taylor'],
  'Gynecology': ['Dr. Patricia Moore', 'Dr. Richard Lee']
};

const MakeAppointment = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: getUsername(),
    gender: '',
    email: '',
    department: '',
    doctor: '',
    date: '',
    timeSlot: '',
    type: 'Regular',
    reason: ''
  });

  const [availableTimeSlots, setAvailableTimeSlots] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Simulate fetching doctor's schedule
    if (formData.doctor && formData.date) {
      setLoading(true);
      setTimeout(() => {
        const schedule = JSON.parse(localStorage.getItem('doctorSchedule') || '{}');
        const day = new Date(formData.date).toLocaleDateString('en-US', { weekday: 'long' });
        setAvailableTimeSlots(schedule[day] || []);
        setLoading(false);
      }, 1000);
    }
  }, [formData.doctor, formData.date]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
      // Reset dependent fields
      ...(name === 'department' && { doctor: '' }),
      ...(name === 'doctor' && { timeSlot: '' })
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);

    // Simulate API call
    setTimeout(() => {
      // Save appointment to localStorage
      const appointments = JSON.parse(localStorage.getItem('appointments') || '[]');
      appointments.push({
        id: Date.now(),
        ...formData,
        status: 'Upcoming'
      });
      localStorage.setItem('appointments', JSON.stringify(appointments));

      toast.success('Appointment booked successfully!');
      navigate('/patient-dashboard/appointments');
      setLoading(false);
    }, 1500);
  };

  return (
    <Container className="make-appointment-container">
      <Card className="appointment-form-card">
        <Card.Header>
          <h2>Book an Appointment</h2>
        </Card.Header>
        <Card.Body>
          <Form onSubmit={handleSubmit}>
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Full Name</Form.Label>
                  <Form.Control
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Gender</Form.Label>
                  <Form.Select
                    name="gender"
                    value={formData.gender}
                    onChange={handleChange}
                    required
                  >
                    <option value="">Select Gender</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </Form.Select>
                </Form.Group>
              </Col>
            </Row>

            <Form.Group className="mb-3">
              <Form.Label>Email</Form.Label>
              <Form.Control
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </Form.Group>

            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Department</Form.Label>
                  <Form.Select
                    name="department"
                    value={formData.department}
                    onChange={handleChange}
                    required
                  >
                    <option value="">Select Department</option>
                    {DEPARTMENTS.map(dept => (
                      <option key={dept} value={dept}>{dept}</option>
                    ))}
                  </Form.Select>
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Doctor</Form.Label>
                  <Form.Select
                    name="doctor"
                    value={formData.doctor}
                    onChange={handleChange}
                    required
                    disabled={!formData.department}
                  >
                    <option value="">Select Doctor</option>
                    {formData.department && DOCTORS[formData.department].map(doctor => (
                      <option key={doctor} value={doctor}>{doctor}</option>
                    ))}
                  </Form.Select>
                </Form.Group>
              </Col>
            </Row>

            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Date</Form.Label>
                  <Form.Control
                    type="date"
                    name="date"
                    value={formData.date}
                    onChange={handleChange}
                    min={new Date().toISOString().split('T')[0]}
                    required
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Time Slot</Form.Label>
                  <Form.Select
                    name="timeSlot"
                    value={formData.timeSlot}
                    onChange={handleChange}
                    required
                    disabled={!formData.doctor || !formData.date || loading}
                  >
                    <option value="">Select Time Slot</option>
                    {availableTimeSlots.map((slot, index) => (
                      <option key={index} value={`${slot.startTime}-${slot.endTime}`}>
                        {slot.startTime} - {slot.endTime} ({slot.type})
                      </option>
                    ))}
                  </Form.Select>
                </Form.Group>
              </Col>
            </Row>

            <Form.Group className="mb-3">
              <Form.Label>Appointment Type</Form.Label>
              <Form.Select
                name="type"
                value={formData.type}
                onChange={handleChange}
                required
              >
                <option value="Regular">Regular Checkup</option>
                <option value="Follow-up">Follow-up</option>
                <option value="Emergency">Emergency</option>
              </Form.Select>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Reason for Visit</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                name="reason"
                value={formData.reason}
                onChange={handleChange}
                required
              />
            </Form.Group>

            <div className="d-flex justify-content-end">
              <Button
                variant="primary"
                type="submit"
                disabled={loading}
              >
                {loading ? 'Booking...' : 'Book Appointment'}
              </Button>
            </div>
          </Form>
        </Card.Body>
      </Card>
    </Container>
  );
};

export default MakeAppointment; 