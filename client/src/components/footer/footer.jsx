import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Form, Button } from 'react-bootstrap';
import { 
  FaTwitter, FaFacebook, FaInstagram, FaLinkedin, FaArrowUp, 
  FaMapMarkerAlt, FaPhoneAlt, FaEnvelope, FaAmbulance, FaClinicMedical,
  FaUserMd, FaCalendarCheck, FaHeartbeat, FaHospital, FaClock, FaPhoneVolume
} from 'react-icons/fa';
import './Footer.css';

const Footer = () => {
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [emailValue, setEmailValue] = useState('');
  const [isSubscribed, setIsSubscribed] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 300);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (emailValue) {
      setIsSubscribed(true);
      setEmailValue('');
      setTimeout(() => setIsSubscribed(false), 3000);
    }
  };

  const emergencyServices = [
    { icon: <FaAmbulance />, text: '24/7 Emergency' },
    { icon: <FaPhoneVolume />, text: 'Quick Response' },
    { icon: <FaUserMd />, text: 'Expert Doctors' },
    { icon: <FaClock />, text: 'Always Available' },
  ];

  return (
    <footer className="footer-area">
      <div className="emergency-banner">
        <Container>
          <div className="emergency-content">
            {emergencyServices.map((service, index) => (
              <div key={index} className="emergency-item">
                {service.icon}
                <span>{service.text}</span>
              </div>
            ))}
          </div>
        </Container>
      </div>

      <Container>
        <Row className="footer-content">
          <Col lg={3} md={6} className="footer-section" data-aos="fade-up" data-aos-delay="100">
            <h3>CareConnect</h3>
            <p className="about-text">
              Providing world-class healthcare services with a commitment to excellence and compassion.
            </p>
            <p className="address">
              <FaMapMarkerAlt className="icon" />
              123 Healthcare Avenue<br />
              Medical District<br />
              New York, NY 10001
            </p>
            <div className="contact-info">
              <p><FaPhoneAlt className="icon" /> Emergency: <span className="emergency-number">911</span></p>
              <p><FaPhoneAlt className="icon" /> Helpline: +1 (555) 123-4567</p>
              <p><FaEnvelope className="icon" /> care@careconnect.com</p>
            </div>
          </Col>

          <Col lg={3} md={6} className="footer-section" data-aos="fade-up" data-aos-delay="200">
            <h4>Quick Links</h4>
            <ul className="quick-links">
              <li><FaHeartbeat className="icon" /><a href="/about">About Us</a></li>
              <li><FaUserMd className="icon" /><a href="/doctors">Our Doctors</a></li>
              <li><FaHospital className="icon" /><a href="/departments">Departments</a></li>
              <li><FaCalendarCheck className="icon" /><a href="/appointment">Book Appointment</a></li>
              <li><FaClinicMedical className="icon" /><a href="/services">Our Services</a></li>
            </ul>
          </Col>

          <Col lg={3} md={6} className="footer-section" data-aos="fade-up" data-aos-delay="300">
            <h4>Our Services</h4>
            <ul className="services-links">
              <li><a href="/services/emergency">Emergency Care</a></li>
              <li><a href="/services/cardiology">Cardiology</a></li>
              <li><a href="/services/neurology">Neurology</a></li>
              <li><a href="/services/pediatrics">Pediatrics</a></li>
              <li><a href="/services/diagnostics">Diagnostics</a></li>
            </ul>
          </Col>

          <Col lg={3} md={6} className="footer-section" data-aos="fade-up" data-aos-delay="400">
            <h4>Stay Connected</h4>
            <p className="newsletter-text">Subscribe to receive health tips and updates</p>
            <Form className="newsletter-form" onSubmit={handleSubscribe}>
              <Form.Group className="mb-3">
                <Form.Control
                  type="email"
                  placeholder="Enter your email"
                  className="newsletter-input"
                  value={emailValue}
                  onChange={(e) => setEmailValue(e.target.value)}
                />
              </Form.Group>
              <Button 
                type="submit" 
                className={`newsletter-btn ${isSubscribed ? 'subscribed' : ''}`}
                disabled={isSubscribed}
              >
                {isSubscribed ? 'Subscribed ✓' : 'Subscribe'}
              </Button>
            </Form>
            <div className="social-links">
              <a href="#" className="twitter"><FaTwitter /></a>
              <a href="#" className="facebook"><FaFacebook /></a>
              <a href="#" className="instagram"><FaInstagram /></a>
              <a href="#" className="linkedin"><FaLinkedin /></a>
            </div>
          </Col>
        </Row>

        <Row className="copyright-row">
          <Col md={12}>
            <div className="copyright">
              © {new Date().getFullYear()} <strong>Medilab</strong>. All Rights Reserved
            </div>
          </Col>
        </Row>
      </Container>

      <button 
        className={`scroll-top ${showScrollTop ? 'active' : ''}`}
        onClick={scrollToTop}
        aria-label="Scroll to top"
      >
        <FaArrowUp />
      </button>
    </footer>
  );
};

export default Footer; 