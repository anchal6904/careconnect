import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import { BsChevronRight, BsClipboardData, BsGem, BsInboxes } from 'react-icons/bs';
import heroImage from '../../assets/hero-bg.jpg';
import './Hero.css';

const Hero = () => {
  return (
    <section className="hero-section">
      <div className="hero-bg" style={{ backgroundImage: `url(${heroImage})` }} />
      
      <Container>
        <div className="welcome">
          <h2>WELCOME TO CareConnect</h2>
          <p>We are team of talented doctors providing quality healthcare services</p>
        </div>

        <Row className='boxing'>
          <Col lg={4}>
            <div className="feature-box main-feature">
              <h3>Why Choose CareConnect?</h3>
              <p>We provide comprehensive healthcare services with state-of-the-art facilities.</p>
              <ul>
                <li>24/7 Emergency Services</li>
                <li>Expert Medical Professionals</li>
                <li>Advanced Medical Technology</li>
              </ul>
              <div className="text-center">
                <a href="#about" className="more-btn">
                  <span>Learn More</span> <BsChevronRight />
                </a>
              </div>
            </div>
          </Col>

          <Col lg={8}>
            <Row>
              <Col lg={4}>
                <div className="feature-box secondary-feature">
                  <BsClipboardData className="icon" />
                  <h4>Advanced Medical Care</h4>
                  <p>State-of-the-art medical facilities and services</p>
                </div>
              </Col>

              <Col lg={4}>
                <div className="feature-box secondary-feature">
                  <BsGem className="icon" />
                  <h4>Expert Specialists</h4>
                  <p>Team of highly qualified medical professionals</p>
                </div>
              </Col>

              <Col lg={4}>
                <div className="feature-box secondary-feature">
                  <BsInboxes className="icon" />
                  <h4>Modern Equipment</h4>
                  <p>Latest medical technology for accurate diagnosis</p>
                </div>
              </Col>
            </Row>
          </Col>
        </Row>
      </Container>
    </section>
  );
};

export default Hero; 