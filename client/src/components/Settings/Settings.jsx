import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Form, Button, Alert } from 'react-bootstrap';
import { FaBell, FaLanguage, FaPalette, FaLock, FaSave } from 'react-icons/fa';
import './Settings.css';

const Settings = ({ userType = 'patient' }) => {
  const [settings, setSettings] = useState({
    notifications: {
      email: true,
      sms: false,
      appointmentReminders: true,
      prescriptionUpdates: true,
      // Doctor specific notifications
      newPatientAlerts: true,
      appointmentRequests: true,
      patientMessages: true
    },
    language: 'en',
    theme: 'light',
    password: {
      current: '',
      new: '',
      confirm: ''
    }
  });

  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const [alertVariant, setAlertVariant] = useState('success');

  useEffect(() => {
    // Load settings from localStorage
    const savedSettings = JSON.parse(localStorage.getItem('userSettings'));
    if (savedSettings) {
      setSettings(savedSettings);
    }
  }, []);

  const handleNotificationChange = (setting) => {
    setSettings(prev => ({
      ...prev,
      notifications: {
        ...prev.notifications,
        [setting]: !prev.notifications[setting]
      }
    }));
  };

  const handleLanguageChange = (e) => {
    setSettings(prev => ({
      ...prev,
      language: e.target.value
    }));
  };

  const handleThemeChange = (e) => {
    setSettings(prev => ({
      ...prev,
      theme: e.target.value
    }));
  };

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setSettings(prev => ({
      ...prev,
      password: {
        ...prev.password,
        [name]: value
      }
    }));
  };

  const handlePasswordSubmit = (e) => {
    e.preventDefault();
    const { current, new: newPass, confirm } = settings.password;

    if (newPass !== confirm) {
      setAlertMessage('New passwords do not match');
      setAlertVariant('danger');
      setShowAlert(true);
      return;
    }

    if (newPass.length < 8) {
      setAlertMessage('New password must be at least 8 characters long');
      setAlertVariant('danger');
      setShowAlert(true);
      return;
    }

    // Here you would typically make an API call to change the password
    setAlertMessage('Password changed successfully');
    setAlertVariant('success');
    setShowAlert(true);

    // Clear password fields
    setSettings(prev => ({
      ...prev,
      password: {
        current: '',
        new: '',
        confirm: ''
      }
    }));
  };

  const saveSettings = () => {
    localStorage.setItem('userSettings', JSON.stringify(settings));
    setAlertMessage('Settings saved successfully');
    setAlertVariant('success');
    setShowAlert(true);
  };

  return (
    <Container className="settings-container">
      <Row className="mb-4">
        <Col>
          <h2>Settings</h2>
        </Col>
        <Col xs="auto">
          <Button variant="primary" onClick={saveSettings}>
            <FaSave className="me-2" />
            Save All Settings
          </Button>
        </Col>
      </Row>

      {showAlert && (
        <Alert 
          variant={alertVariant} 
          onClose={() => setShowAlert(false)} 
          dismissible
          className="mb-4"
        >
          {alertMessage}
        </Alert>
      )}

      <Row>
        <Col md={6}>
          <Card className="mb-4">
            <Card.Body>
              <h5 className="mb-4">
                <FaBell className="me-2" />
                Notification Settings
              </h5>
              <Form>
                <Form.Group className="mb-3">
                  <Form.Check
                    type="switch"
                    id="email-notifications"
                    label="Email Notifications"
                    checked={settings.notifications.email}
                    onChange={() => handleNotificationChange('email')}
                  />
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Check
                    type="switch"
                    id="sms-notifications"
                    label="SMS Notifications"
                    checked={settings.notifications.sms}
                    onChange={() => handleNotificationChange('sms')}
                  />
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Check
                    type="switch"
                    id="appointment-reminders"
                    label="Appointment Reminders"
                    checked={settings.notifications.appointmentReminders}
                    onChange={() => handleNotificationChange('appointmentReminders')}
                  />
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Check
                    type="switch"
                    id="prescription-updates"
                    label="Prescription Updates"
                    checked={settings.notifications.prescriptionUpdates}
                    onChange={() => handleNotificationChange('prescriptionUpdates')}
                  />
                </Form.Group>
                {userType === 'doctor' && (
                  <>
                    <Form.Group className="mb-3">
                      <Form.Check
                        type="switch"
                        id="new-patient-alerts"
                        label="New Patient Alerts"
                        checked={settings.notifications.newPatientAlerts}
                        onChange={() => handleNotificationChange('newPatientAlerts')}
                      />
                    </Form.Group>
                    <Form.Group className="mb-3">
                      <Form.Check
                        type="switch"
                        id="appointment-requests"
                        label="Appointment Requests"
                        checked={settings.notifications.appointmentRequests}
                        onChange={() => handleNotificationChange('appointmentRequests')}
                      />
                    </Form.Group>
                    <Form.Group className="mb-3">
                      <Form.Check
                        type="switch"
                        id="patient-messages"
                        label="Patient Messages"
                        checked={settings.notifications.patientMessages}
                        onChange={() => handleNotificationChange('patientMessages')}
                      />
                    </Form.Group>
                  </>
                )}
              </Form>
            </Card.Body>
          </Card>
        </Col>

        <Col md={6}>
          <Card className="mb-4">
            <Card.Body>
              <h5 className="mb-4">
                <FaLanguage className="me-2" />
                Language & Theme
              </h5>
              <Form>
                <Form.Group className="mb-3">
                  <Form.Label>Language</Form.Label>
                  <Form.Select
                    value={settings.language}
                    onChange={handleLanguageChange}
                  >
                    <option value="en">English</option>
                    <option value="es">Spanish</option>
                    <option value="fr">French</option>
                    <option value="de">German</option>
                  </Form.Select>
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label>Theme</Form.Label>
                  <Form.Select
                    value={settings.theme}
                    onChange={handleThemeChange}
                  >
                    <option value="light">Light</option>
                    <option value="dark">Dark</option>
                    <option value="system">System Default</option>
                  </Form.Select>
                </Form.Group>
              </Form>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <Card>
        <Card.Body>
          <h5 className="mb-4">
            <FaLock className="me-2" />
            Change Password
          </h5>
          <Form onSubmit={handlePasswordSubmit}>
            <Row>
              <Col md={4}>
                <Form.Group className="mb-3">
                  <Form.Label>Current Password</Form.Label>
                  <Form.Control
                    type="password"
                    name="current"
                    value={settings.password.current}
                    onChange={handlePasswordChange}
                    required
                  />
                </Form.Group>
              </Col>
              <Col md={4}>
                <Form.Group className="mb-3">
                  <Form.Label>New Password</Form.Label>
                  <Form.Control
                    type="password"
                    name="new"
                    value={settings.password.new}
                    onChange={handlePasswordChange}
                    required
                  />
                </Form.Group>
              </Col>
              <Col md={4}>
                <Form.Group className="mb-3">
                  <Form.Label>Confirm New Password</Form.Label>
                  <Form.Control
                    type="password"
                    name="confirm"
                    value={settings.password.confirm}
                    onChange={handlePasswordChange}
                    required
                  />
                </Form.Group>
              </Col>
            </Row>
            <div className="text-end">
              <Button type="submit" variant="primary">
                Change Password
              </Button>
            </div>
          </Form>
        </Card.Body>
      </Card>
    </Container>
  );
};

export default Settings; 