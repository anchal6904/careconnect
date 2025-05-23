import { useState } from 'react';
import { Link } from 'react-router-dom';
import logo from '../assets/userform3cc.webp';
import { FaFacebookF, FaTwitter, FaGoogle } from 'react-icons/fa';

import './index.css';

const SignIn = () => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    phoneNumber: '',
    email: '',
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
    <div className="form-wrapper">
      {/* Left side - Form */}
      <div className="form-left">
        
        <div className="form-content">
          <h1 style={{color:"teal"}}>User Login</h1>
          
          <form onSubmit={handleSubmit} className="form-fields">
            <div className="name-row">

            </div>

            {/* <div className="form-group">
              <label htmlFor="phoneNumber">Phone Number</label>
              <input
                type="tel"
                id="phoneNumber"
                name="phoneNumber"
                value={formData.phoneNumber}
                onChange={handleChange}
                placeholder="Phone Number"
                required
              />
            </div> */}

            <div className="form-group">
              <label htmlFor="email">Email address</label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Email address"
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
                placeholder="Password"
                required
              />
            </div>

            {/* <div className="form-group">
              <label htmlFor="confirmPassword">Confirm Password</label>
              <input
                type="password"
                id="confirmPassword"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                placeholder="Confirm Password"
                required
              />
            </div> */}

            <button type="submit" className="submit-button">
              Sign in
            </button>

            <div className="divider">
              <span>or continue with</span>
            </div>

            <div className="social-buttons">
              <button type="button" className="social-button">
                <FaGoogle className='google-icon'/>
              </button>

              <button type="button" className="social-button">
                <FaFacebookF className='facebook-icon'/>
              </button>

              <button type="button" className="social-button">
                <FaTwitter className='twitter-icon'/>
              </button>
            </div>
          </form>

          <p className="login-link">
            Don&apos;t have an account?{' '}
            <Link to="/signin">Sign up</Link>
          </p>
        </div>
      </div>

      {/* Right side - Illustration */}
      <div className="form-right">
        <div>
          <img src={logo} alt="" />
        </div>
      </div>
    </div>
  );
};

export default SignIn;