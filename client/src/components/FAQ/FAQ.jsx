import React, { useState } from 'react';
import { Container, Row, Col, Accordion } from 'react-bootstrap';
import { FaQuestionCircle } from 'react-icons/fa';
import './FAQ.css';

const faqs = [
  {
    id: 1,
    question: "How do I schedule an appointment?",
    answer: "You can schedule an appointment through our online booking system, by calling our helpline, or by visiting our facility in person. Our staff will help you find the most convenient time slot with your preferred doctor."
  },
  {
    id: 2,
    question: "What insurance plans do you accept?",
    answer: "We accept most major insurance plans including Medicare, Blue Cross Blue Shield, Aetna, and UnitedHealthcare. Please contact our insurance department for a complete list of accepted providers."
  },
  {
    id: 3,
    question: "What should I bring to my first appointment?",
    answer: "Please bring a valid ID, your insurance card, a list of current medications, any relevant medical records or test results, and a list of questions you may have for the doctor."
  },
  {
    id: 4,
    question: "Do you offer telemedicine services?",
    answer: "Yes, we offer telemedicine consultations for eligible patients. This service allows you to consult with our healthcare providers from the comfort of your home using video conferencing."
  },
  {
    id: 5,
    question: "What are your operating hours?",
    answer: "Our regular clinic hours are Monday to Friday from 8:00 AM to 6:00 PM, and Saturday from 9:00 AM to 2:00 PM. Emergency services are available 24/7."
  },
  {
    id: 6,
    question: "How do I access my medical records?",
    answer: "You can access your medical records through our patient portal. You can also request physical copies by filling out a medical records release form at our facility."
  }
];

const FAQ = () => {
  const [activeKey, setActiveKey] = useState(null);

  return (
    <section className="faq-section" id="faq">
      <Container>
        <div className="section-title" data-aos="fade-up">
          <h2>Frequently Asked Questions</h2>
          <p>Find answers to common questions about our services and procedures</p>
        </div>

        <Row className="justify-content-center">
          <Col lg={8}>
            <div className="faq-list" data-aos="fade-up" data-aos-delay="100">
              <Accordion activeKey={activeKey} onSelect={(key) => setActiveKey(key)}>
                {faqs.map((faq, index) => (
                  <Accordion.Item 
                    key={faq.id} 
                    eventKey={faq.id.toString()}
                    className="faq-item"
                    data-aos="fade-up"
                    data-aos-delay={index * 100}
                  >
                    <Accordion.Header>
                      <FaQuestionCircle className="faq-icon" />
                      {faq.question}
                    </Accordion.Header>
                    <Accordion.Body>
                      {faq.answer}
                    </Accordion.Body>
                  </Accordion.Item>
                ))}
              </Accordion>
            </div>
          </Col>
        </Row>
      </Container>
    </section>
  );
};

export default FAQ; 