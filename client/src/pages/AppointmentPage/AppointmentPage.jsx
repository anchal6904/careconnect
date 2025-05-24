import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Container, Row, Col, Form, Button } from 'react-bootstrap';
import { FaUser, FaEnvelope, FaPhone, FaCalendarAlt, FaClock, FaHospital, FaUserMd, FaVenusMars, FaBirthdayCake, FaArrowLeft } from 'react-icons/fa';
import { departments, hospitals, doctors } from '../../assets/hospitalData';
import './AppointmentPage.css';

const AppointmentPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    gender: '',
    dateOfBirth: '',
    department: '',
    hospital: '',
    doctor: '',
    isGeneralConsultation: false
  });

  const [availableDoctors, setAvailableDoctors] = useState([]);
  const [selectedHospital, setSelectedHospital] = useState(null);
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [showBackButton, setShowBackButton] = useState(false);

  useEffect(() => {
    if (location.state) {
      const { selectedDoctor, selectedHospital, isGeneralConsultation } = location.state;
      
      // Show back button only if coming from hospital page
      setShowBackButton(!!selectedHospital);
      
      if (selectedHospital) {
        const hospital = hospitals.find(h => h.id === selectedHospital);
        setSelectedHospital(hospital);
        setFormData(prev => ({
          ...prev,
          hospital: hospital.id,
          isGeneralConsultation: isGeneralConsultation || false
        }));

        if (isGeneralConsultation) {
          // Set department to General Medicine (id: 1)
          setFormData(prev => ({
            ...prev,
            department: '1'
          }));
        } else if (selectedDoctor) {
          const doctor = doctors.find(d => d.id === selectedDoctor);
          setSelectedDoctor(doctor);
          setFormData(prev => ({
            ...prev,
            department: doctor.departmentId,
            doctor: doctor.id
          }));
        }
      }
    }
  }, [location.state]);

  useEffect(() => {
    if (formData.hospital && formData.department) {
      const filteredDoctors = doctors.filter(d => 
        d.hospitalId === parseInt(formData.hospital) && 
        d.departmentId === parseInt(formData.department)
      );
      setAvailableDoctors(filteredDoctors);
    } else {
      setAvailableDoctors([]);
    }
  }, [formData.hospital, formData.department]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    if (name === 'department') {
      setFormData(prev => ({
        ...prev,
        doctor: ''
      }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle form submission
    console.log(formData);
    // Navigate to time slot selection
    navigate('/time-slots', { state: formData });
  };

  const handleBack = () => {
    // Navigate back to the hospital detail page
    navigate(`/hospital/${formData.hospital}`);
  };

  return (
    <div className="appointment-page">
      <Container>
        <div className="page-header">
          {showBackButton && (
            <Button 
              variant="link" 
              className="back-button"
              onClick={handleBack}
            >
              <FaArrowLeft /> Back
            </Button>
          )}
          <h1>Book an Appointment</h1>
          <p>Schedule your visit with our healthcare professionals</p>
        </div>

        <Row className="justify-content-center">
          <Col lg={8}>
            <div className="appointment-form-card">
              <Form onSubmit={handleSubmit}>
                <Row>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label><FaUser /> Full Name</Form.Label>
                      <Form.Control
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        required
                      />
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label><FaEnvelope /> Email</Form.Label>
                      <Form.Control
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        required
                      />
                    </Form.Group>
                  </Col>
                </Row>

                <Row>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label><FaPhone /> Phone Number</Form.Label>
                      <Form.Control
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                        required
                      />
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label><FaVenusMars /> Gender</Form.Label>
                      <Form.Select
                        name="gender"
                        value={formData.gender}
                        onChange={handleInputChange}
                        required
                      >
                        <option value="">Select Gender</option>
                        <option value="male">Male</option>
                        <option value="female">Female</option>
                        <option value="other">Other</option>
                      </Form.Select>
                    </Form.Group>
                  </Col>
                </Row>

                <Row>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label><FaBirthdayCake /> Date of Birth</Form.Label>
                      <Form.Control
                        type="date"
                        name="dateOfBirth"
                        value={formData.dateOfBirth}
                        onChange={handleInputChange}
                        required
                      />
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label><FaHospital /> Hospital</Form.Label>
                      <Form.Select
                        name="hospital"
                        value={formData.hospital}
                        onChange={handleInputChange}
                        required
                      >
                        <option value="">Select Hospital</option>
                        {hospitals.map(hospital => (
                          <option key={hospital.id} value={hospital.id}>
                            {hospital.name} - {hospital.address}
                          </option>
                        ))}
                      </Form.Select>
                    </Form.Group>
                  </Col>
                </Row>

                <Row>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label><FaCalendarAlt /> Department</Form.Label>
                      <Form.Select
                        name="department"
                        value={formData.department}
                        onChange={handleInputChange}
                        required
                        disabled={formData.isGeneralConsultation}
                      >
                        <option value="">Select Department</option>
                        {departments.map(dept => (
                          <option key={dept.id} value={dept.id}>
                            {dept.name}
                          </option>
                        ))}
                      </Form.Select>
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label><FaUserMd /> Doctor</Form.Label>
                      <Form.Select
                        name="doctor"
                        value={formData.doctor}
                        onChange={handleInputChange}
                        required
                        disabled={!formData.department || formData.isGeneralConsultation}
                      >
                        <option value="">Select Doctor</option>
                        {availableDoctors.map(doctor => (
                          <option key={doctor.id} value={doctor.id}>
                            {doctor.name} - {doctor.specialization}
                          </option>
                        ))}
                      </Form.Select>
                    </Form.Group>
                  </Col>
                </Row>

                <div className="form-actions">
                  <Button variant="primary" type="submit" size="lg">
                    <FaClock className="me-2" /> Proceed to Select Time Slot
                  </Button>
                </div>
              </Form>
            </div>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default AppointmentPage; 