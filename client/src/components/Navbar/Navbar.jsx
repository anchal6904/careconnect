import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Navbar, Container, Nav, NavDropdown } from 'react-bootstrap';
import SearchBar from '../SearchBar/SearchBar';
import './Navbar.css';

const NavigationBar = () => {
  const [isSticky, setIsSticky] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isDropdownHovered, setIsDropdownHovered] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const location = useLocation();
  const navbarRef = useRef(null);

  useEffect(() => {
    const handleScroll = () => {
      setIsSticky(window.scrollY > 40);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const handleCloseNavbar = () => {
      setExpanded(false);
    };
    document.addEventListener('closeNavbar', handleCloseNavbar);
    return () => document.removeEventListener('closeNavbar', handleCloseNavbar);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (navbarRef.current && !navbarRef.current.contains(event.target)) {
        setExpanded(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleDropdownToggle = (isOpen, event) => {
    if (event.source !== 'select') {
      setIsDropdownOpen(isOpen);
    }
  };

  const handleDropdownMouseEnter = () => {
    setIsDropdownHovered(true);
  };

  const handleDropdownMouseLeave = () => {
    setIsDropdownHovered(false);
  };

  const handleLinkClick = () => {
    setExpanded(false);
  };

  return (
    <Navbar 
      ref={navbarRef}
      expand="lg" 
      className={`main-navbar ${isSticky ? 'navbar-sticky' : ''}`}
      variant="light"
      expanded={expanded}
      onToggle={(expanded) => setExpanded(expanded)}
    >
      <Container>
        <Link to="/" className="navbar-brand brand" onClick={handleLinkClick}>
          <span className="brand-text">CareConnect</span>
        </Link>
        <div className="navbar-search-container d-none d-lg-block">
          <SearchBar />
        </div>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="ms-auto align-items-center">
            <div className="d-lg-none mb-3 w-100">
              <SearchBar />
            </div>
            <Link 
              to="/" 
              className={`nav-link nav-link-animated ${location.pathname === '/' ? 'active' : ''}`}
              onClick={handleLinkClick}
            >
              Home
            </Link>
            <Link 
              to="/about" 
              className={`nav-link nav-link-animated ${location.pathname === '/about' ? 'active' : ''}`}
              onClick={handleLinkClick}
            >
              About
            </Link>
            <Link 
              to="/doctors" 
              className={`nav-link nav-link-animated ${location.pathname === '/doctors' ? 'active' : ''}`}
              onClick={handleLinkClick}
            >
              Doctors
            </Link>
            <Link 
              to="/login" 
              className={`nav-link login-btn ${location.pathname === '/login' ? 'active' : ''}`}
              onClick={handleLinkClick}
            >
              Login
            </Link>
            <Link 
              to="/appointment" 
              className={`nav-link appointment-btn ${location.pathname === '/appointment' ? 'active' : ''}`}
              onClick={handleLinkClick}
            >
              Make an Appointment
            </Link>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default NavigationBar; 