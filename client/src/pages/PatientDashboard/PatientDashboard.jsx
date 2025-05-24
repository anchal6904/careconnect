import React, { useState, useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import { Container } from 'react-bootstrap';
import { doctors, appointments, prescriptions, patients } from '../../data/dummyData';
import { useLocation } from 'react-router-dom';
import BookAppointment from '../../components/BookAppointment/BookAppointment';
import Appointments from '../../components/Appointments/Appointments';
import MedicalRecords from '../../components/MedicalRecords/MedicalRecords';
import Prescriptions from '../../components/Prescriptions/Prescriptions';
import Profile from "../../components/Profile/Profile";
import Settings from "../../components/Settings/Settings";
import DashboardStats from '../../components/DashboardStats/DashboardStats';
import DataTable from '../../components/DataTable/DataTable';
import './PatientDashboard.css';

const PatientDashboard = () => {
  const [patientAppointments, setPatientAppointments] = useState([]);
  const [patientPrescriptions, setPatientPrescriptions] = useState([]);
  const [patientDoctors, setPatientDoctors] = useState([]);
  const [patientData, setPatientData] = useState(null);
  const location = useLocation();

  useEffect(() => {
    // Get patient data (assuming patient ID 1 for demo)
    const patient = patients.find(p => p.id === 1);
    setPatientData(patient);

    // Filter appointments for the current patient
    const filteredAppointments = appointments.filter(apt => apt.patientId === 1);
    setPatientAppointments(filteredAppointments);

    // Filter prescriptions for the current patient
    const filteredPrescriptions = prescriptions.filter(pres => pres.patientId === 1);
    setPatientPrescriptions(filteredPrescriptions);

    // Get doctors for the current patient
    const patientDoctorIds = patient?.doctors || [];
    const filteredDoctors = doctors.filter(doc => patientDoctorIds.includes(doc.id));
    setPatientDoctors(filteredDoctors);
  }, []);

  const handleBookAppointment = (appointmentData) => {
    const newAppointment = {
      id: patientAppointments.length + 1,
      patientId: 1,
      ...appointmentData
    };
    setPatientAppointments(prev => [...prev, newAppointment]);
  };

  const handleCancelAppointment = (appointmentId) => {
    setPatientAppointments(prevAppointments =>
      prevAppointments.map(apt =>
        apt.id === appointmentId
          ? { ...apt, status: 'Cancelled' }
          : apt
      )
    );
  };

  const renderDashboard = () => {
    const stats = [
      {
        title: 'My Doctors',
        value: patientDoctors.length
      },
      {
        title: 'Upcoming Appointments',
        value: patientAppointments.filter(apt => apt.status === 'Scheduled').length
      },
      {
        title: 'Active Prescriptions',
        value: patientPrescriptions.length
      }
    ];

    const recentAppointmentsColumns = [
      { key: 'doctorName', label: 'Doctor' },
      { key: 'date', label: 'Date', render: (date) => new Date(date).toLocaleDateString() },
      { key: 'time', label: 'Time' },
      { key: 'status', label: 'Status' }
    ];

    const recentAppointmentsActions = [
      { type: 'view', label: 'View', variant: 'outline-primary' },
      { type: 'cancel', label: 'Cancel', variant: 'outline-danger' }
    ];

    const handleAppointmentAction = (actionType, appointment) => {
      if (actionType === 'view') {
        // Handle view action
      } else if (actionType === 'cancel') {
        handleCancelAppointment(appointment.id);
      }
    };

    return (
      <>
        <div className="dashboard-header">
          <h2>Welcome back, {patientData?.name}</h2>
          <p>Here's an overview of your health information</p>
        </div>

        <DashboardStats stats={stats} />

        <DataTable
          title="Recent Appointments"
          columns={recentAppointmentsColumns}
          data={patientAppointments.slice(0, 5)}
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

  const renderContent = () => {
    const path = location.pathname;
    if (path === '/patient-dashboard') return renderDashboard();
    if (path === '/patient-dashboard/book-appointment') return <BookAppointment onBookAppointment={handleBookAppointment} />;
    if (path === '/patient-dashboard/appointments') return <Appointments appointments={patientAppointments} onCancelAppointment={handleCancelAppointment} />;
    if (path === '/patient-dashboard/medical-records') return <MedicalRecords patientId={1} />;
    if (path === '/patient-dashboard/prescriptions') return <Prescriptions prescriptions={patientPrescriptions} />;
    if (path === '/patient-dashboard/profile') return <Profile patientData={patientData} />;
    if (path === '/patient-dashboard/settings') return <Settings />;
    return renderDashboard();
  };

  return (
    <div className="dashboard-container">
      <div className="dashboard-content">
        <Routes>
          <Route path="/" element={renderContent()} />
          <Route path="/book-appointment" element={<BookAppointment onBookAppointment={handleBookAppointment} />} />
          <Route path="/appointments" element={<Appointments appointments={patientAppointments} onCancelAppointment={handleCancelAppointment} />} />
          <Route path="/medical-records" element={<MedicalRecords patientId={1} />} />
          <Route path="/prescriptions" element={<Prescriptions prescriptions={patientPrescriptions} />} />
          <Route path="/profile" element={<Profile patientData={patientData} />} />
          <Route path="/settings" element={<Settings />} />
        </Routes>
      </div>
    </div>
  );
};

export default PatientDashboard; 