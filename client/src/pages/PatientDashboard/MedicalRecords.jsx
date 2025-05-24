import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Table, Button } from 'react-bootstrap';
import { FaFileDownload, FaEye } from 'react-icons/fa';
import './MedicalRecords.css';

const MedicalRecords = () => {
  const [records, setRecords] = useState([]);
  const [selectedRecord, setSelectedRecord] = useState(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    // Simulate fetching medical records from localStorage
    const savedRecords = JSON.parse(localStorage.getItem('medicalRecords') || '[]');
    // Filter records for the current patient
    const patientRecords = savedRecords.filter(
      record => record.patientId === JSON.parse(localStorage.getItem('user'))?.id
    );
    setRecords(patientRecords);
  }, []);

  const handleViewRecord = (record) => {
    setSelectedRecord(record);
    setShowModal(true);
  };

  return (
    <Container className="medical-records-container">
      <Row className="mb-4">
        <Col>
          <h2>Medical Records</h2>
        </Col>
      </Row>

      <Card>
        <Card.Body>
          <div className="table-responsive">
            <Table hover>
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Doctor</th>
                  <th>Department</th>
                  <th>Diagnosis</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {records.length > 0 ? (
                  records.map((record) => (
                    <tr key={record.id}>
                      <td>{record.date}</td>
                      <td>{record.doctorName}</td>
                      <td>{record.department}</td>
                      <td>{record.diagnosis}</td>
                      <td>
                        <div className="d-flex gap-2">
                          <Button
                            variant="outline-primary"
                            size="sm"
                            onClick={() => handleViewRecord(record)}
                          >
                            <FaEye />
                          </Button>
                          <Button
                            variant="outline-success"
                            size="sm"
                            onClick={() => {/* Download record */}}
                          >
                            <FaFileDownload />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="5" className="text-center">
                      <div className="empty-state">
                        <p>No medical records found</p>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </Table>
          </div>
        </Card.Body>
      </Card>

      {/* Record Details Modal */}
      {selectedRecord && (
        <div className={`modal ${showModal ? 'show' : ''}`} style={{ display: showModal ? 'block' : 'none' }}>
          <div className="modal-dialog modal-lg">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Medical Record Details</h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setShowModal(false)}
                ></button>
              </div>
              <div className="modal-body">
                <Row>
                  <Col md={6}>
                    <p><strong>Date:</strong> {selectedRecord.date}</p>
                    <p><strong>Doctor:</strong> {selectedRecord.doctorName}</p>
                    <p><strong>Department:</strong> {selectedRecord.department}</p>
                  </Col>
                  <Col md={6}>
                    <p><strong>Diagnosis:</strong> {selectedRecord.diagnosis}</p>
                    <p><strong>Treatment:</strong> {selectedRecord.treatment}</p>
                    <p><strong>Notes:</strong> {selectedRecord.notes}</p>
                  </Col>
                </Row>
                {selectedRecord.prescriptions && (
                  <div className="mt-4">
                    <h6>Prescriptions</h6>
                    <ul>
                      {selectedRecord.prescriptions.map((prescription, index) => (
                        <li key={index}>
                          {prescription.medicine} - {prescription.dosage}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
              <div className="modal-footer">
                <Button variant="secondary" onClick={() => setShowModal(false)}>
                  Close
                </Button>
                <Button variant="primary" onClick={() => {/* Download record */}}>
                  Download Record
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </Container>
  );
};

export default MedicalRecords; 