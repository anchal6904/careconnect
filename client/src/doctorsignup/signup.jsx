import { useState } from 'react';
import { Link } from 'react-router-dom';
import './index.css';

const SignUp = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phoneNumber: '',
    specialty: '',
    experience: '',
    qualifications: '',
    password: '',
    confirmPassword: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Form submitted:', formData);
  };

  return (
    <div className="form-container">
      <div className="form-header">
        {/* <h2 className="logo-text">CareConnect</h2> */}
        <h1 style={{color:"teal"}}>Doctor Registration</h1>
        {/* <p className="subtitle">Join our healthcare community</p> */}
      </div>
      
      <form onSubmit={handleSubmit} className="split-form">
        <div className="form-section">
          {/* Left Section */}
          <div className="form-group">
            <label htmlFor="name">Full Name</label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Enter your full name"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="email">Email Address</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Enter your email address"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="phoneNumber">Phone Number</label>
            <input
              type="tel"
              id="phoneNumber"
              name="phoneNumber"
              value={formData.phoneNumber}
              onChange={handleChange}
              placeholder="Enter your phone number"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="specialty">Specialty</label>
            <input
              type="text"
              id="specialty"
              name="specialty"
              value={formData.specialty}
              onChange={handleChange}
              placeholder="Your medical specialty"
              required
            />
          </div>
        </div>

        <div className="form-section">
          {/* Right Section */}
          <div className="form-group">
            <label htmlFor="experience">Years of Experience</label>
            <input
              type="number"
              id="experience"
              name="experience"
              value={formData.experience}
              onChange={handleChange}
              placeholder="Years of experience"
              min="0"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="qualifications">Qualifications</label>
            <input
              type="text"
              id="qualifications"
              name="qualifications"
              value={formData.qualifications}
              onChange={handleChange}
              placeholder="Your medical qualifications"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Create password"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="confirmPassword">Confirm Password</label>
            <input
              type="password"
              id="confirmPassword"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              placeholder="Confirm password"
              required
            />
          </div>
        </div>
      </form>

      <div className="form-footer">
        <button type="submit" className="submit-button">
          Register
        </button>
        <p className="login-link">
          Already have an account?{' '}
          <Link to="/signin">Sign in</Link>
        </p>
      </div>
    </div>
  );
};

export default SignUp;