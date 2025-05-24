import React, { useState, useEffect } from 'react';
import { Card, Table, Button, Modal } from 'react-bootstrap';
import { FaFileDownload, FaEye } from 'react-icons/fa';
import { prescriptions } from '../../data/dummyData';
import './Prescriptions.css';

const Prescriptions = () => {
  const [patientPrescriptions, setPatientPrescriptions] = useState([]);
  const [selectedPrescription, setSelectedPrescription] = useState(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    // Filter prescriptions for the current patient (assuming patient ID 1 for demo)
    const filteredPrescriptions = prescriptions.filter(pres => pres.patientId === 1);
    setPatientPrescriptions(filteredPrescriptions);
  }, []);

  const handleViewPrescription = (prescription) => {
    setSelectedPrescription(prescription);
    setShowModal(true);
  };

  const handleDownloadPrescription = (prescription) => {
    // Implement download functionality
    console.log('Downloading prescription:', prescription);
  };

  return (
    <div className="prescriptions-container">
      <Card className="prescriptions-card">
        <Card.Body>
          <h3 className="mb-4">My Prescriptions</h3>
          
          <Table responsive>
            <thead>
              <tr>
                <th>Date</th>
                <th>Doctor</th>
                <th>Medications</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {patientPrescriptions.map(prescription => (
                <tr key={prescription.id}>
                  <td>{new Date(prescription.date).toLocaleDateString()}</td>
                  <td>{prescription.doctorName}</td>
                  <td>{prescription.medications.length} medications</td>
                  <td>
                    <Button
                      variant="outline-primary"
                      size="sm"
                      className="me-2"
                      onClick={() => handleViewPrescription(prescription)}
                    >
                      <FaEye className="me-1" /> View
                    </Button>
                    <Button
                      variant="outline-secondary"
                      size="sm"
                      onClick={() => handleDownloadPrescription(prescription)}
                    >
                      <FaFileDownload className="me-1" /> Download
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </Card.Body>
      </Card>

      <Modal show={showModal} onHide={() => setShowModal(false)} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>Prescription Details</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedPrescription && (
            <>
              <p><strong>Date:</strong> {new Date(selectedPrescription.date).toLocaleDateString()}</p>
              <p><strong>Doctor:</strong> {selectedPrescription.doctorName}</p>
              
              <h6 className="mt-4">Medications:</h6>
              <ul className="medications-list">
                {selectedPrescription.medications.map((med, index) => (
                  <li key={index} className="medication-item">
                    <strong>{med.name}</strong>
                    <div className="medication-details">
                      <p><strong>Dosage:</strong> {med.dosage}</p>
                      <p><strong>Frequency:</strong> {med.frequency}</p>
                      <p><strong>Duration:</strong> {med.duration}</p>
                    </div>
                  </li>
                ))}
              </ul>
              
              <div className="mt-4">
                <h6>Notes:</h6>
                <p>{selectedPrescription.notes}</p>
              </div>
            </>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Close
          </Button>
          <Button 
            variant="primary"
            onClick={() => handleDownloadPrescription(selectedPrescription)}
          >
            <FaFileDownload className="me-1" /> Download Prescription
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default Prescriptions; 