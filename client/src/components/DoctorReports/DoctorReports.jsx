import React, { useState } from 'react';
import { Card, Tabs, Tab, Button, Form } from 'react-bootstrap';
import { FaFileMedical, FaDownload, FaPrint } from 'react-icons/fa';
import DataTable from '../DataTable/DataTable';
import './DoctorReports.css';

const DoctorReports = ({ doctorId }) => {
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedPatient, setSelectedPatient] = useState('');

  const columns = [
    { key: 'patientName', label: 'Patient Name' },
    { key: 'date', label: 'Date', render: (date) => new Date(date).toLocaleDateString() },
    { key: 'type', label: 'Report Type' },
    { key: 'status', label: 'Status' }
  ];

  const actions = [
    { type: 'view', label: 'View', variant: 'outline-primary' },
    { type: 'download', label: 'Download', variant: 'outline-secondary' }
  ];

  const handleActionClick = (actionType, report) => {
    if (actionType === 'view') {
      // Handle view action
      console.log('View report:', report);
    } else if (actionType === 'download') {
      // Handle download action
      console.log('Download report:', report);
    }
  };

  const renderFilters = () => (
    <div className="report-filters">
      <Form.Group className="mb-3">
        <Form.Label>Date Range</Form.Label>
        <Form.Control
          type="date"
          value={selectedDate}
          onChange={(e) => setSelectedDate(e.target.value)}
        />
      </Form.Group>
      <Form.Group className="mb-3">
        <Form.Label>Patient</Form.Label>
        <Form.Select
          value={selectedPatient}
          onChange={(e) => setSelectedPatient(e.target.value)}
        >
          <option value="">All Patients</option>
          <option value="1">John Doe</option>
          <option value="2">Jane Smith</option>
        </Form.Select>
      </Form.Group>
    </div>
  );

  return (
    <div className="doctor-reports-container">
      <Tabs defaultActiveKey="all" className="mb-4">
        <Tab eventKey="all" title="All Reports">
          <Card className="reports-card">
            <Card.Body>
              <div className="d-flex justify-content-between align-items-center mb-4">
                <h5 className="card-title mb-0">Patient Reports</h5>
                <div className="report-actions">
                  <Button variant="outline-primary" className="me-2">
                    <FaFileMedical className="me-2" />
                    Generate Report
                  </Button>
                  <Button variant="outline-secondary">
                    <FaPrint className="me-2" />
                    Print All
                  </Button>
                </div>
              </div>
              {renderFilters()}
              <DataTable
                columns={columns}
                data={[
                  {
                    patientName: 'John Doe',
                    date: '2024-03-15',
                    type: 'Medical Report',
                    status: 'Completed'
                  },
                  {
                    patientName: 'Jane Smith',
                    date: '2024-03-14',
                    type: 'Lab Results',
                    status: 'Pending'
                  }
                ]}
                actions={actions}
                onActionClick={handleActionClick}
                statusConfig={{
                  'Completed': { color: 'success' },
                  'Pending': { color: 'warning' }
                }}
              />
            </Card.Body>
          </Card>
        </Tab>
        <Tab eventKey="pending" title="Pending Reports">
          <Card className="reports-card">
            <Card.Body>
              <h5 className="card-title">Pending Reports</h5>
              {renderFilters()}
              <DataTable
                columns={columns}
                data={[
                  {
                    patientName: 'Jane Smith',
                    date: '2024-03-14',
                    type: 'Lab Results',
                    status: 'Pending'
                  }
                ]}
                actions={actions}
                onActionClick={handleActionClick}
                statusConfig={{
                  'Pending': { color: 'warning' }
                }}
              />
            </Card.Body>
          </Card>
        </Tab>
        <Tab eventKey="completed" title="Completed Reports">
          <Card className="reports-card">
            <Card.Body>
              <h5 className="card-title">Completed Reports</h5>
              {renderFilters()}
              <DataTable
                columns={columns}
                data={[
                  {
                    patientName: 'John Doe',
                    date: '2024-03-15',
                    type: 'Medical Report',
                    status: 'Completed'
                  }
                ]}
                actions={actions}
                onActionClick={handleActionClick}
                statusConfig={{
                  'Completed': { color: 'success' }
                }}
              />
            </Card.Body>
          </Card>
        </Tab>
      </Tabs>
    </div>
  );
};

export default DoctorReports; 