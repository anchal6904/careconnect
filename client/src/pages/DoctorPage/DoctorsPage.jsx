import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Form, InputGroup, Button } from 'react-bootstrap';
import { FaSearch, FaStar, FaUserCircle, FaMapMarkerAlt } from 'react-icons/fa';
// import doctorsData from '../../assets/doctors_data.json';
import './DoctorsPage.css';
import { fetchDoctors } from '../../api/api';

const DoctorsPage = () => {
  const [doctorsData, setDoctorsData] = useState([]);
  const [specialties, setSpecialties] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSpecialty, setSelectedSpecialty] = useState('');
  const [showNearby, setShowNearby] = useState(false);
  const [userLocation, setUserLocation] = useState(null);
  const [sortedDoctors, setSortedDoctors] = useState([]);
  const [locationError, setLocationError] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const getDoctors = async () => {
      try {
        const response = await fetchDoctors();
        if (response.data.success) {
          const doctors = response.data.data;
          setDoctorsData(doctors);
          // Extract unique specialties
          const uniqueSpecialties = Array.from(new Set(doctors.map(doc => doc.specialty)));
          setSpecialties(uniqueSpecialties);
        } else {
          console.error('Failed to fetch doctors:', response.data.message);
        }
      } catch (error) {
        console.error('Error fetching doctors:', error);
      } finally {
        setIsLoading(false);
      }
    };

    getDoctors();
  }, []);

  // Helper to calculate distance between two lat/lng points (Haversine formula)
  function getDistance(lat1, lon1, lat2, lon2) {
    const toRad = (value) => value * Math.PI / 180;
    const R = 6371; // Radius of Earth in km
    const dLat = toRad(lat2 - lat1);
    const dLon = toRad(lon2 - lon1);
    const a = 
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) *
      Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c; // Distance in kilometers
  }

  // Filter doctors by search and specialty
  const filteredDoctors = doctorsData.filter((doctor) => {
    const matchesName = doctor.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesSpecialty = selectedSpecialty ? doctor.specialty === selectedSpecialty : true;
    return matchesName && matchesSpecialty;
  });

  // Sort doctors by distance if showNearby is true
  React.useEffect(() => {
    if (showNearby && userLocation) {
      const withDistance = doctorsData.map(doc => {
        if (!doc.latitude || !doc.longitude) return { ...doc, distance: Infinity };
        
        const distance = getDistance(
          userLocation.lat,
          userLocation.lng,
          parseFloat(doc.latitude),
          parseFloat(doc.longitude)
        );
        
        return {
          ...doc,
          distance: distance
        };
      }).filter(doc => doc.distance !== Infinity)
        .sort((a, b) => a.distance - b.distance);
      
      setSortedDoctors(withDistance);
    }
  }, [showNearby, userLocation]);

  // Format distance for display
  const formatDistance = (distance) => {
    if (distance < 1) {
      return `${(distance * 1000).toFixed(0)}m`;
    }
    return `${distance.toFixed(1)}km`;
  };

  // Get consultation fee (mocked for now)
  const getConsultationFee = (doctor) => {
    return doctor.fee || '₹500';
  };

  // Get rating (mocked for now)
  const getRating = (doctor) => {
    return doctor.rating || (Math.random() * 1.5 + 3.5).toFixed(1); // 3.5-5.0
  };

  // Handle Nearby Doctors button
  const handleNearbyClick = () => {
    setLocationError('');
    if (!navigator.geolocation) {
      setLocationError('Geolocation is not supported by your browser.');
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setUserLocation({ lat: position.coords.latitude, lng: position.coords.longitude });
        setShowNearby(true);
        setSearchQuery('');
        setSelectedSpecialty('');
      },
      (err) => {
        setLocationError('Unable to retrieve your location.');
      }
    );
  };

  // Handle clear nearby
  const handleClearNearby = () => {
    setShowNearby(false);
    setUserLocation(null);
    setSortedDoctors([]);
    setLocationError('');
  };

  // Choose which doctors to show
  const doctorsToShow = showNearby ? sortedDoctors : filteredDoctors;

  return (
    <div className="doctors-page">
      <Container>
        <div className="page-header">
          <h1>Find Doctors</h1>
          <p>Search and book appointments with top specialists</p>
        </div>
        <div className="search-filter-container enhanced">
          <InputGroup className="search-input-group">
            <InputGroup.Text>
              <FaSearch />
            </InputGroup.Text>
            <Form.Control
              type="text"
              placeholder="Search doctor by name..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="search-input"
              disabled={showNearby}
            />
          </InputGroup>
          <Form.Select
            value={selectedSpecialty}
            onChange={(e) => setSelectedSpecialty(e.target.value)}
            className="department-select"
            disabled={showNearby}
          >
            <option value="">All Departments</option>
            {specialties.map((spec) => (
              <option key={spec} value={spec}>{spec.charAt(0).toUpperCase() + spec.slice(1)}</option>
            ))}
          </Form.Select>
          <div className="nearby-btn-group">
            {!showNearby ? (
              <Button className="nearby-btn" onClick={handleNearbyClick} title="Find Nearby Doctors">
                <FaMapMarkerAlt className="me-2" /> Nearby
              </Button>
            ) : (
              <Button className="clear-nearby-btn" variant="outline-teal" onClick={handleClearNearby} title="Show All Doctors">
                Show All
              </Button>
            )}
          </div>
        </div>
        {locationError && <div className="location-error">{locationError}</div>}
        <Row className="doctors-grid">
          {isLoading ? (
            <Col xs={12} className="text-center py-5">
              <div className="loading-spinner">Loading doctors...</div>
            </Col>
          ) : doctorsToShow.length === 0 ? (
            <Col xs={12} className="text-center py-5">
              <div className="no-results">
                <FaUserCircle size={48} className="mb-3 text-muted" />
                <h4>No Doctors Found</h4>
                <p className="text-muted">
                  {showNearby 
                    ? "No doctors available in your area. Try expanding your search radius." 
                    : "No doctors match your search criteria. Try adjusting your filters."}
                </p>
              </div>
            </Col>
          ) : (
            doctorsToShow.map((doctor) => (
              <Col key={doctor.id} lg={4} md={6} sm={12} xs={12} className="mb-4">
                <div className="doctor-card doctor-card-horizontal wider">
                  <div className="doctor-card-content">
                    <div className="doctor-profile-image">
                      {doctor.image ? (
                        <img src={doctor.image} alt={doctor.name} className="profile-img-circle" />
                      ) : (
                        <div className="profile-img-placeholder">
                          {doctor.name.replace('Dr. ', '').charAt(0)}
                        </div>
                      )}
                    </div>
                    <div className="doctor-details-right">
                      <h5 className="doctor-name">{doctor.name}</h5>
                      <div className="doctor-department">
                        {doctor.specialty ? doctor.specialty.charAt(0).toUpperCase() + doctor.specialty.slice(1) : 'General'}
                      </div>
                      <div className="doctor-experience">
                        {doctor.experience ? `${doctor.experience} years experience` : 'Experience not specified'}
                      </div>
                      <div className="doctor-rating">
                        <FaStar className="star-icon" /> {doctor.rating || "New"}
                        {showNearby && doctor.distance !== undefined && (
                          <span className="doctor-distance">
                            <FaMapMarkerAlt className="me-1" />
                            {formatDistance(doctor.distance)}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="doctor-card-footer-horizontal">
                    <div className="consultation-fee">
                      Consultation Fee: <span>₹{doctor.consultation_fee || "Not specified"}</span>
                    </div>
                    <Button className="book-btn">Book</Button>
                  </div>
                </div>
              </Col>
            ))
          )}
        </Row>
      </Container>
    </div>
  );
};

export default DoctorsPage; 