import React, { useState, useEffect } from 'react';
import { Modal, Button } from 'react-bootstrap';
import DataTable from '../DataTable/DataTable';
import { appointments, prescriptions } from '../../data/dummyData';
import './MedicalRecords.css';

const MedicalRecords = ({ patientId }) => {
  const [records, setRecords] = useState([]);
  const [selectedRecord, setSelectedRecord] = useState(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    // Combine and sort appointments and prescriptions
    const patientAppointments = appointments
      .filter(apt => apt.patientId === patientId)
      .map(apt => ({
        ...apt,
        type: 'appointment',
        date: new Date(apt.date),
        recordType: 'Appointment'
      }));

    const patientPrescriptions = prescriptions
      .filter(pres => pres.patientId === patientId)
      .map(pres => ({
        ...pres,
        type: 'prescription',
        date: new Date(pres.date),
        recordType: 'Prescription'
      }));

    const combinedRecords = [...patientAppointments, ...patientPrescriptions]
      .sort((a, b) => b.date - a.date);

    setRecords(combinedRecords);
  }, [patientId]);

  const handleViewRecord = (record) => {
    setSelectedRecord(record);
    setShowModal(true);
  };

  const handleDownloadRecord = (record) => {
    // Implement download functionality
    console.log('Downloading record:', record);
  };

  const columns = [
    { key: 'recordType', label: 'Type' },
    { key: 'date', label: 'Date', render: (date) => date.toLocaleDateString() },
    { key: 'doctorName', label: 'Doctor' },
    { key: 'type', label: 'Details', render: (type, record) => 
      type === 'appointment' ? record.reason : `${record.medications.length} medications`
    }
  ];

  const actions = [
    { type: 'view', label: 'View', variant: 'outline-primary' },
    { type: 'download', label: 'Download', variant: 'outline-secondary' }
  ];

  const handleActionClick = (actionType, record) => {
    if (actionType === 'view') {
      handleViewRecord(record);
    } else if (actionType === 'download') {
      handleDownloadRecord(record);
    }
  };

  return (
    <div className="medical-records">
      <DataTable
        title="Medical Records"
        columns={columns}
        data={records}
        actions={actions}
        onActionClick={handleActionClick}
      />

      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>
            {selectedRecord?.type === 'appointment' ? 'Appointment Details' : 'Prescription Details'}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedRecord && (
            <>
              <p><strong>Date:</strong> {selectedRecord.date.toLocaleDateString()}</p>
              <p><strong>Doctor:</strong> {selectedRecord.doctorName}</p>
              {selectedRecord.type === 'appointment' ? (
                <>
                  <p><strong>Reason:</strong> {selectedRecord.reason}</p>
                  <p><strong>Status:</strong> {selectedRecord.status}</p>
                  <p><strong>Type:</strong> {selectedRecord.appointmentType}</p>
                </>
              ) : (
                <>
                  <h6>Medications:</h6>
                  <ul>
                    {selectedRecord.medications.map((med, index) => (
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
                  <p><strong>Notes:</strong> {selectedRecord.notes}</p>
                </>
              )}
            </>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Close
          </Button>
          <Button variant="primary" onClick={() => handleDownloadRecord(selectedRecord)}>
            Download
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default MedicalRecords; 