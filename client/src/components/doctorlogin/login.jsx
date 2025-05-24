import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Container, Form, Button, Card } from 'react-bootstrap';
import { toast } from 'react-toastify';
import userform2cc from '../../assets/userform2 cc.png';
import { FaUserMd, FaEnvelope, FaLock, FaGoogle, FaFacebookF, FaTwitter } from 'react-icons/fa';
import './Login.css';

const DoctorLogin = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Hardcoded credentials
    const validCredentials = {
      email: 'doctor@example.com',
      password: 'doctor123'
    };

    if (formData.email === validCredentials.email && formData.password === validCredentials.password) {
      // Store user data in localStorage
      const userData = {
        id: '1',
        email: formData.email,
        name: 'Dr. Smith',
        phone: '1234567890',
        role: 'doctor'
      };
      localStorage.setItem('user', JSON.stringify(userData));
      localStorage.setItem('userRole', 'doctor');
      localStorage.setItem('username', userData.name);

      toast.success('Login successful!');
      navigate('/doctor-dashboard');
    } else {
      toast.error('Invalid credentials');
    }
  };

  return (
    <div className="login-page" style={{ backgroundImage: `url(${userform2cc})` }}>
      <div className="login-container">
        <Card className="login-card">
          <Card.Body>
            <div className="text-center mb-4">
              <div className="doctor-icon-wrapper mb-3">
                <FaUserMd className="doctor-icon" />
              </div>
              <h2>Doctor Login</h2>
              <p className="text-muted">Welcome back! Please login to your account</p>
            </div>

            <Form onSubmit={handleSubmit}>
              <Form.Group className="mb-3">
                <Form.Label>
                  <FaEnvelope className="input-icon" /> Email
                </Form.Label>
                <Form.Control
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Enter your email"
                  required
                />
              </Form.Group>

              <Form.Group className="mb-4">
                <Form.Label>
                  <FaLock className="input-icon" /> Password
                </Form.Label>
                <Form.Control
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Enter your password"
                  required
                />
              </Form.Group>

              <Button variant="primary" type="submit" className="w-100 mb-3">
                Login
              </Button>

              <div className="divider">
                <span>or login with</span>
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
              Don't have an account?{' '}
              <Link to="/doctor-signup" className="signup-link">
                Sign up here
              </Link>
            </p>
          </Card.Body>
        </Card>
      </div>
    </div>
  );
};

export default DoctorLogin;