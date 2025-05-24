import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Form, Button, Alert } from 'react-bootstrap';
import { FaLock, FaBell, FaLanguage, FaMoon } from 'react-icons/fa';
import './Settings.css';

const Settings = () => {
  const [settings, setSettings] = useState({
    notifications: {
      email: true,
      sms: false,
      appointmentReminders: true,
      prescriptionUpdates: true
    },
    language: 'en',
    theme: 'light',
    password: {
      current: '',
      new: '',
      confirm: ''
    }
  });

  const [showPasswordAlert, setShowPasswordAlert] = useState(false);
  const [passwordMessage, setPasswordMessage] = useState({ type: '', text: '' });

  useEffect(() => {
    // Load settings from localStorage
    const savedSettings = JSON.parse(localStorage.getItem('userSettings'));
    if (savedSettings) {
      setSettings(savedSettings);
    }
  }, []);

  const handleNotificationChange = (type) => {
    setSettings(prev => ({
      ...prev,
      notifications: {
        ...prev.notifications,
        [type]: !prev.notifications[type]
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
    const { current, new: newPassword, confirm } = settings.password;

    if (newPassword !== confirm) {
      setPasswordMessage({
        type: 'danger',
        text: 'New passwords do not match!'
      });
      setShowPasswordAlert(true);
      return;
    }

    // Here you would typically make an API call to change the password
    // For now, we'll just show a success message
    setPasswordMessage({
      type: 'success',
      text: 'Password changed successfully!'
    });
    setShowPasswordAlert(true);

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
    // Show success message or notification
  };

  return (
    <Container className="settings-container">
      <Row className="mb-4">
        <Col>
          <h2>Settings</h2>
        </Col>
      </Row>

      <Row>
        <Col md={6}>
          <Card className="mb-4">
            <Card.Body>
              <h5 className="mb-4">
                <FaBell className="me-2" />
                Notifications
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
              </Form>
            </Card.Body>
          </Card>

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

        <Col md={6}>
          <Card>
            <Card.Body>
              <h5 className="mb-4">
                <FaLock className="me-2" />
                Change Password
              </h5>
              {showPasswordAlert && (
                <Alert
                  variant={passwordMessage.type}
                  onClose={() => setShowPasswordAlert(false)}
                  dismissible
                >
                  {passwordMessage.text}
                </Alert>
              )}
              <Form onSubmit={handlePasswordSubmit}>
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
                <Button type="submit" variant="primary">
                  Change Password
                </Button>
              </Form>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <Row className="mt-4">
        <Col className="text-end">
          <Button variant="success" onClick={saveSettings}>
            Save All Settings
          </Button>
        </Col>
      </Row>
    </Container>
  );
};

export default Settings; 