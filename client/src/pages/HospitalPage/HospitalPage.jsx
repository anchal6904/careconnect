import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Container, Row, Col, Button, Card } from 'react-bootstrap';
import { FaStar, FaMapMarkerAlt, FaPhone, FaEnvelope, FaClock, FaUserMd, FaGraduationCap, FaLanguage, FaHospital, FaArrowLeft, FaCalendarAlt, FaAward } from 'react-icons/fa';
import { hospitals, departments, doctors } from '../../assets/hospitalData';
import './HospitalPage.css';

const HospitalPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [hospital, setHospital] = useState(null);
  const [selectedDepartment, setSelectedDepartment] = useState(null);

  useEffect(() => {
    const foundHospital = hospitals.find(h => h.id === parseInt(id));
    if (foundHospital) {
      setHospital(foundHospital);
    }
  }, [id]);

  if (!hospital) {
    return <div>Hospital not found</div>;
  }

  const handleDoctorSelect = (doctorId) => {
    navigate('/appointment', { 
      state: { 
        selectedDoctor: doctorId,
        selectedHospital: hospital.id,
        selectedDepartment: doctors.find(d => d.id === doctorId)?.departmentId
      }
    });
  };

  const handleGeneralConsultation = () => {
    navigate('/appointment', { 
      state: { 
        selectedHospital: hospital.id,
        isGeneralConsultation: true
      }
    });
  };

  const handleBack = () => {
    navigate('/hospitals');
  };

  // Group doctors by department
  const doctorsByDepartment = hospital.departments.reduce((acc, deptId) => {
    const deptDoctors = doctors.filter(doctor => 
      doctor.hospitalId === hospital.id && 
      doctor.departmentId === deptId
    );
    if (deptDoctors.length > 0) {
      acc[deptId] = deptDoctors;
    }
    return acc;
  }, {});

  return (
    <div className="hospital-page">
      <div className="hospital-hero">
        <Container>
          <Button 
            variant="light" 
            className="back-button"
            onClick={handleBack}
          >
            <FaArrowLeft /> Back to Hospitals
          </Button>
          <Row className="align-items-center">
            <Col lg={8}>
              <h1>{hospital.name}</h1>
              <div className="hospital-meta">
                <span className="rating">
                  <FaStar /> {hospital.rating}
                </span>
                <span className="address">
                  <FaMapMarkerAlt /> {hospital.address}
                </span>
              </div>
            </Col>
            <Col lg={4} className="text-end">
              <Button 
                variant="primary" 
                size="lg"
                onClick={handleGeneralConsultation}
                className="general-consultation-btn"
              >
                <FaHospital className="me-2" />
                Book General Consultation
              </Button>
            </Col>
          </Row>
        </Container>
      </div>

      <Container className="hospital-content">
        <Row>
          <Col lg={8}>
            <Card className="hospital-description-card">
              <Card.Body>
                <h2>About Hospital</h2>
                <p>{hospital.description}</p>
              </Card.Body>
            </Card>

            <Card className="hospital-facilities-card">
              <Card.Body>
                <h2>Facilities</h2>
                <div className="facilities-grid">
                  {hospital.facilities.map((facility, index) => (
                    <div key={index} className="facility-item">
                      {facility}
                    </div>
                  ))}
                </div>
              </Card.Body>
            </Card>

            <div className="hospital-departments">
              <h2>Departments & Doctors</h2>
              {Object.entries(doctorsByDepartment).map(([deptId, deptDoctors]) => {
                const dept = departments.find(d => d.id === parseInt(deptId));
                return (
                  <Card key={deptId} className="department-card">
                    <Card.Body>
                      <div className="department-header">
                        <h3>{dept.name}</h3>
                        <p>{dept.description}</p>
                      </div>
                      <div className="doctors-grid">
                        {deptDoctors.map(doctor => (
                          <Card key={doctor.id} className="doctor-card">
                            <Card.Body>
                              <div className="doctor-card-content">
                                <div className="doctor-image-container">
                                  <div className="doctor-image">
                                    <img src={doctor.image} alt={doctor.name} />
                                  </div>
                                  <div className="doctor-rating">
                                    <FaStar /> 4.8
                                  </div>
                                </div>
                                <div className="doctor-info">
                                  <div className="doctor-header">
                                    <h4>Dr. {doctor.name}</h4>
                                    <span className="specialization">{doctor.specialization}</span>
                                  </div>
                                  <div className="doctor-meta">
                                    <span className="experience">
                                      <FaAward /> {doctor.experience}
                                    </span>
                                    <span className="availability">
                                      <FaCalendarAlt /> {doctor.availability}
                                    </span>
                                  </div>
                                  <div className="doctor-languages">
                                    {doctor.languages.map((lang, index) => (
                                      <span key={index} className="language-tag">{lang}</span>
                                    ))}
                                  </div>
                                  <Button 
                                    variant="primary"
                                    onClick={() => handleDoctorSelect(doctor.id)}
                                    className="book-appointment-btn"
                                  >
                                    <FaUserMd className="me-2" /> Book Appointment
                                  </Button>
                                </div>
                              </div>
                            </Card.Body>
                          </Card>
                        ))}
                      </div>
                    </Card.Body>
                  </Card>
                );
              })}
            </div>
          </Col>

          <Col lg={4}>
            <div className="hospital-sidebar">
              <Card className="contact-card">
                <Card.Body>
                  <h3>Contact Information</h3>
                  <div className="contact-info">
                    <p><FaPhone /> {hospital.contact.phone}</p>
                    <p><FaEnvelope /> {hospital.contact.email}</p>
                  </div>
                </Card.Body>
              </Card>

              <Card className="departments-card">
                <Card.Body>
                  <h3>Quick Links</h3>
                  <div className="departments-list">
                    {hospital.departments.map(deptId => {
                      const dept = departments.find(d => d.id === deptId);
                      return (
                        <div 
                          key={deptId} 
                          className={`department-item ${selectedDepartment === deptId ? 'active' : ''}`}
                          onClick={() => setSelectedDepartment(deptId)}
                        >
                          <h4>{dept.name}</h4>
                          <p>{dept.description}</p>
                        </div>
                      );
                    })}
                  </div>
                </Card.Body>
              </Card>
            </div>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default HospitalPage; 