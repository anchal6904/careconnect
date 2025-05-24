import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Form, Button, Table } from 'react-bootstrap';
import { FaChartBar, FaCalendarAlt, FaDownload, FaFilter } from 'react-icons/fa';
import './Reports.css';

const Reports = () => {
  const [reports, setReports] = useState([]);
  const [filteredReports, setFilteredReports] = useState([]);
  const [dateRange, setDateRange] = useState({
    start: '',
    end: ''
  });
  const [reportType, setReportType] = useState('all');

  useEffect(() => {
    // Simulate fetching reports from localStorage
    const savedReports = JSON.parse(localStorage.getItem('doctorReports') || '[]');
    setReports(savedReports);
    setFilteredReports(savedReports);
  }, []);

  const handleDateChange = (e) => {
    const { name, value } = e.target;
    setDateRange(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleReportTypeChange = (e) => {
    setReportType(e.target.value);
  };

  const applyFilters = () => {
    let filtered = [...reports];

    // Filter by date range
    if (dateRange.start && dateRange.end) {
      filtered = filtered.filter(report => {
        const reportDate = new Date(report.date);
        return reportDate >= new Date(dateRange.start) && 
               reportDate <= new Date(dateRange.end);
      });
    }

    // Filter by report type
    if (reportType !== 'all') {
      filtered = filtered.filter(report => report.type === reportType);
    }

    setFilteredReports(filtered);
  };

  const downloadReport = (report) => {
    // Here you would typically generate and download the report
    console.log('Downloading report:', report);
  };

  return (
    <Container className="reports-container">
      <Row className="mb-4">
        <Col>
          <h2>
            <FaChartBar className="me-2" />
            Reports & Analytics
          </h2>
        </Col>
      </Row>

      <Card className="mb-4">
        <Card.Body>
          <h5 className="mb-4">
            <FaFilter className="me-2" />
            Filter Reports
          </h5>
          <Row>
            <Col md={4}>
              <Form.Group className="mb-3">
                <Form.Label>
                  <FaCalendarAlt className="me-2" />
                  Start Date
                </Form.Label>
                <Form.Control
                  type="date"
                  name="start"
                  value={dateRange.start}
                  onChange={handleDateChange}
                />
              </Form.Group>
            </Col>
            <Col md={4}>
              <Form.Group className="mb-3">
                <Form.Label>
                  <FaCalendarAlt className="me-2" />
                  End Date
                </Form.Label>
                <Form.Control
                  type="date"
                  name="end"
                  value={dateRange.end}
                  onChange={handleDateChange}
                />
              </Form.Group>
            </Col>
            <Col md={4}>
              <Form.Group className="mb-3">
                <Form.Label>Report Type</Form.Label>
                <Form.Select
                  value={reportType}
                  onChange={handleReportTypeChange}
                >
                  <option value="all">All Reports</option>
                  <option value="appointments">Appointments</option>
                  <option value="patients">Patient Statistics</option>
                  <option value="revenue">Revenue</option>
                  <option value="prescriptions">Prescriptions</option>
                </Form.Select>
              </Form.Group>
            </Col>
          </Row>
          <div className="text-end">
            <Button variant="primary" onClick={applyFilters}>
              Apply Filters
            </Button>
          </div>
        </Card.Body>
      </Card>

      <Card>
        <Card.Body>
          <div className="table-responsive">
            <Table hover>
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Report Type</th>
                  <th>Title</th>
                  <th>Description</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredReports.length > 0 ? (
                  filteredReports.map((report) => (
                    <tr key={report.id}>
                      <td>{report.date}</td>
                      <td>
                        <span className={`report-type ${report.type}`}>
                          {report.type}
                        </span>
                      </td>
                      <td>{report.title}</td>
                      <td>{report.description}</td>
                      <td>
                        <Button
                          variant="outline-primary"
                          size="sm"
                          onClick={() => downloadReport(report)}
                        >
                          <FaDownload className="me-1" />
                          Download
                        </Button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="5" className="text-center">
                      <div className="empty-state">
                        <p>No reports found</p>
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

export default Reports; 