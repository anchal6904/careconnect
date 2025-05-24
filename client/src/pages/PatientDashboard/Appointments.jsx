import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Table, Badge, Button } from 'react-bootstrap';
import { FaEye, FaCalendarAlt } from 'react-icons/fa';
import './Appointments.css';

const Appointments = () => {
  const [appointments, setAppointments] = useState([]);
  const [filteredAppointments, setFilteredAppointments] = useState([]);
  const [statusFilter, setStatusFilter] = useState('all');

  useEffect(() => {
    // Simulate fetching appointments from localStorage
    const savedAppointments = JSON.parse(localStorage.getItem('appointments') || '[]');
    // Filter appointments for the current patient
    const patientAppointments = savedAppointments.filter(
      apt => apt.patientId === JSON.parse(localStorage.getItem('user'))?.id
    );
    setAppointments(patientAppointments);
    setFilteredAppointments(patientAppointments);
  }, []);

  useEffect(() => {
    if (statusFilter === 'all') {
      setFilteredAppointments(appointments);
    } else {
      const filtered = appointments.filter(apt => apt.status === statusFilter);
      setFilteredAppointments(filtered);
    }
  }, [statusFilter, appointments]);

  const getStatusBadge = (status) => {
    const variants = {
      'Upcoming': 'primary',
      'Completed': 'success',
      'Cancelled': 'danger',
      'No-show': 'warning'
    };
    return <Badge bg={variants[status]}>{status}</Badge>;
  };

  const handleCancelAppointment = (appointmentId) => {
    if (window.confirm('Are you sure you want to cancel this appointment?')) {
      const updatedAppointments = appointments.map(apt =>
        apt.id === appointmentId ? { ...apt, status: 'Cancelled' } : apt
      );
      setAppointments(updatedAppointments);
      localStorage.setItem('appointments', JSON.stringify(updatedAppointments));
    }
  };

  return (
    <Container className="appointments-container">
      <Row className="mb-4">
        <Col>
          <h2>My Appointments</h2>
        </Col>
      </Row>

      <Card className="mb-4">
        <Card.Body>
          <Row className="g-3">
            <Col md={4}>
              <select
                className="form-select"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <option value="all">All Appointments</option>
                <option value="Upcoming">Upcoming</option>
                <option value="Completed">Completed</option>
                <option value="Cancelled">Cancelled</option>
                <option value="No-show">No-show</option>
              </select>
            </Col>
          </Row>
        </Card.Body>
      </Card>

      <Card>
        <Card.Body>
          <div className="table-responsive">
            <Table hover>
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Time</th>
                  <th>Doctor</th>
                  <th>Department</th>
                  <th>Type</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredAppointments.length > 0 ? (
                  filteredAppointments.map((appointment) => (
                    <tr key={appointment.id}>
                      <td>{appointment.date}</td>
                      <td>{appointment.time}</td>
                      <td>{appointment.doctorName}</td>
                      <td>{appointment.department}</td>
                      <td>{appointment.type}</td>
                      <td>{getStatusBadge(appointment.status)}</td>
                      <td>
                        <div className="d-flex gap-2">
                          <Button
                            variant="outline-primary"
                            size="sm"
                            onClick={() => {/* View details */}}
                          >
                            <FaEye />
                          </Button>
                          {appointment.status === 'Upcoming' && (
                            <Button
                              variant="outline-danger"
                              size="sm"
                              onClick={() => handleCancelAppointment(appointment.id)}
                            >
                              Cancel
                            </Button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="7" className="text-center">
                      <div className="empty-state">
                        <FaCalendarAlt className="mb-3" style={{ fontSize: '2rem' }} />
                        <p>No appointments found</p>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </Table>
          </div>
        </Card.Body>
      </Card>
    </Container>
  );
};

export default Appointments; 