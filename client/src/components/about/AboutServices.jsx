import React from "react";
import { Container, Row, Col, Card } from "react-bootstrap";
import { FaHospital, FaUserMd, FaFlask, FaMicroscope, FaAmbulance, FaBrain } from "react-icons/fa";
import './AboutServices.css';

const services = [
  {
    title: "Hospitals",
    description: "Access a wide network of top hospitals with advanced facilities and expert care.",
    icon: <FaHospital />,
  },
  {
    title: "Doctors",
    description: "Book appointments with experienced specialists and general physicians.",
    icon: <FaUserMd />,
  },
  {
    title: "Labs",
    description: "Get tests done at certified labs including blood tests, pathology, and more.",
    icon: <FaFlask />,
  },
  {
    title: "Research Centers",
    description: "Connect with research institutes for clinical trials and innovative treatments.",
    icon: <FaMicroscope />,
  },
  {
    title: "Emergency Booking",
    description: "Get instant access to emergency services, ambulances, and critical care without delays.",
    icon: <FaAmbulance />,
  },
  {
    title: "Mental Wellness Support",
    description: "Access licensed therapists and mental health professionals for stress, anxiety, and emotional well-being — all in a confidential, judgment-free space.",
    icon: <FaBrain />,
  },
];

const AboutServices = () => {
  return (
    <section className="about-services">
      <Container>
        <h2 className="about-services__title">Our Major Services</h2>
        <Row className="g-4">
          {services.map(({ title, description, icon }, index) => (
            <Col key={index} md={4}>
              <Card className="about-services__card">
                <Card.Body className="about-services__card-body">
                  <div className="about-services__icon" aria-label={title + " icon"} role="img">
                    {icon}
                  </div>
                  <Card.Title className="about-services__card-title">{title}</Card.Title>
                  <Card.Text className="about-services__card-text">{description}</Card.Text>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      </Container>
    </section>
  );
};

export default AboutServices; 