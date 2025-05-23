import React, { useState, useEffect } from 'react';
import { Navbar, Container, Nav, NavDropdown } from 'react-bootstrap';
import SearchBar from '../SearchBar/SearchBar';
import './Navbar.css';

const NavigationBar = () => {
  const [isSticky, setIsSticky] = useState(false);
  const [activeLink, setActiveLink] = useState('home');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isDropdownHovered, setIsDropdownHovered] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsSticky(window.scrollY > 40);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleNavClick = (link) => {
    setActiveLink(link);
    // Remove the /disease/ prefix and hash from URLs
    window.history.pushState({}, '', `/${link === 'home' ? '' : link}`);
  };

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

  return (
    <Navbar 
      expand="lg" 
      className={`main-navbar ${isSticky ? 'navbar-sticky' : ''}`}
      variant="light"
    >
      <Container>
        <Navbar.Brand href="/" className="brand" onClick={() => handleNavClick('home')}>
          <span className="brand-text">CareConnect</span>
        </Navbar.Brand>
        <div className="navbar-search-container d-none d-lg-block">
          <SearchBar />
        </div>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="ms-auto align-items-center">
            <div className="d-lg-none mb-3 w-100">
              <SearchBar />
            </div>
            <Nav.Link 
              href="/" 
              className={`nav-link-animated ${activeLink === 'home' ? 'active' : ''}`}
              onClick={(e) => {
                e.preventDefault();
                handleNavClick('home');
              }}
            >
              Home
            </Nav.Link>
            <Nav.Link 
              href="/about" 
              className={`nav-link-animated ${activeLink === 'about' ? 'active' : ''}`}
              onClick={(e) => {
                e.preventDefault();
                handleNavClick('about');
              }}
            >
              About
            </Nav.Link>
            <Nav.Link 
              href="/services" 
              className={`nav-link-animated ${activeLink === 'services' ? 'active' : ''}`}
              onClick={(e) => {
                e.preventDefault();
                handleNavClick('services');
              }}
            >
              Services
            </Nav.Link>
            <Nav.Link 
              href="/departments" 
              className={`nav-link-animated ${activeLink === 'departments' ? 'active' : ''}`}
              onClick={(e) => {
                e.preventDefault();
                handleNavClick('departments');
              }}
            >
              Hospitals & Clinics
            </Nav.Link>
            {/* <Nav.Link 
              href="/doctors" 
              className={`nav-link-animated ${activeLink === 'doctors' ? 'active' : ''}`}
              onClick={(e) => {
                e.preventDefault();
                handleNavClick('doctors');
              }}
            >
              Doctors
            </Nav.Link> */}
            <div 
              className="nav-dropdown"
              onMouseEnter={handleDropdownMouseEnter}
              onMouseLeave={handleDropdownMouseLeave}
            >
              <NavDropdown 
                title="More" 
                id="basic-nav-dropdown"
                className={`nav-link-animated ${activeLink === 'more' ? 'active' : ''}`}
                show={isDropdownOpen || isDropdownHovered}
                onToggle={handleDropdownToggle}
              >
                <NavDropdown.Item 
                  href="/medical-services" 
                  onClick={(e) => {
                    e.preventDefault();
                    handleNavClick('medical-services');
                  }}
                >
                  Medical Services
                </NavDropdown.Item>
                <NavDropdown.Item 
                  href="/health-packages" 
                  onClick={(e) => {
                    e.preventDefault();
                    handleNavClick('health-packages');
                  }}
                >
                  Health Packages
                </NavDropdown.Item>
                <NavDropdown.Item 
                  href="/find-doctor" 
                  onClick={(e) => {
                    e.preventDefault();
                    handleNavClick('find-doctor');
                  }}
                >
                  Find a Doctor
                </NavDropdown.Item>
                <NavDropdown.Item 
                  href="/patient-resources" 
                  onClick={(e) => {
                    e.preventDefault();
                    handleNavClick('patient-resources');
                  }}
                >
                  Patient Resources
                </NavDropdown.Item>
                <NavDropdown.Item 
                  href="/insurance" 
                  onClick={(e) => {
                    e.preventDefault();
                    handleNavClick('insurance');
                  }}
                >
                  Insurance & Billing
                </NavDropdown.Item>
              </NavDropdown>
            </div>
            {/* <Nav.Link 
              href="/contact" 
              className={`nav-link-animated ${activeLink === 'contact' ? 'active' : ''}`}
              onClick={(e) => {
                e.preventDefault();
                handleNavClick('contact');
              }}
            >
              Contact
            </Nav.Link> */}
            <Nav.Link 
              href="/login" 
              className={`login-btn ${activeLink === 'login' ? 'active' : ''}`}
              onClick={(e) => {
                e.preventDefault();
                handleNavClick('login');
              }}
            >
              Login
            </Nav.Link>
            <Nav.Link 
              href="/appointment" 
              className={`appointment-btn ${activeLink === 'appointment' ? 'active' : ''}`}
              onClick={(e) => {
                e.preventDefault();
                handleNavClick('appointment');
              }}
            >
              Make an Appointment
            </Nav.Link>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default NavigationBar; 