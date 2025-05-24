import React, { useState, useEffect, useCallback } from 'react';
import { Container, Row, Col, Form, Button, InputGroup } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { FaSearch, FaHospital, FaUserMd, FaMapMarkerAlt, FaStar, FaPhone, FaClock, FaTimes, FaFilter, FaArrowRight } from 'react-icons/fa';
import { hospitals, departments, doctors } from '../../assets/hospitalData';
import './HospitalsPage.css';

const HospitalsPage = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDepartment, setSelectedDepartment] = useState('');
  const [filteredHospitals, setFilteredHospitals] = useState(hospitals);
  const [isLoading, setIsLoading] = useState(false);
  const [searchStats, setSearchStats] = useState({ hospitals: 0, doctors: 0 });

  // Memoized search function
  const handleSearch = useCallback((query) => {
    setIsLoading(true);
    const normalizedQuery = query.toLowerCase().trim();
    
    if (!normalizedQuery && !selectedDepartment) {
      setFilteredHospitals(hospitals);
      setSearchStats({ hospitals: hospitals.length, doctors: 0 });
      setIsLoading(false);
      return;
    }

    // First, find all doctors matching the search query
    const matchingDoctors = doctors.filter(doctor => 
      doctor.name.toLowerCase().includes(normalizedQuery)
    );

    // Get unique hospital IDs from matching doctors
    const matchingHospitalIds = new Set(matchingDoctors.map(d => d.hospitalId));

    const results = hospitals.filter(hospital => {
      // Search in hospital name
      const hospitalMatch = hospital.name.toLowerCase().includes(normalizedQuery);
      
      // Check if hospital has any matching doctors
      const doctorMatch = matchingHospitalIds.has(hospital.id);

      // Filter by department if selected
      const departmentMatch = !selectedDepartment || 
        hospital.departments.includes(parseInt(selectedDepartment));

      return (hospitalMatch || doctorMatch) && departmentMatch;
    });

    // If we found matching doctors, modify the hospital cards to show those doctors
    if (matchingDoctors.length > 0) {
      results.forEach(hospital => {
        const hospitalDoctors = matchingDoctors.filter(d => d.hospitalId === hospital.id);
        if (hospitalDoctors.length > 0) {
          // Add matching doctors to the hospital object for rendering
          hospital.matchingDoctors = hospitalDoctors;
        }
      });
    }

    // Update search statistics
    setSearchStats({
      hospitals: results.length,
      doctors: matchingDoctors.length
    });

    setFilteredHospitals(results);
    setIsLoading(false);
  }, [selectedDepartment]);

  // Reduce debounce time for faster search
  useEffect(() => {
    const timer = setTimeout(() => {
      handleSearch(searchQuery);
    }, 200); // Reduced from 300ms to 200ms
    return () => clearTimeout(timer);
  }, [searchQuery, handleSearch]);

  const handleDepartmentFilter = useCallback((deptId) => {
    setSelectedDepartment(deptId);
    handleSearch(searchQuery);
  }, [searchQuery, handleSearch]);

  const handleClearSearch = () => {
    setSearchQuery('');
    setSelectedDepartment('');
    setFilteredHospitals(hospitals);
    setSearchStats({ hospitals: hospitals.length, doctors: 0 });
  };

  const handleHospitalClick = (hospitalId) => {
    navigate(`/hospital/${hospitalId}`);
  };

  const handleQuickBook = (hospitalId) => {
    // Find a general doctor for this hospital
    const generalDoctor = doctors.find(d => 
      d.hospitalId === hospitalId && 
      d.specialization.toLowerCase().includes('general')
    ) || doctors.find(d => d.hospitalId === hospitalId);

    if (generalDoctor) {
      navigate('/appointment', { 
        state: { 
          selectedHospital: hospitalId,
          selectedDoctor: generalDoctor.id,
          isGeneralConsultation: true
        }
      });
    }
  };

  const handleViewDetails = (hospitalId) => {
    navigate(`/hospital/${hospitalId}`);
  };

  const renderHospitalCard = (hospital) => {
    const hospitalDoctors = hospital.matchingDoctors || 
      doctors.filter(d => d.hospitalId === hospital.id).slice(0, 3);
    
    const hospitalDepartments = departments.filter(dept => 
      hospital.departments.includes(dept.id)
    );

    // Group departments into rows of 3
    const departmentRows = [];
    for (let i = 0; i < hospitalDepartments.length; i += 3) {
      departmentRows.push(hospitalDepartments.slice(i, i + 3));
    }

    return (
      <div key={hospital.id} className="hospital-card">
        <div className="hospital-image">
          <img src={hospital.image} alt={hospital.name} />
          <div className="hospital-rating">
            <FaStar /> {hospital.rating}
          </div>
        </div>
        
        <div className="hospital-content">
          <div className="hospital-header">
            <div className="hospital-title">
              <h3>{hospital.name}</h3>
              <div className="hospital-meta">
                <span className="address"><FaMapMarkerAlt /> {hospital.address}</span>
              </div>
            </div>
          </div>

          <div className="departments-section">
            {departmentRows.map((row, rowIndex) => (
              <div key={rowIndex} className="departments-row">
                {row.map(dept => (
                  <span key={dept.id} className="department-tag">{dept.name}</span>
                ))}
              </div>
            ))}
          </div>

          <div className="hospital-info">
            <div className="info-section">
              <h4>Available Doctors</h4>
              <div className="doctors-list">
                {hospitalDoctors.map(doctor => (
                  <div key={doctor.id} className="doctor-item">
                    <div className="doctor-info">
                      <h5>{doctor.name}</h5>
                      <div className="doctor-details">
                        <span className="department">{doctor.specialization}</span>
                        <span className="schedule">
                          <FaClock /> {doctor.availability || 'Mon-Fri, 9AM-5PM'}
                        </span>
                      </div>
                    </div>
                    <Button 
                      variant="primary" 
                      onClick={() => navigate('/appointment', { 
                        state: { 
                          selectedDoctor: doctor.id,
                          selectedHospital: hospital.id
                        }
                      })}
                      className="book-now-btn"
                    >
                      Book
                    </Button>
                  </div>
                ))}
                {!hospital.matchingDoctors && doctors.filter(d => d.hospitalId === hospital.id).length > 3 && (
                  <div className="more-doctors">
                    <Button 
                      variant="link" 
                      onClick={() => handleHospitalClick(hospital.id)}
                    >
                      View all {doctors.filter(d => d.hospitalId === hospital.id).length} doctors
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="hospital-card-actions">
            <Button 
              variant="primary" 
              onClick={() => handleViewDetails(hospital.id)}
              className="view-details-btn"
            >
              View Details
            </Button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="hospitals-page">
      <div className="page-background"></div>
      <Container>
        <div className="page-header">
          <h1>Find Hospitals & Doctors</h1>
          <p>Quick access to healthcare facilities and specialists</p>
        </div>

        <div className="search-filter-container">
          <div className="search-section">
            <InputGroup className="search-input-group">
              <InputGroup.Text>
                <FaSearch />
              </InputGroup.Text>
              <Form.Control
                type="text"
                placeholder="Search hospitals, doctors, or specialties..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="search-input"
              />
              {(searchQuery || selectedDepartment) && (
                <Button 
                  variant="link" 
                  className="clear-btn"
                  onClick={handleClearSearch}
                >
                  <FaTimes />
                </Button>
              )}
            </InputGroup>
          </div>

          <div className="filter-section">
            <Form.Select
              value={selectedDepartment}
              onChange={(e) => handleDepartmentFilter(e.target.value)}
              className="department-select"
            >
              <option value="">All Departments</option>
              {departments.map(dept => (
                <option key={dept.id} value={dept.id}>
                  {dept.name}
                </option>
              ))}
            </Form.Select>
          </div>
        </div>

        {isLoading ? (
          <div className="loading-container">
            <div className="spinner"></div>
            <p>Searching...</p>
          </div>
        ) : (
          <>
            {(searchQuery || selectedDepartment) && (
              <div className="search-results-info">
                <p>
                  Found {searchStats.hospitals} {searchStats.hospitals === 1 ? 'hospital' : 'hospitals'}
                  {searchStats.doctors > 0 && ` and ${searchStats.doctors} ${searchStats.doctors === 1 ? 'doctor' : 'doctors'}`}
                </p>
              </div>
            )}
            <Row className="hospitals-grid">
              {filteredHospitals.map(hospital => (
                <Col key={hospital.id} lg={4} md={6} className="mb-4">
                  {renderHospitalCard(hospital)}
                </Col>
              ))}
            </Row>
          </>
        )}
      </Container>
    </div>
  );
};

export default HospitalsPage; 