import React, { useState, useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import { Container, Row, Col, Card, Button, Badge } from 'react-bootstrap';
import { patients, appointments, prescriptions, notifications } from '../../data/dummyData';
import { useLocation, useNavigate } from 'react-router-dom';
import DoctorSchedule from '../../components/DoctorSchedule/DoctorSchedule';
import DoctorReports from '../../components/DoctorReports/DoctorReports';
import DoctorProfile from '../../components/DoctorProfile/DoctorProfile';
import Settings from '../../components/Settings/Settings';
import DashboardStats from '../../components/DashboardStats/DashboardStats';
import DataTable from '../../components/DataTable/DataTable';
import { fetchDoctorById } from '../../api/api';
import { updateProfile, updateSchedule } from '../../utils/doctorAuth';
import './DoctorDashboard.css';
import { toast } from 'react-toastify';

const DoctorDashboard = () => {
  const [doctorAppointments, setDoctorAppointments] = useState([]);
  const [doctorPrescriptions, setDoctorPrescriptions] = useState([]);
  const [doctorPatients, setDoctorPatients] = useState([]);
  const [doctorData, setDoctorData] = useState(null);
  const [unreadNotifications, setUnreadNotifications] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const location = useLocation();
  const navigate = useNavigate(); 

  useEffect(() => {
    const fetchDoctorData = async () => {
      try {
        // Get doctor ID from localStorage
        const doctorId = localStorage.getItem('id');
        const isAuthenticated = localStorage.getItem('isAuthenticated') === 'true';
        
        if (!doctorId || !isAuthenticated) {
          console.error('Doctor not authenticated');
          toast.error('Please login to access the dashboard');
          navigate('/doctor-login');
          return;
        }

        const response = await fetchDoctorById(doctorId);
        console.log('Initial doctor data fetch response:', response);
        
        if (response.data.success) {
          console.log('Setting initial doctor data:', response.data.data);
          setDoctorData(response.data.data);
        } else {
          console.error('Failed to fetch doctor data:', response.data.message);
          toast.error('Failed to load doctor data');
          navigate('/doctor-login');
        }
      } catch (error) {
        console.error('Error fetching doctor data:', error);
        toast.error('Error loading doctor data');
        navigate('/doctor-login');
      } finally {
        setIsLoading(false);
      }
    };

    fetchDoctorData();

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
  }, [navigate]);

  const handleScheduleUpdate = async (updateData) => {
    try {
      const doctorId = localStorage.getItem('id');
      if (!doctorId) {
        toast.error('Doctor ID not found');
        return;
      }

      // Convert the schedule data to available_days and available_hours format
      const availableDays = [];
      const availableHours = [];

      Object.entries(updateData).forEach(([date, schedule]) => {
        if (!schedule.isHoliday && schedule.timeRanges.length > 0) {
          const dayOfWeek = new Date(date).toLocaleDateString('en-US', { weekday: 'long' });
          availableDays.push(dayOfWeek);
          
          schedule.timeRanges.forEach(range => {
            const timeRange = `${range.startTime}-${range.endTime}`;
            if (!availableHours.includes(timeRange)) {
              availableHours.push(timeRange);
            }
          });
        }
      });

      // Create the update payload with all required fields
      const updatePayload = {
        available_days: availableDays.join(','),
        available_hours: availableHours.join(','),
        // Include existing profile data
        bio: doctorData?.bio,
        location_link: doctorData?.location_link,
        consultation_fee: doctorData?.consultation_fee
      };

      // Debug logs
      console.log('Current doctor data:', doctorData);
      console.log('Schedule update data:', updateData);
      console.log('Final schedule payload:', updatePayload);

      const result = await updateSchedule(doctorId, updatePayload);
      
      // Debug log
      console.log('Server response:', result);
      
      if (result.success) {
        // Debug log
        console.log('Server response data:', result.data);
        
        setDoctorData(prev => {
          const newState = {
            ...prev,
            available_days: updatePayload.available_days,
            available_hours: updatePayload.available_hours,
            onboarding_complete: result.data.onboarding_complete,
            is_visible: result.data.is_visible
          };
          console.log('New doctor state:', newState);
          return newState;
        });
        toast.success('Schedule updated successfully');
      } else {
        toast.error(result.message || 'Failed to update schedule');
      }
    } catch (error) {
      console.error('Error updating schedule:', error);
      toast.error('Failed to update schedule: ' + (error.message || 'Unknown error'));
    }
  };

  const handleProfileUpdate = async (updatedData) => {
    try {
      const doctorId = localStorage.getItem('id');
      if (!doctorId) {
        toast.error('Doctor ID not found');
        return;
      }

      // Create the update payload with all required fields
      const updatePayload = {
        bio: updatedData.bio,
        location_link: updatedData.location_link,
        consultation_fee: updatedData.consultation_fee ? Number(updatedData.consultation_fee) : undefined,
        // Include existing schedule data if available
        available_days: doctorData?.available_days,
        available_hours: doctorData?.available_hours
      };

      // Debug logs
      console.log('Current doctor data:', doctorData);
      console.log('Updated data received:', updatedData);
      console.log('Final update payload:', updatePayload);

      const result = await updateProfile(doctorId, updatePayload);
      
      // Debug log
      console.log('Server response:', result);
      
      if (result.success) {
        // Debug log
        console.log('Server response data:', result.data);
        
        // Update local state after successful API call
        setDoctorData(prev => {
          const newState = {
            ...prev,
            bio: updatedData.bio,
            location_link: updatedData.location_link,
            consultation_fee: updatedData.consultation_fee,
            onboarding_complete: result.data.onboarding_complete,
            is_visible: result.data.is_visible
          };
          console.log('New doctor state:', newState);
          return newState;
        });
        toast.success('Profile updated successfully');
      } else {
        toast.error(result.message || 'Failed to update profile');
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      toast.error('Failed to update profile: ' + (error.message || 'Unknown error'));
    }
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
          <Route 
            path="/schedule" 
            element={
              <DoctorSchedule 
                doctorId={doctorData?.id} 
                onScheduleUpdate={handleScheduleUpdate}
                doctorData={doctorData}
              />
            } 
          />
          <Route path="/appointments" element={renderAppointments()} />
          <Route path="/patients" element={renderPatients()} />
          <Route path="/reports" element={<DoctorReports doctorId={doctorData?.id} />} />
          <Route 
            path="/profile" 
            element={
              isLoading ? (
                <div className="text-center p-5">Loading profile...</div>
              ) : (
                <DoctorProfile doctorData={doctorData} onUpdateProfile={handleProfileUpdate} />
              )
            } 
          />
          <Route path="/settings" element={<Settings />} />
        </Routes>
      </div>
    </div>
  );
};

export default DoctorDashboard; 