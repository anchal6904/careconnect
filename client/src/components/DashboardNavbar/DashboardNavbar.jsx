import React, { useState } from 'react';
import { Navbar, Nav, Container, NavDropdown } from 'react-bootstrap';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { FaUser, FaSignOutAlt, FaBars, FaBell, FaCog, FaCaretDown } from 'react-icons/fa';
import { logout } from '../../utils/auth';
import { toast } from 'react-toastify';
import './DashboardNavbar.css';

const DashboardNavbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [showDropdown, setShowDropdown] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);

  const userRole = localStorage.getItem('userRole');
  const username = localStorage.getItem('username');

  const handleLogout = () => {
    logout();
    toast.success('Logged out successfully');
    navigate('/');
  };

  const isActive = (path) => {
    return location.pathname === path;
  };

  const getNavItems = () => {
    if (userRole === 'doctor') {
      return [
        { path: '/doctor-dashboard', label: 'Dashboard', icon: '📊' },
        { path: '/doctor-dashboard/schedule', label: 'Schedule', icon: '📅' },
        { path: '/doctor-dashboard/appointments', label: 'Appointments', icon: '👥' },
        { path: '/doctor-dashboard/patients', label: 'Patients', icon: '👨‍⚕️' }
      ];
    } else {
      return [
        { path: '/patient-dashboard', label: 'Dashboard', icon: '📊' },
        { path: '/patient-dashboard/make-appointment', label: 'Book Appointment', icon: '📅' },
        { path: '/patient-dashboard/appointments', label: 'My Appointments', icon: '👥' }
      ];
    }
  };

  return (
    <Navbar bg="white" expand="lg" className="dashboard-navbar" fixed="top">
      <Container fluid>
        {/* Logo Section */}
        <div className="navbar-brand-section">
          <span className="brand-text">CareConnect</span>
        </div>

        <Navbar.Toggle 
          aria-controls="dashboard-nav" 
          onClick={() => setShowMobileMenu(!showMobileMenu)}
          className="navbar-toggler-custom"
        >
          <FaBars />
        </Navbar.Toggle>

        <Navbar.Collapse id="dashboard-nav" className={showMobileMenu ? 'show' : ''}>
          {/* Navigation Items Section */}
          <Nav className="mx-auto">
            {getNavItems().map((item) => (
              <Nav.Link
                key={item.path}
                as={Link}
                to={item.path}
                className={`nav-link-custom ${isActive(item.path) ? 'active' : ''}`}
              >
                <span className="nav-icon">{item.icon}</span>
                {item.label}
              </Nav.Link>
            ))}
          </Nav>

          {/* User Section */}
          <Nav className="ms-auto user-section">
            <NavDropdown
              title={
                <div className="user-profile">
                  <div className="dropdown-arrow">
                    <FaCaretDown />
                  </div>
                  <div className="user-avatar">
                    {username.charAt(0).toUpperCase()}
                  </div>
                  <span className="username">{username}</span>
                </div>
              }
              id="user-dropdown"
              show={showDropdown}
              onToggle={(isOpen) => setShowDropdown(isOpen)}
              className="user-dropdown"
              align="end"
            >
              <NavDropdown.Item as={Link} to={`/${userRole}-dashboard/profile`}>
                <FaUser className="me-2" />
                Profile
              </NavDropdown.Item>
              <NavDropdown.Item as={Link} to={`/${userRole}-dashboard/settings`}>
                <FaCog className="me-2" />
                Settings
              </NavDropdown.Item>
              <NavDropdown.Divider />
              <NavDropdown.Item onClick={handleLogout}>
                <FaSignOutAlt className="me-2" />
                Logout
              </NavDropdown.Item>
            </NavDropdown>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default DashboardNavbar; 