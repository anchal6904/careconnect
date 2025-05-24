import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Container, Row, Col } from 'react-bootstrap';
import { FaClock, FaUserMd, FaCalendarAlt } from 'react-icons/fa';
import { hospitals, doctors } from '../../assets/hospitalData';
import './HospitalDetailPage.css';

const HospitalDetailPage = () => {
  const navigate = useNavigate();
  const [hospital, setHospital] = useState(null);
  const [hospitalDoctors, setHospitalDoctors] = useState([]);
  const [selectedDepartment, setSelectedDepartment] = useState('all');

  useEffect(() => {
    // Get hospital ID from URL
    const hospitalId = parseInt(window.location.pathname.split('/').pop());
    const currentHospital = hospitals.find(h => h.id === hospitalId);
    
    if (currentHospital) {
      setHospital(currentHospital);
      // Get doctors for this hospital
      const doctorsList = doctors.filter(d => d.hospitalId === hospitalId);
      setHospitalDoctors(doctorsList);
    }
  }, []);

  const filteredDoctors = selectedDepartment === 'all' 
    ? hospitalDoctors 
    : hospitalDoctors.filter(d => d.departmentId === parseInt(selectedDepartment));

  const renderDoctorCard = (doctor) => (
    <Col key={doctor.id} md={6} lg={4} className="mb-4">
      <div className="doctor-card">
        <div className="doctor-image">
          <img src={doctor.image} alt={doctor.name} />
        </div>
        <div className="doctor-info">
          <h4>{doctor.name}</h4>
          <div className="doctor-specialization">
            <FaUserMd /> {doctor.specialization}
          </div>
          <div className="doctor-schedule">
            <FaClock /> {doctor.availability || 'Mon-Fri, 9AM-5PM'}
          </div>
          <Button 
            variant="primary" 
            onClick={() => navigate('/appointment', { 
              state: { 
                selectedDoctor: doctor.id,
                selectedHospital: hospital.id
              }
            })}
            className="book-btn"
          >
            <FaCalendarAlt /> Book Now
          </Button>
        </div>
      </div>
    </Col>
  );

  if (!hospital) return null;

  return (
    <div className="hospital-detail-page">
      <Container>
        <div className="hospital-header">
          <h1>{hospital.name}</h1>
          <p>{hospital.address}</p>
        </div>

        <div className="doctors-section">
          <h2>Our Doctors</h2>
          <Row>
            {filteredDoctors.map(renderDoctorCard)}
          </Row>
        </div>
      </Container>
    </div>
  );
};

export default HospitalDetailPage; 