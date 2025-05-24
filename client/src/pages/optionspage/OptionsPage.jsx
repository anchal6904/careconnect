import React from 'react';
import { Link } from 'react-router-dom';
import { Container, Row, Col, Card } from 'react-bootstrap';
import { FaUserMd, FaUserInjured } from 'react-icons/fa';
import './OptionsPage.css';

const OptionsPage = () => {
  return (
    <div className="options-page">
      <Container>
        <div className="options-header text-center mb-5">
          <h1>Welcome to MediClinic</h1>
          <p className="lead">Please select your role to continue</p>
        </div>
        
        <Row className="justify-content-center">
          <Col md={6} lg={5} className="mb-4">
            <Link to="/patient-login" className="text-decoration-none">
              <Card className="option-card patient-card h-100">
                <Card.Body className="text-center">
                  <div className="icon-wrapper mb-4">
                    <FaUserInjured className="option-icon" />
                  </div>
                  <h3>Patient</h3>
                  <p className="text-muted">
                    Access your medical records, book appointments, and manage your healthcare journey
                  </p>
                  <div className="mt-4">
                    <span className="option-link">Login as Patient →</span>
                  </div>
                </Card.Body>
              </Card>
            </Link>
          </Col>
          
          <Col md={6} lg={5} className="mb-4">
            <Link to="/doctor-login" className="text-decoration-none">
              <Card className="option-card doctor-card h-100">
                <Card.Body className="text-center">
                  <div className="icon-wrapper mb-4">
                    <FaUserMd className="option-icon" />
                  </div>
                  <h3>Doctor</h3>
                  <p className="text-muted">
                    Manage your appointments, view patient records, and provide healthcare services
                  </p>
                  <div className="mt-4">
                    <span className="option-link">Login as Doctor →</span>
                  </div>
                </Card.Body>
              </Card>
            </Link>
          </Col>
        </Row>

        <div className="text-center mt-4">
          <p className="text-muted">
            Don't have an account?{' '}
            <Link to="/patient-signup" className="signup-link">Sign up as Patient</Link>
            {' '}or{' '}
            <Link to="/doctor-signup" className="signup-link">Sign up as Doctor</Link>
          </p>
        </div>
      </Container>
    </div>
  );
};

export default OptionsPage; 