import React, { useState } from 'react';
import { Tabs, Tab, Button, Modal } from 'react-bootstrap';
import DataTable from '../DataTable/DataTable';
import './Appointments.css';

const Appointments = ({ appointments, onViewAppointment, onCancelAppointment }) => {
  const [showModal, setShowModal] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState(null);

  const handleViewAppointment = (appointment) => {
    setSelectedAppointment(appointment);
    setShowModal(true);
    onViewAppointment(appointment);
  };

  const columns = [
    { key: 'doctorName', label: 'Doctor' },
    { key: 'date', label: 'Date', render: (date) => new Date(date).toLocaleDateString() },
    { key: 'time', label: 'Time' },
    { key: 'reason', label: 'Reason' }
  ];

  const actions = [
    { type: 'view', label: 'View', variant: 'outline-primary' },
    { type: 'cancel', label: 'Cancel', variant: 'outline-danger' }
  ];

  const handleActionClick = (actionType, appointment) => {
    if (actionType === 'view') {
      handleViewAppointment(appointment);
    } else if (actionType === 'cancel') {
      onCancelAppointment(appointment.id);
    }
  };

  const renderAppointmentsTable = (filteredAppointments) => (
    <DataTable
      columns={columns}
      data={filteredAppointments}
      actions={actions}
      onActionClick={handleActionClick}
      statusConfig={{
        'Scheduled': { color: 'warning' },
        'Completed': { color: 'success' },
        'Cancelled': { color: 'danger' }
      }}
    />
  );

  return (
    <div className="appointments-container">
      <Tabs defaultActiveKey="upcoming" className="mb-4">
        <Tab eventKey="upcoming" title="Upcoming">
          {renderAppointmentsTable(appointments.filter(apt => apt.status === 'Scheduled'))}
        </Tab>
        <Tab eventKey="completed" title="Completed">
          {renderAppointmentsTable(appointments.filter(apt => apt.status === 'Completed'))}
        </Tab>
        <Tab eventKey="cancelled" title="Cancelled">
          {renderAppointmentsTable(appointments.filter(apt => apt.status === 'Cancelled'))}
        </Tab>
      </Tabs>

      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Appointment Details</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedAppointment && (
            <>
              <p><strong>Doctor:</strong> {selectedAppointment.doctorName}</p>
              <p><strong>Date:</strong> {new Date(selectedAppointment.date).toLocaleDateString()}</p>
              <p><strong>Time:</strong> {selectedAppointment.time}</p>
              <p><strong>Status:</strong> {selectedAppointment.status}</p>
              <p><strong>Reason:</strong> {selectedAppointment.reason}</p>
              <p><strong>Type:</strong> {selectedAppointment.type}</p>
            </>
          )}
        </Modal.Body>
        <Modal.Footer>
          {selectedAppointment?.status === 'Scheduled' && (
            <Button 
              variant="danger" 
              onClick={() => {
                onCancelAppointment(selectedAppointment.id);
                setShowModal(false);
              }}
            >
              Cancel Appointment
            </Button>
          )}
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default Appointments; 