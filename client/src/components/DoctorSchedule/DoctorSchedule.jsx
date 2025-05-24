import React, { useState } from 'react';
import { Card, Button, Form, Row, Col, Badge } from 'react-bootstrap';
import { FaCalendarAlt, FaClock, FaPlus, FaTrash } from 'react-icons/fa';
import './DoctorSchedule.css';

const DoctorSchedule = ({ doctorId, onScheduleUpdate }) => {
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [timeSlots, setTimeSlots] = useState([
    { id: 1, startTime: '09:00', endTime: '09:30', status: 'available' },
    { id: 2, startTime: '09:30', endTime: '10:00', status: 'booked' },
    { id: 3, startTime: '10:00', endTime: '10:30', status: 'holiday' },
  ]);
  const [holidays, setHolidays] = useState([
    { id: 1, date: '2024-03-25', reason: 'Public Holiday' },
    { id: 2, date: '2024-04-01', reason: 'Personal Leave' },
  ]);
  const [showAddHoliday, setShowAddHoliday] = useState(false);
  const [newHoliday, setNewHoliday] = useState({ date: '', reason: '' });

  const handleAddTimeSlot = () => {
    const newSlot = {
      id: timeSlots.length + 1,
      startTime: '09:00',
      endTime: '09:30',
      status: 'available'
    };
    setTimeSlots([...timeSlots, newSlot]);
  };

  const handleDeleteTimeSlot = (id) => {
    setTimeSlots(timeSlots.filter(slot => slot.id !== id));
  };

  const handleTimeSlotChange = (id, field, value) => {
    setTimeSlots(timeSlots.map(slot =>
      slot.id === id ? { ...slot, [field]: value } : slot
    ));
  };

  const handleAddHoliday = () => {
    if (newHoliday.date && newHoliday.reason) {
      const holiday = {
        id: holidays.length + 1,
        date: newHoliday.date,
        reason: newHoliday.reason
      };
      setHolidays([...holidays, holiday]);
      setNewHoliday({ date: '', reason: '' });
      setShowAddHoliday(false);
    }
  };

  const handleDeleteHoliday = (id) => {
    setHolidays(holidays.filter(holiday => holiday.id !== id));
  };

  const handleSaveSchedule = () => {
    const scheduleData = {
      doctorId,
      date: selectedDate,
      timeSlots,
      holidays
    };
    onScheduleUpdate(scheduleData);
  };

  return (
    <div className="schedule-section">
      <div className="schedule-header">
        <h2>Schedule Management</h2>
        <div className="schedule-filters">
          <Form.Group className="mb-3">
            <Form.Label>Select Date</Form.Label>
            <Form.Control
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
            />
          </Form.Group>
        </div>
      </div>

      <Card className="schedule-card mb-4">
        <Card.Body>
          <div className="d-flex justify-content-between align-items-center mb-3">
            <h5 className="mb-0">Time Slots</h5>
            <Button variant="outline-primary" onClick={handleAddTimeSlot}>
              <FaPlus className="me-2" />Add Time Slot
            </Button>
          </div>

          <div className="time-slots-container">
            {timeSlots.map(slot => (
              <div key={slot.id} className="time-slot-item">
                <Row className="align-items-center">
                  <Col md={4}>
                    <Form.Group>
                      <Form.Label>Start Time</Form.Label>
                      <Form.Control
                        type="time"
                        value={slot.startTime}
                        onChange={(e) => handleTimeSlotChange(slot.id, 'startTime', e.target.value)}
                      />
                    </Form.Group>
                  </Col>
                  <Col md={4}>
                    <Form.Group>
                      <Form.Label>End Time</Form.Label>
                      <Form.Control
                        type="time"
                        value={slot.endTime}
                        onChange={(e) => handleTimeSlotChange(slot.id, 'endTime', e.target.value)}
                      />
                    </Form.Group>
                  </Col>
                  <Col md={3}>
                    <Form.Group>
                      <Form.Label>Status</Form.Label>
                      <Form.Select
                        value={slot.status}
                        onChange={(e) => handleTimeSlotChange(slot.id, 'status', e.target.value)}
                      >
                        <option value="available">Available</option>
                        <option value="booked">Booked</option>
                        <option value="holiday">Holiday</option>
                      </Form.Select>
                    </Form.Group>
                  </Col>
                  <Col md={1} className="text-end">
                    <Button
                      variant="outline-danger"
                      size="sm"
                      onClick={() => handleDeleteTimeSlot(slot.id)}
                    >
                      <FaTrash />
                    </Button>
                  </Col>
                </Row>
              </div>
            ))}
          </div>
        </Card.Body>
      </Card>

      <Card className="holidays-card">
        <Card.Body>
          <div className="d-flex justify-content-between align-items-center mb-3">
            <h5 className="mb-0">Holidays</h5>
            <Button
              variant="outline-primary"
              onClick={() => setShowAddHoliday(!showAddHoliday)}
            >
              <FaPlus className="me-2" />Add Holiday
            </Button>
          </div>

          {showAddHoliday && (
            <div className="add-holiday-form mb-3">
              <Row>
                <Col md={5}>
                  <Form.Group>
                    <Form.Label>Date</Form.Label>
                    <Form.Control
                      type="date"
                      value={newHoliday.date}
                      onChange={(e) => setNewHoliday({ ...newHoliday, date: e.target.value })}
                    />
                  </Form.Group>
                </Col>
                <Col md={5}>
                  <Form.Group>
                    <Form.Label>Reason</Form.Label>
                    <Form.Control
                      type="text"
                      placeholder="Enter reason for holiday"
                      value={newHoliday.reason}
                      onChange={(e) => setNewHoliday({ ...newHoliday, reason: e.target.value })}
                    />
                  </Form.Group>
                </Col>
                <Col md={2} className="d-flex align-items-end">
                  <Button variant="primary" onClick={handleAddHoliday}>
                    Add
                  </Button>
                </Col>
              </Row>
            </div>
          )}

          <div className="holidays-list">
            {holidays.map(holiday => (
              <div key={holiday.id} className="holiday-item">
                <div className="d-flex justify-content-between align-items-center">
                  <div>
                    <h6 className="mb-0">{new Date(holiday.date).toLocaleDateString()}</h6>
                    <p className="text-muted mb-0">{holiday.reason}</p>
                  </div>
                  <Button
                    variant="outline-danger"
                    size="sm"
                    onClick={() => handleDeleteHoliday(holiday.id)}
                  >
                    <FaTrash />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </Card.Body>
      </Card>

      <div className="schedule-actions mt-4">
        <Button variant="primary" onClick={handleSaveSchedule}>
          Save Schedule
        </Button>
      </div>
    </div>
  );
};

export default DoctorSchedule; 