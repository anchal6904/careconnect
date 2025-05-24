import React, { useState, useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import { Container, Row, Col, Card, Button, Badge } from 'react-bootstrap';
import { patients, appointments, prescriptions, notifications } from '../../data/dummyData';
import { useLocation } from 'react-router-dom';
import DoctorSchedule from '../../components/DoctorSchedule/DoctorSchedule';
import DoctorReports from '../../components/DoctorReports/DoctorReports';
import DoctorProfile from '../../components/DoctorProfile/DoctorProfile';
import Settings from '../../components/Settings/Settings';
import DashboardStats from '../../components/DashboardStats/DashboardStats';
import DataTable from '../../components/DataTable/DataTable';
import './DoctorDashboard.css';

const DoctorDashboard = () => {
  const [doctorAppointments, setDoctorAppointments] = useState([]);
  const [doctorPrescriptions, setDoctorPrescriptions] = useState([]);
  const [doctorPatients, setDoctorPatients] = useState([]);
  const [doctorData, setDoctorData] = useState(null);
  const [unreadNotifications, setUnreadNotifications] = useState(0);
  const location = useLocation();

  useEffect(() => {
    // Get doctor data (assuming doctor ID 1 for demo)
    const doctor = {
      id: 1,
      name: 'Dr. John Smith',
      email: 'john.smith@hospital.com',
      phone: '+1234567890',
      specialization: 'Cardiology',
      experience: '15 years',
      education: 'MD, Cardiology',
      certifications: 'Board Certified Cardiologist',
      bio: 'Experienced cardiologist with expertise in preventive cardiology and heart disease management.',
      address: '123 Medical Center Dr, Suite 456',
      emergencyContact: {
        name: 'Sarah Smith',
        relationship: 'Spouse',
        phone: '+1987654321'
      }
    };
    setDoctorData(doctor);

    // Filter appointments for the current doctor
    const filteredAppointments = appointments.filter(apt => apt.doctorId === 1);
    setDoctorAppointments(filteredAppointments);

    // Filter prescriptions for the current doctor
    const filteredPrescriptions = prescriptions.filter(pres => pres.doctorId === 1);
    setDoctorPrescriptions(filteredPrescriptions);

    // Get patients for the current doctor
    const doctorPatientIds = [1, 2, 3, 4, 5]; // Assuming these are the patient IDs for doctor 1
    const filteredPatients = patients.filter(pat => doctorPatientIds.includes(pat.id));
    setDoctorPatients(filteredPatients);

    // Count unread notifications
    const unread = notifications.filter(notification => !notification.read).length;
    setUnreadNotifications(unread);
  }, []);

  const handleScheduleUpdate = (updateData) => {
    console.log('Schedule update:', updateData);
    // Here you would typically make an API call to update the schedule
  };

  const handleProfileUpdate = (updatedData) => {
    console.log('Profile update:', updatedData);
    // Here you would typically make an API call to update the profile
    setDoctorData(prev => ({ ...prev, ...updatedData }));
  };

  const renderDashboard = () => {
    const stats = [
      {
        title: 'My Patients',
        value: doctorPatients.length
      },
      {
        title: 'Today\'s Appointments',
        value: doctorAppointments.filter(apt => 
          apt.status === 'Scheduled' && 
          new Date(apt.date).toDateString() === new Date().toDateString()
        ).length
      },
      {
        title: 'Active Prescriptions',
        value: doctorPrescriptions.length
      },
      {
        title: 'Unread Messages',
        value: unreadNotifications
      }
    ];

    const recentAppointmentsColumns = [
      { key: 'patientName', label: 'Patient' },
      { key: 'date', label: 'Date', render: (date) => new Date(date).toLocaleDateString() },
      { key: 'time', label: 'Time' },
      { key: 'status', label: 'Status' }
    ];

    const recentAppointmentsActions = [
      { type: 'view', label: 'View', variant: 'outline-primary' },
      { type: 'complete', label: 'Complete', variant: 'outline-success' },
      { type: 'cancel', label: 'Cancel', variant: 'outline-danger' }
    ];

    const handleAppointmentAction = (actionType, appointment) => {
      if (actionType === 'view') {
        // Handle view action
      } else if (actionType === 'complete') {
        setDoctorAppointments(prevAppointments =>
          prevAppointments.map(apt =>
            apt.id === appointment.id
              ? { ...apt, status: 'Completed' }
              : apt
          )
        );
      } else if (actionType === 'cancel') {
        setDoctorAppointments(prevAppointments =>
          prevAppointments.map(apt =>
            apt.id === appointment.id
              ? { ...apt, status: 'Cancelled' }
              : apt
          )
        );
      }
    };

    return (
      <>
        <div className="dashboard-header">
          <h2>Welcome back, {doctorData?.name}</h2>
          <p>Here's an overview of your practice</p>
        </div>

        <DashboardStats stats={stats} />

        <DataTable
          title="Recent Appointments"
          columns={recentAppointmentsColumns}
          data={doctorAppointments.slice(0, 5)}
          actions={recentAppointmentsActions}
          onActionClick={handleAppointmentAction}
          statusConfig={{
            'Scheduled': { color: 'warning' },
            'Completed': { color: 'success' },
            'Cancelled': { color: 'danger' }
          }}
        />
      </>
    );
  };

  const renderAppointments = () => {
    const appointmentColumns = [
      { key: 'patientName', label: 'Patient' },
      { key: 'date', label: 'Date', render: (date) => new Date(date).toLocaleDateString() },
      { key: 'time', label: 'Time' },
      { key: 'reason', label: 'Reason' },
      { key: 'status', label: 'Status' }
    ];

    const appointmentActions = [
      { type: 'view', label: 'View', variant: 'outline-primary' },
      { type: 'complete', label: 'Complete', variant: 'outline-success' },
      { type: 'cancel', label: 'Cancel', variant: 'outline-danger' }
    ];

    const handleAppointmentAction = (actionType, appointment) => {
      if (actionType === 'view') {
        // Handle view action
      } else if (actionType === 'complete') {
        setDoctorAppointments(prevAppointments =>
          prevAppointments.map(apt =>
            apt.id === appointment.id
              ? { ...apt, status: 'Completed' }
              : apt
          )
        );
      } else if (actionType === 'cancel') {
        setDoctorAppointments(prevAppointments =>
          prevAppointments.map(apt =>
            apt.id === appointment.id
              ? { ...apt, status: 'Cancelled' }
              : apt
          )
        );
      }
    };

    return (
      <div className="appointments-section">
        <div className="section-header">
          <h2>Appointments</h2>
          <div className="appointment-filters">
            <Button variant="outline-primary" className="me-2">Today</Button>
            <Button variant="outline-primary" className="me-2">This Week</Button>
            <Button variant="outline-primary">All</Button>
          </div>
        </div>

        <DataTable
          title="Upcoming Appointments"
          columns={appointmentColumns}
          data={doctorAppointments.filter(apt => apt.status === 'Scheduled')}
          actions={appointmentActions}
          onActionClick={handleAppointmentAction}
          statusConfig={{
            'Scheduled': { color: 'warning' },
            'Completed': { color: 'success' },
            'Cancelled': { color: 'danger' }
          }}
        />

        <DataTable
          title="Completed Appointments"
          columns={appointmentColumns}
          data={doctorAppointments.filter(apt => apt.status === 'Completed')}
          actions={[{ type: 'view', label: 'View', variant: 'outline-primary' }]}
          onActionClick={handleAppointmentAction}
          statusConfig={{
            'Completed': { color: 'success' }
          }}
        />
      </div>
    );
  };

  const renderPatients = () => {
    return (
      <div className="patients-section">
        <div className="section-header">
          <h2>My Patients</h2>
          <div className="patient-filters">
            <Button variant="outline-primary" className="me-2">All Patients</Button>
            <Button variant="outline-primary" className="me-2">Recent</Button>
            <Button variant="outline-primary">Search</Button>
          </div>
        </div>

        <Row>
          {doctorPatients.map(patient => (
            <Col key={patient.id} md={6} lg={4} className="mb-4">
              <Card className="patient-card">
                <Card.Body>
                  <div className="patient-header">
                    <div>
                      <h5>{patient.name}</h5>
                      <p className="text-muted">{patient.age} years • {patient.gender}</p>
                    </div>
                    <Badge bg={patient.lastVisit ? 'success' : 'warning'}>
                      {patient.lastVisit ? 'Active' : 'Inactive'}
                    </Badge>
                  </div>
                  <div className="patient-info">
                    <p><strong>Blood Group:</strong> {patient.bloodGroup}</p>
                    <p><strong>Contact:</strong> {patient.contact}</p>
                    <p><strong>Email:</strong> {patient.email}</p>
                    <p><strong>Last Visit:</strong> {patient.lastVisit ? new Date(patient.lastVisit).toLocaleDateString() : 'No visits yet'}</p>
                  </div>
                  <div className="patient-actions">
                    <Button variant="primary" className="me-2">View History</Button>
                    <Button variant="outline-primary">Schedule Visit</Button>
                  </div>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      </div>
    );
  };

  return (
    <div className="dashboard-container">
      <div className="dashboard-content">
        <Routes>
          <Route path="/" element={renderDashboard()} />
          <Route path="/schedule" element={<DoctorSchedule doctorId={1} onScheduleUpdate={handleScheduleUpdate} />} />
          <Route path="/appointments" element={renderAppointments()} />
          <Route path="/patients" element={renderPatients()} />
          <Route path="/reports" element={<DoctorReports doctorId={1} />} />
          <Route path="/profile" element={<DoctorProfile doctorData={doctorData} onUpdateProfile={handleProfileUpdate} />} />
          <Route path="/settings" element={<Settings />} />
        </Routes>
      </div>
    </div>
  );
};

export default DoctorDashboard; 