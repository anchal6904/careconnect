import React, { useState } from 'react';
import { Form, Button, Card, Row, Col } from 'react-bootstrap';
import { FaUserMd, FaGraduationCap, FaAward } from 'react-icons/fa';
import './DoctorProfile.css';

const DoctorProfile = ({ doctorData, onUpdateProfile }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: doctorData?.name || '',
    email: doctorData?.email || '',
    phone_number: doctorData?.phone_number || '',
    specialty: doctorData?.specialty || '',
    experience: doctorData?.experience || '',
    qualification: doctorData?.qualification || '',
    bio: doctorData?.bio || '',
    location_link: doctorData?.location_link || '',
    consultation_fee: doctorData?.consultation_fee || '',
    // emergencyContact: doctorData?.emergencyContact || {
    //   name: '',
    //   relationship: '',
    //   phone: ''
    // }
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleEmergencyContactChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      emergencyContact: {
        ...prev.emergencyContact,
        [name]: value
      }
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onUpdateProfile({
      ...formData,
      location_link: formData.location_link
    });
    setIsEditing(false);
  };

  if (!doctorData) {
    return <div>Loading...</div>;
  }

  return (
    <div className="doctor-profile-container">
      <Card className="profile-card">
        <Card.Body>
          <div className="profile-header">
            <h3 className="profile-title">Doctor Profile</h3>
            {!isEditing && (
              <Button
                variant="outline-primary"
                onClick={() => setIsEditing(true)}
              >
                Edit Profile
              </Button>
            )}
          </div>

          <Form onSubmit={handleSubmit}>
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Full Name</Form.Label>
                  <Form.Control
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Email</Form.Label>
                  <Form.Control
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                  />
                </Form.Group>
              </Col>
            </Row>

            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Phone Number</Form.Label>
                  <Form.Control
                    type="tel"
                    name="phone"
                    value={formData.phone_number}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Specialty</Form.Label>
                  <Form.Control
                    type="text"
                    name="specialty"
                    value={formData.specialty}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                  />
                </Form.Group>
              </Col>
            </Row>

            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Years of Experience</Form.Label>
                  <Form.Control
                    type="number"
                    name="experience"
                    value={formData.experience}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Consultation Fee</Form.Label>
                  <Form.Control
                    type="number"
                    name="consultation_fee"
                    value={formData.consultation_fee}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                    min="0"
                    step="100"
                  />
                </Form.Group>
              </Col>
            </Row>

            <Row>
              <Col md={12}>
                <Form.Group className="mb-3">
                  <Form.Label>Qualifications</Form.Label>
                  <Form.Control
                    type="text"
                    name="qualification"
                    value={formData.qualification}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                  />
                </Form.Group>
              </Col>
            </Row>

            <Form.Group className="mb-3">
              <Form.Label>Bio</Form.Label>
              <Form.Control
                as="textarea"
                rows={4}
                name="bio"
                value={formData.bio}
                onChange={handleInputChange}
                disabled={!isEditing}
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Location</Form.Label>
              <Form.Control
                as="textarea"
                rows={2}
                name="location_link"
                value={formData.location_link}
                onChange={handleInputChange}
                disabled={!isEditing}
              />
            </Form.Group>

            {/* <div className="emergency-contact-section">
              <h5>Emergency Contact</h5>
              <Row>
                <Col md={4}>
                  <Form.Group className="mb-3">
                    <Form.Label>Name</Form.Label>
                    <Form.Control
                      type="text"
                      name="name"
                      value={formData.emergencyContact.name}
                      onChange={handleEmergencyContactChange}
                      disabled={!isEditing}
                    />
                  </Form.Group>
                </Col>
                <Col md={4}>
                  <Form.Group className="mb-3">
                    <Form.Label>Relationship</Form.Label>
                    <Form.Control
                      type="text"
                      name="relationship"
                      value={formData.emergencyContact.relationship}
                      onChange={handleEmergencyContactChange}
                      disabled={!isEditing}
                    />
                  </Form.Group>
                </Col>
                <Col md={4}>
                  <Form.Group className="mb-3">
                    <Form.Label>Phone</Form.Label>
                    <Form.Control
                      type="tel"
                      name="phone"
                      value={formData.emergencyContact.phone}
                      onChange={handleEmergencyContactChange}
                      disabled={!isEditing}
                    />
                  </Form.Group>
                </Col>
              </Row>
            </div> */}

            {isEditing && (
              <div className="profile-actions">
                <Button variant="primary" type="submit">
                  Save Changes
                </Button>
                <Button
                  variant="outline-secondary"
                  onClick={() => {
                    setIsEditing(false);
                    // Reset form data to original values
                    setFormData({
                      name: doctorData?.name || '',
                      email: doctorData?.email || '',
                      phone_number: doctorData?.phone_number || '',
                      specialty: doctorData?.specialty || '',
                      experience: doctorData?.experience || '',
                      qualification: doctorData?.qualification || '',
                      bio: doctorData?.bio || '',
                      location_link: doctorData?.location_link || '',
                      consultation_fee: doctorData?.consultation_fee || '',
                    });
                  }}
                  className="ms-2"
                >
                  Cancel
                </Button>
              </div>
            )}
          </Form>
        </Card.Body>
      </Card>
    </div>
  );
};

export default DoctorProfile; 