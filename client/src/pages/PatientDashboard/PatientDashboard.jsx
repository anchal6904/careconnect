import React, { useState, useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import { Container, Card, Row, Col, Modal, Button } from 'react-bootstrap';
import { doctors, appointments, prescriptions, patients } from '../../data/dummyData';
import { useLocation, useNavigate } from 'react-router-dom';
import BookAppointment from '../../components/BookAppointment/BookAppointment';
import Profile from "../../components/Profile/Profile";
import Settings from "../../components/Settings/Settings";
import DashboardStats from '../../components/DashboardStats/DashboardStats';
import DataTable from '../../components/DataTable/DataTable';
import './PatientDashboard.css';
import { toast } from 'react-hot-toast';

const PatientDashboard = () => {
  const [patientAppointments, setPatientAppointments] = useState([]);
  const [patientDoctors, setPatientDoctors] = useState([]);
  const [patientData, setPatientData] = useState(null);
  const [showAppointmentModal, setShowAppointmentModal] = useState(false);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [previousDoctors, setPreviousDoctors] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    // Get patient data (assuming patient ID 1 for demo)
    const patient = patients.find(p => p.id === 1);
    setPatientData(patient);

    // Filter appointments for the current patient
    const filteredAppointments = appointments.filter(apt => apt.patientId === 1);
    setPatientAppointments(filteredAppointments);

    // Get doctors for the current patient
    const patientDoctorIds = patient?.doctors || [];
    const filteredDoctors = doctors.filter(doc => patientDoctorIds.includes(doc.id));
    setPatientDoctors(filteredDoctors);

    // Get previous doctors (doctors with completed appointments)
    const completedAppointments = filteredAppointments.filter(apt => apt.status === 'Completed');
    const previousDoctorIds = [...new Set(completedAppointments.map(apt => apt.doctorId))];
    const previousDoctorsList = doctors.filter(doc => previousDoctorIds.includes(doc.id))
      .map(doc => {
        const lastAppointment = completedAppointments
          .filter(apt => apt.doctorId === doc.id)
          .sort((a, b) => new Date(b.date) - new Date(a.date))[0];
        return {
          ...doc,
          lastVisit: lastAppointment?.date || new Date().toISOString()
        };
      });
    setPreviousDoctors(previousDoctorsList);
  }, []);

  const handleBookAppointment = (appointmentData) => {
    const newAppointment = {
      id: patientAppointments.length + 1,
      patientId: 1,
      ...appointmentData
    };
    setPatientAppointments(prev => [...prev, newAppointment]);
  };

  const handleViewAppointment = (appointment) => {
    setSelectedAppointment(appointment);
    setShowAppointmentModal(true);
  };

  const handleCancelClick = (appointment) => {
    setSelectedAppointment(appointment);
    setShowCancelModal(true);
  };

  const handleCancelAppointment = () => {
    if (!selectedAppointment) return;

    const updatedAppointments = patientAppointments.map(apt =>
      apt.id === selectedAppointment.id
          ? { ...apt, status: 'Cancelled' }
          : apt
    ).sort((a, b) => {
      const statusOrder = { 'Scheduled': 0, 'Completed': 1, 'Cancelled': 2 };
      if (statusOrder[a.status] !== statusOrder[b.status]) {
        return statusOrder[a.status] - statusOrder[b.status];
      }
      return new Date(a.date) - new Date(b.date);
    });
    
    setPatientAppointments(updatedAppointments);
    localStorage.setItem('appointments', JSON.stringify(updatedAppointments));
    toast.success('Appointment cancelled successfully');
    setShowCancelModal(false);
    setSelectedAppointment(null);
  };

  const handleRebookAppointment = (doctor) => {
    navigate('/patient-dashboard/make-appointment', { 
      state: { 
        selectedDoctor: doctor,
        isRebooking: true 
      }
    });
  };

  const renderDashboard = () => {
    const stats = [
      {
        title: 'My Doctors',
        value: patientDoctors.length,
        icon: '👨‍⚕️'
      },
      {
        title: 'Upcoming Appointments',
        value: patientAppointments.filter(apt => apt.status === 'Scheduled').length,
        icon: '📅'
      }
    ];

    const upcomingAppointments = patientAppointments
      .filter(apt => apt.status === 'Scheduled')
      .sort((a, b) => new Date(a.date) - new Date(b.date));

    return (
      <>
        <div className="dashboard-header">
          <h2>Welcome back, {patientData?.name}</h2>
          <p>Here's an overview of your health information</p>
        </div>

        <DashboardStats stats={stats} />

        <Row className="mb-4">
          <Col md={6}>
            <Card className="dashboard-card">
              <Card.Body>
                <h5>Upcoming Appointments</h5>
                <div className="appointments-list">
                  {upcomingAppointments.slice(0, 3).map(appointment => (
                    <div key={appointment.id} className="appointment-item">
                      <div className="appointment-info">
                        <h6>{appointment.doctorName}</h6>
                        <p>{new Date(appointment.date).toLocaleDateString()} at {appointment.time}</p>
                      </div>
                      <Button 
                        variant="outline-primary" 
                        size="sm"
                        onClick={() => handleViewAppointment(appointment)}
                      >
                        View Details
                      </Button>
                    </div>
                  ))}
                  {upcomingAppointments.length === 0 && (
                    <div className="no-appointments">
                      <p>No upcoming appointments</p>
                    </div>
                  )}
                </div>
              </Card.Body>
            </Card>
          </Col>
          <Col md={6}>
            <Card className="dashboard-card">
              <Card.Body>
                <h5>My Doctors</h5>
                <div className="doctors-list">
                  {patientDoctors.slice(0, 3).map(doctor => (
                    <div key={doctor.id} className="doctor-item">
                      <div className="doctor-info">
                        <h6>{doctor.name}</h6>
                        <p>{doctor.specialty}</p>
                      </div>
                    </div>
                  ))}
                  {patientDoctors.length === 0 && (
                    <div className="no-doctors">
                      <p>No doctors assigned</p>
                    </div>
                  )}
                </div>
              </Card.Body>
            </Card>
          </Col>
        </Row>

        {/* Previous Doctors Section */}
        <Card className="previous-doctors-section">
          <Card.Body>
            <h5>Previous Doctors</h5>
            <Row>
              {previousDoctors.map(doctor => (
                <Col key={doctor.id} md={3} sm={6}>
                  <div className="previous-doctor-card">
                    <div className="doctor-avatar">
                      {doctor.name.charAt(0)}
                    </div>
                    <div className="doctor-details">
                      <h6>{doctor.name}</h6>
                      <p>{doctor.specialty}</p>
                      <small>Last Visit: {new Date(doctor.lastVisit).toLocaleDateString()}</small>
                    </div>
                  </div>
                </Col>
              ))}
              {previousDoctors.length === 0 && (
                <Col>
                  <div className="no-previous-doctors">
                    <p>No previous doctors</p>
                  </div>
                </Col>
              )}
            </Row>
          </Card.Body>
        </Card>

        {/* Appointment Details Modal */}
        <Modal show={showAppointmentModal} onHide={() => setShowAppointmentModal(false)} centered>
          <Modal.Header closeButton>
            <Modal.Title>Appointment Details</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            {selectedAppointment && (
              <div className="appointment-details">
                <div className="detail-item">
                  <strong>Doctor:</strong> {selectedAppointment.doctorName}
                </div>
                <div className="detail-item">
                  <strong>Date:</strong> {new Date(selectedAppointment.date).toLocaleDateString()}
                </div>
                <div className="detail-item">
                  <strong>Time:</strong> {selectedAppointment.time}
                </div>
                <div className="detail-item">
                  <strong>Type:</strong> {selectedAppointment.type}
                </div>
                <div className="detail-item">
                  <strong>Status:</strong> 
                  <span className={`badge bg-${selectedAppointment.status === 'Scheduled' ? 'warning' : selectedAppointment.status === 'Completed' ? 'success' : 'danger'} ms-2`}>
                    {selectedAppointment.status}
                  </span>
                </div>
                <div className="detail-item">
                  <strong>Reason:</strong> {selectedAppointment.reason}
                </div>
              </div>
            )}
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowAppointmentModal(false)}>
              Close
            </Button>
          </Modal.Footer>
        </Modal>
      </>
    );
  };

  const renderAppointments = () => {
    const appointmentColumns = [
      { key: 'doctorName', label: 'Doctor' },
      { key: 'date', label: 'Date', render: (date) => new Date(date).toLocaleDateString() },
      { key: 'time', label: 'Time' },
      { key: 'type', label: 'Type' },
      { 
        key: 'status', 
        label: 'Status',
        render: (status) => (
          <span className={`badge bg-${status === 'Scheduled' ? 'warning' : status === 'Completed' ? 'success' : 'danger'}`}>
            {status}
          </span>
        )
      }
    ];

    const sortedAppointments = [...patientAppointments].sort((a, b) => {
      const statusOrder = { 'Scheduled': 0, 'Completed': 1, 'Cancelled': 2 };
      if (statusOrder[a.status] !== statusOrder[b.status]) {
        return statusOrder[a.status] - statusOrder[b.status];
      }
      return new Date(a.date) - new Date(b.date);
    });

    return (
      <div className="appointments-section">
        <div className="section-header">
          <h2>My Appointments</h2>
        </div>

        <div className="appointments-table">
          <table className="table">
            <thead>
              <tr>
                <th>Doctor</th>
                <th>Date</th>
                <th>Time</th>
                <th>Type</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {sortedAppointments.map(appointment => (
                <tr key={appointment.id}>
                  <td>{appointment.doctorName}</td>
                  <td>{new Date(appointment.date).toLocaleDateString()}</td>
                  <td>{appointment.time}</td>
                  <td>{appointment.type}</td>
                  <td>
                    <span className={`badge bg-${appointment.status === 'Scheduled' ? 'warning' : appointment.status === 'Completed' ? 'success' : 'danger'}`}>
                      {appointment.status}
                    </span>
                  </td>
                  <td>
                    <div className="action-buttons">
                      <Button
                        variant="outline-primary"
                        size="sm"
                        className="me-2"
                        onClick={() => handleViewAppointment(appointment)}
                      >
                        View
                      </Button>
                      {appointment.status === 'Scheduled' && (
                        <Button
                          variant="outline-danger"
                          size="sm"
                          onClick={() => handleCancelClick(appointment)}
                        >
                          Cancel
                        </Button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Appointment Details Modal */}
        <Modal show={showAppointmentModal} onHide={() => setShowAppointmentModal(false)} centered>
          <Modal.Header closeButton>
            <Modal.Title>Appointment Details</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            {selectedAppointment && (
              <div className="appointment-details">
                <div className="detail-item">
                  <strong>Doctor:</strong> {selectedAppointment.doctorName}
                </div>
                <div className="detail-item">
                  <strong>Date:</strong> {new Date(selectedAppointment.date).toLocaleDateString()}
                </div>
                <div className="detail-item">
                  <strong>Time:</strong> {selectedAppointment.time}
                </div>
                <div className="detail-item">
                  <strong>Type:</strong> {selectedAppointment.type}
                </div>
                <div className="detail-item">
                  <strong>Status:</strong> 
                  <span className={`badge bg-${selectedAppointment.status === 'Scheduled' ? 'warning' : selectedAppointment.status === 'Completed' ? 'success' : 'danger'} ms-2`}>
                    {selectedAppointment.status}
                  </span>
                </div>
                <div className="detail-item">
                  <strong>Reason:</strong> {selectedAppointment.reason}
                </div>
              </div>
            )}
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowAppointmentModal(false)}>
              Close
            </Button>
          </Modal.Footer>
        </Modal>

        {/* Cancel Confirmation Modal */}
        <Modal show={showCancelModal} onHide={() => setShowCancelModal(false)} centered>
          <Modal.Header closeButton>
            <Modal.Title>Cancel Appointment</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <p>Are you sure you want to cancel this appointment?</p>
            {selectedAppointment && (
              <div className="mt-3">
                <div className="detail-item">
                  <strong>Doctor:</strong> {selectedAppointment.doctorName}
                </div>
                <div className="detail-item">
                  <strong>Date:</strong> {new Date(selectedAppointment.date).toLocaleDateString()}
                </div>
                <div className="detail-item">
                  <strong>Time:</strong> {selectedAppointment.time}
                </div>
              </div>
            )}
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowCancelModal(false)}>
              No, Keep Appointment
            </Button>
            <Button variant="danger" onClick={handleCancelAppointment}>
              Yes, Cancel Appointment
            </Button>
          </Modal.Footer>
        </Modal>
      </div>
    );
  };

  return (
    <div className="dashboard-container">
      <div className="dashboard-content">
        <Routes>
          <Route path="/" element={renderDashboard()} />
          <Route path="/make-appointment" element={<BookAppointment onBookAppointment={handleBookAppointment} />} />
          <Route path="/appointments" element={renderAppointments()} />
          <Route path="/profile" element={<Profile patientData={patientData} />} />
          <Route path="/settings" element={<Settings />} />
        </Routes>
      </div>
    </div>
  );
};

export default PatientDashboard; 