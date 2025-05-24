import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { Container, Row, Col, Card, Accordion, Alert } from 'react-bootstrap';
import { FaArrowLeft, FaYoutube } from 'react-icons/fa';
import { diseaseData } from '../../data/diseaseData';
import './DiseasePage.css';

const DiseasePage = () => {
  const { slug } = useParams();
  const disease = diseaseData.find(d => d.slug === slug);

  if (!disease) {
    return (
      <Container className="disease-not-found">
        <Alert variant="danger">
          Disease not found
        </Alert>
        <Link to="/" className="btn btn-primary">
          <FaArrowLeft /> Back to Home
        </Link>
      </Container>
    );
  }

  return (
    <div className="disease-page">
      <Container>
        <div className="disease-header">
          <h1>{disease.name}</h1>
          <p className="disease-description">{disease.description}</p>
        </div>

        <Row>
          <Col lg={8}>
            {disease.image && (
              <div className="disease-image">
                <img src={disease.image} alt={disease.name} />
              </div>
            )}

            <Card className="mb-4">
              <Card.Header as="h2">Overview</Card.Header>
              <Card.Body>
                <h3>Causes</h3>
                <ul>
                  {disease.causes?.map((cause, index) => (
                    <li key={index}>{cause}</li>
                  ))}
                </ul>

                <h3>Symptoms</h3>
                <ul>
                  {disease.symptoms?.map((symptom, index) => (
                    <li key={index}>{symptom}</li>
                  ))}
                </ul>
              </Card.Body>
            </Card>

            <Card className="mb-4">
              <Card.Header as="h2">Management</Card.Header>
              <Card.Body>
                <h3>Prevention</h3>
                <ul>
                  {disease.prevention?.map((item, index) => (
                    <li key={index}>{item}</li>
                  ))}
                </ul>

                <h3>Treatment</h3>
                <ul>
                  {disease.treatment?.map((item, index) => (
                    <li key={index}>{item}</li>
                  ))}
                </ul>
              </Card.Body>
            </Card>

            {disease.faqs && disease.faqs.length > 0 && (
              <Card className="mb-4">
                <Card.Header as="h2">Frequently Asked Questions</Card.Header>
                <Card.Body>
                  <Accordion>
                    {disease.faqs.map((faq, index) => (
                      <Accordion.Item key={index} eventKey={index.toString()}>
                        <Accordion.Header>{faq.question}</Accordion.Header>
                        <Accordion.Body>{faq.answer}</Accordion.Body>
                      </Accordion.Item>
                    ))}
                  </Accordion>
                </Card.Body>
              </Card>
            )}
          </Col>

          <Col lg={4}>
            <div className="disease-sidebar">
              <Card className="mb-4">
                <Card.Header as="h3">Quick Information</Card.Header>
                <Card.Body>
                  <p><strong>Specialist:</strong> {disease.specialist}</p>
                  <p><strong>Also Known As:</strong></p>
                  <ul className="synonyms-list">
                    {disease.synonyms?.map((synonym, index) => (
                      <li key={index}>{synonym}</li>
                    ))}
                  </ul>
                </Card.Body>
              </Card>

              {disease.relatedDiseases && disease.relatedDiseases.length > 0 && (
                <Card className="mb-4">
                  <Card.Header as="h3">Related Conditions</Card.Header>
                  <Card.Body>
                    <ul className="related-diseases-list">
                      {disease.relatedDiseases.map((related, index) => (
                        <li key={index}>{related}</li>
                      ))}
                    </ul>
                  </Card.Body>
                </Card>
              )}

              {disease.videos && disease.videos.length > 0 && (
                <Card className="mb-4">
                  <Card.Header as="h3">Educational Videos</Card.Header>
                  <Card.Body>
                    <div className="video-links">
                      {disease.videos.map((video, index) => (
                        <a 
                          key={index}
                          href={video}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="video-link"
                        >
                          <FaYoutube /> Watch Video {index + 1}
                        </a>
                      ))}
                    </div>
                  </Card.Body>
                </Card>
              )}
            </div>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default DiseasePage; 