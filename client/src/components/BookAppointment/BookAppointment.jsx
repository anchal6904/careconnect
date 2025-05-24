import React, { useState } from 'react';
import { Form, Button, Card } from 'react-bootstrap';
import { doctors } from '../../data/dummyData';
import './BookAppointment.css';

const BookAppointment = ({ onBookAppointment }) => {
  const [formData, setFormData] = useState({
    doctorId: '',
    date: '',
    time: '',
    reason: '',
    type: 'Regular'
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const selectedDoctor = doctors.find(doc => doc.id === parseInt(formData.doctorId));
    const appointmentData = {
      ...formData,
      doctorName: selectedDoctor?.name,
      status: 'Scheduled'
    };
    onBookAppointment(appointmentData);
  };

  return (
    <div className="book-appointment-container">
      <Card className="appointment-form-card">
        <Card.Body>
          <h3 className="form-title">Book an Appointment</h3>
          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3">
              <Form.Label>Select Doctor</Form.Label>
              <Form.Select
                name="doctorId"
                value={formData.doctorId}
                onChange={handleInputChange}
                required
              >
                <option value="">Choose a doctor...</option>
                {doctors.map(doctor => (
                  <option key={doctor.id} value={doctor.id}>
                    Dr. {doctor.name} - {doctor.specialization}
                  </option>
                ))}
              </Form.Select>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Date</Form.Label>
              <Form.Control
                type="date"
                name="date"
                value={formData.date}
                onChange={handleInputChange}
                required
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Time</Form.Label>
              <Form.Control
                type="time"
                name="time"
                value={formData.time}
                onChange={handleInputChange}
                required
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Appointment Type</Form.Label>
              <Form.Select
                name="type"
                value={formData.type}
                onChange={handleInputChange}
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
                onChange={handleInputChange}
                required
              />
            </Form.Group>

            <Button variant="primary" type="submit" className="submit-button">
              Book Appointment
            </Button>
          </Form>
        </Card.Body>
      </Card>
    </div>
  );
};

export default BookAppointment; 