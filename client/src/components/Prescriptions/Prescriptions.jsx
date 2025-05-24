import React, { useState } from 'react';
import { Button, Modal } from 'react-bootstrap';
import DataTable from '../DataTable/DataTable';
import './Prescriptions.css';

const Prescriptions = ({ prescriptions, onViewPrescription }) => {
  const [showModal, setShowModal] = useState(false);
  const [selectedPrescription, setSelectedPrescription] = useState(null);

  const handleViewPrescription = (prescription) => {
    setSelectedPrescription(prescription);
    setShowModal(true);
    onViewPrescription(prescription);
  };

  const columns = [
    { key: 'doctorName', label: 'Doctor' },
    { key: 'date', label: 'Date', render: (date) => new Date(date).toLocaleDateString() },
    { key: 'medications', label: 'Medications', render: (meds) => `${meds.length} medications` }
  ];

  const actions = [
    { type: 'view', label: 'View', variant: 'outline-primary' }
  ];

  const handleActionClick = (actionType, prescription) => {
    if (actionType === 'view') {
      handleViewPrescription(prescription);
    }
  };

  return (
    <div className="prescriptions-container">
      <DataTable
        title="My Prescriptions"
        columns={columns}
        data={prescriptions}
        actions={actions}
        onActionClick={handleActionClick}
      />

      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Prescription Details</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedPrescription && (
            <>
              <p><strong>Doctor:</strong> {selectedPrescription.doctorName}</p>
              <p><strong>Date:</strong> {new Date(selectedPrescription.date).toLocaleDateString()}</p>
              <h6 className="mt-3">Medications:</h6>
              <ul>
                {selectedPrescription.medications.map((med, index) => (
                  <li key={index}>
                    <strong>{med.name}</strong>
                    <br />
                    Dosage: {med.dosage}
                    <br />
                    Frequency: {med.frequency}
                    <br />
                    Duration: {med.duration}
                  </li>
                ))}
              </ul>
              <p><strong>Notes:</strong> {selectedPrescription.notes}</p>
            </>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default Prescriptions; 