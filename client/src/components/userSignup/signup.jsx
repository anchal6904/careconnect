import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Container, Form, Button, Card, Row, Col } from 'react-bootstrap';
import { toast } from 'react-toastify';
import userform2cc from '../../assets/userform2 cc.png';
import { FaUser, FaEnvelope, FaPhone, FaLock, FaGoogle, FaFacebookF, FaTwitter } from 'react-icons/fa';
import { signup } from '../../utils/auth';
import './Signup.css';

const PatientSignup = () => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: ''
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (formData.password !== formData.confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }

    const result = await signup({
      firstName: formData.firstName,
      lastName: formData.lastName,
      email: formData.email,
      phone: formData.phone,
      password: formData.password
    });

    if (result.success) {
      toast.success('Registration successful! Please login.');
      navigate('/patient-login');
    } else {
      toast.error(result.message || 'Registration failed');
    }
  };

  return (
    <div className="signup-container" style={{ backgroundImage: `url(${userform2cc})` }}>
      <Container>
        <Card className="signup-card">
          <Card.Body>
            <h2 className="text-center mb-4">Patient Registration</h2>
            <Form onSubmit={handleSubmit}>
              <Row>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>
                      <FaUser className="input-icon" /> First Name
                    </Form.Label>
                    <Form.Control
                      type="text"
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleChange}
                      placeholder="Enter first name"
                      required
                    />
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group className="mb-3">
                    <Form.Label>
                      <FaUser className="input-icon" /> Last Name
                    </Form.Label>
                    <Form.Control
                      type="text"
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleChange}
                      placeholder="Enter last name"
                      required
                    />
                  </Form.Group>
                </Col>
              </Row>

              <Form.Group className="mb-3">
                <Form.Label>
                  <FaEnvelope className="input-icon" /> Email
                </Form.Label>
                <Form.Control
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Enter email"
                  required
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>
                  <FaPhone className="input-icon" /> Phone Number
                </Form.Label>
                <Form.Control
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="Enter phone number"
                  required
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>
                  <FaLock className="input-icon" /> Password
                </Form.Label>
                <Form.Control
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Enter password"
                  required
                />
              </Form.Group>

              <Form.Group className="mb-4">
                <Form.Label>
                  <FaLock className="input-icon" /> Confirm Password
                </Form.Label>
                <Form.Control
                  type="password"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  placeholder="Confirm password"
                  required
                />
              </Form.Group>

              <Button variant="primary" type="submit" className="w-100 mb-3">
                Register
              </Button>

              <div className="divider">
                <span>or sign up with</span>
              </div>

              <div className="social-buttons">
                <button type="button" className="social-button">
                  <FaGoogle className="social-icon" />
                </button>
                <button type="button" className="social-button">
                  <FaFacebookF className="social-icon" />
                </button>
                <button type="button" className="social-button">
                  <FaTwitter className="social-icon" />
                </button>
              </div>
            </Form>

            <p className="text-center mt-4">
              Already have an account?{' '}
              <Link to="/patient-login" className="login-link">
                Login here
              </Link>
            </p>
          </Card.Body>
        </Card>
      </Container>
    </div>
  );
};

export default PatientSignup;