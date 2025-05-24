import React, { useState } from 'react';
import { Container, Row, Col, Card, Button, Modal, Form } from 'react-bootstrap';
import { FaPlus, FaEdit, FaTrash } from 'react-icons/fa';
import './Schedule.css';

const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
const TIME_SLOTS = [
  '09:00 AM', '09:30 AM', '10:00 AM', '10:30 AM', '11:00 AM', '11:30 AM',
  '12:00 PM', '12:30 PM', '01:00 PM', '01:30 PM', '02:00 PM', '02:30 PM',
  '03:00 PM', '03:30 PM', '04:00 PM', '04:30 PM', '05:00 PM'
];

const Schedule = () => {
  const [schedule, setSchedule] = useState(() => {
    const savedSchedule = localStorage.getItem('doctorSchedule');
    return savedSchedule ? JSON.parse(savedSchedule) : {};
  });
  const [showModal, setShowModal] = useState(false);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [formData, setFormData] = useState({
    day: '',
    startTime: '',
    endTime: '',
    type: 'Regular'
  });

  const handleAddSlot = () => {
    setSelectedSlot(null);
    setFormData({
      day: '',
      startTime: '',
      endTime: '',
      type: 'Regular'
    });
    setShowModal(true);
  };

  const handleEditSlot = (day, slot) => {
    setSelectedSlot({ day, ...slot });
    setFormData({
      day,
      startTime: slot.startTime,
      endTime: slot.endTime,
      type: slot.type
    });
    setShowModal(true);
  };

  const handleDeleteSlot = (day, slotIndex) => {
    const newSchedule = { ...schedule };
    newSchedule[day].splice(slotIndex, 1);
    if (newSchedule[day].length === 0) {
      delete newSchedule[day];
    }
    setSchedule(newSchedule);
    localStorage.setItem('doctorSchedule', JSON.stringify(newSchedule));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const newSchedule = { ...schedule };
    
    if (!newSchedule[formData.day]) {
      newSchedule[formData.day] = [];
    }

    const slotData = {
      startTime: formData.startTime,
      endTime: formData.endTime,
      type: formData.type
    };

    if (selectedSlot) {
      const index = newSchedule[formData.day].findIndex(
        slot => slot.startTime === selectedSlot.startTime && slot.endTime === selectedSlot.endTime
      );
      if (index !== -1) {
        newSchedule[formData.day][index] = slotData;
      }
    } else {
      newSchedule[formData.day].push(slotData);
    }

    setSchedule(newSchedule);
    localStorage.setItem('doctorSchedule', JSON.stringify(newSchedule));
    setShowModal(false);
  };

  return (
    <Container className="schedule-container">
      <Row className="mb-4">
        <Col>
          <h2>Weekly Schedule</h2>
        </Col>
        <Col xs="auto">
          <Button variant="primary" onClick={handleAddSlot}>
            <FaPlus className="me-2" />
            Add Time Slot
          </Button>
        </Col>
      </Row>

      <Row>
        {DAYS.map(day => (
          <Col key={day} md={6} lg={4} className="mb-4">
            <Card className="schedule-card">
              <Card.Header>
                <h3>{day}</h3>
              </Card.Header>
              <Card.Body>
                {schedule[day]?.length > 0 ? (
                  schedule[day].map((slot, index) => (
                    <div key={index} className="time-slot">
                      <div className="slot-info">
                        <span className="time">{slot.startTime} - {slot.endTime}</span>
                        <span className="type">{slot.type}</span>
                      </div>
                      <div className="slot-actions">
                        <Button
                          variant="outline-primary"
                          size="sm"
                          onClick={() => handleEditSlot(day, slot)}
                        >
                          <FaEdit />
                        </Button>
                        <Button
                          variant="outline-danger"
                          size="sm"
                          onClick={() => handleDeleteSlot(day, index)}
                        >
                          <FaTrash />
                        </Button>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-muted">No slots scheduled</p>
                )}
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>

      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>
            {selectedSlot ? 'Edit Time Slot' : 'Add Time Slot'}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3">
              <Form.Label>Day</Form.Label>
              <Form.Select
                value={formData.day}
                onChange={(e) => setFormData({ ...formData, day: e.target.value })}
                required
              >
                <option value="">Select Day</option>
                {DAYS.map(day => (
                  <option key={day} value={day}>{day}</option>
                ))}
              </Form.Select>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Start Time</Form.Label>
              <Form.Select
                value={formData.startTime}
                onChange={(e) => setFormData({ ...formData, startTime: e.target.value })}
                required
              >
                <option value="">Select Start Time</option>
                {TIME_SLOTS.map(time => (
                  <option key={time} value={time}>{time}</option>
                ))}
              </Form.Select>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>End Time</Form.Label>
              <Form.Select
                value={formData.endTime}
                onChange={(e) => setFormData({ ...formData, endTime: e.target.value })}
                required
              >
                <option value="">Select End Time</option>
                {TIME_SLOTS.map(time => (
                  <option key={time} value={time}>{time}</option>
                ))}
              </Form.Select>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Type</Form.Label>
              <Form.Select
                value={formData.type}
                onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                required
              >
                <option value="Regular">Regular</option>
                <option value="Emergency">Emergency</option>
                <option value="Follow-up">Follow-up</option>
              </Form.Select>
            </Form.Group>

            <div className="d-flex justify-content-end">
              <Button variant="secondary" className="me-2" onClick={() => setShowModal(false)}>
                Cancel
              </Button>
              <Button variant="primary" type="submit">
                {selectedSlot ? 'Update' : 'Add'} Slot
              </Button>
            </div>
          </Form>
        </Modal.Body>
      </Modal>
    </Container>
  );
};

export default Schedule; 