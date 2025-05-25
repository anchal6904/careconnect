import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Container, Form, Button, Card } from 'react-bootstrap';
import { toast } from 'react-toastify';
import userformcc from '../../assets/userform cc.jpg';
import './Signup.css';
import { doctorSignup } from '../../utils/doctorAuth.js'; 

const DoctorSignup = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone_number: '',
    specialty: '',
    qualifications: '',
    experience: '',
    password: '',
    confirmPassword: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      if (formData.password !== formData.confirmPassword) {
        setError('Passwords do not match');
        toast.error('Passwords do not match');
        return;
      }

      const result = await doctorSignup({
        name: formData.name,
        email: formData.email,
        phone_number: formData.phone_number,
        specialty: formData.specialty,
        qualifications: formData.qualifications,
        experience: formData.experience,
        password: formData.password,
        confirm_password: formData.confirmPassword
      });

      if (result.success) {
        toast.success(result.message);
        navigate('/doctor-login');
      } else {
        setError(result.message);
        toast.error(result.message);
      }
    } catch (error) {
      console.error('Signup error:', error);
      toast.error(error.message || 'An error occurred during registration');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="signup-container" style={{ backgroundImage: `url(${userformcc})` }}>
      <Container style={{ display:"flex", alignItems:"center", justifyContent:"center"}}>
        <Card className="signup-card" >
          <Card.Body>
            <h2 className="text-center mb-4">Doctor Sign Up</h2>
            <Form onSubmit={handleSubmit} style={{display:"grid",gridTemplateColumns:"1fr 1fr", columnGap:"2rem"}}>
              <Form.Group className="mb-3">
                <Form.Label>Name</Form.Label>
                <Form.Control
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Enter name"
                  required
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Email</Form.Label>
                <Form.Control
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Enter email"
                  required
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Phone Number</Form.Label>
                <Form.Control
                  type="tel"
                  name="phone_number"
                  value={formData.phone_number}
                  onChange={handleChange}
                  placeholder="Enter phone number"
                  required
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Specialty</Form.Label>
                <Form.Control
                  type="text"
                  name="specialty"
                  value={formData.specialty}
                  onChange={handleChange}
                  placeholder="Enter your specialty"
                  required
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Qualifications</Form.Label>
                <Form.Control
                  type="text"
                  name="qualifications"
                  value={formData.qualifications}
                  onChange={handleChange}
                  placeholder="Enter your medical qualifications"
                  required
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Experience (years)</Form.Label>
                <Form.Control
                  type="number"
                  name="experience"
                  value={formData.experience}
                  onChange={handleChange}
                  placeholder="Enter years of experience"
                  required
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Password</Form.Label>
                <Form.Control
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Enter password"
                  required
                />
              </Form.Group>

              <Form.Group className="mb-5">
                <Form.Label>Confirm Password</Form.Label>
                <Form.Control
                  type="password"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  placeholder="Confirm password"
                  required
                />
              </Form.Group>

              <Button 
                variant="primary" 
                type="submit" 
                className="w-25" 
                style={{marginInline:"auto"}}
                disabled={isLoading}
              >
                {isLoading ? 'Signing Up...' : 'Sign Up'}
              </Button>
            </Form>
            {error && <div className="text-danger mb-3">{error}</div>}
              
            <p className="text-center mt-3">
              Already have an account?{' '}
              <Link to="/doctor-login" className="login-link">
                Login
              </Link>
            </p>
          </Card.Body>
        </Card>
      </Container>
    </div>
  );
};

export default DoctorSignup;