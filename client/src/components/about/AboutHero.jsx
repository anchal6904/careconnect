import React from "react";
import { Container, Row, Col, Button } from "react-bootstrap";
import { FaCalendarCheck, FaHospital, FaUserMd, FaFlask } from "react-icons/fa";
import { Link } from "react-router-dom";
import img1 from '../../assets/appoint.png';
import './AboutHero.css';

const AboutHero = () => {
  return (
    <section className="about-hero">
      <Container>
        <Row className="align-items-center">
          <Col md={6} className="text-center text-md-start">
            <h1 className="about-hero__title">About Us</h1>
            <p className="about-hero__description">
              Your one-stop platform to book appointments with trusted doctors,
              hospitals, labs, and research centers easily.
            </p>
            <div className="about-hero__stats">
              <div className="about-hero__stat-item">
                <FaUserMd className="about-hero__stat-icon" />
                <div>
                  <h3>200+</h3>
                  <p>Doctors</p>
                </div>
              </div>
              <div className="about-hero__stat-item">
                <FaFlask className="about-hero__stat-icon" />
                <div>
                  <h3>50+</h3>
                  <p>Labs</p>
                </div>
              </div>
              <div className="about-hero__stat-item">
                <FaHospital className="about-hero__stat-icon" />
                <div>
                  <h3>100+</h3>
                  <p>Awards</p>
                </div>
              </div>
            </div>
            <Link to="/appointment">
              <Button variant="success" className="about-hero__cta">
                <FaCalendarCheck className="me-2" /> Make an Appointment
              </Button>
            </Link>
          </Col>

          <Col md={6} className="text-center">
            <div className="about-hero__image-wrapper">
              <img
                src={img1}
                alt="Healthcare Appointment"
                className="about-hero__image"
              />
              <div className="about-hero__experience">
                <h2>15+</h2>
                <p>Years of Experience</p>
              </div>
            </div>
          </Col>
        </Row>
      </Container>
    </section>
  );
};

export default AboutHero; 