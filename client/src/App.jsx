import React, { useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom'
import 'bootstrap/dist/css/bootstrap.min.css'
import AOS from 'aos'
import 'aos/dist/aos.css'
import HomePage from './pages/HomePage/HomePage'
import AboutPage from './pages/AboutPage/AboutPage'
import ServicesPage from './pages/ServicesPage/ServicesPage'
import DepartmentsPage from './pages/DepartmentsPage/DepartmentsPage'
import MedicalServicesPage from './pages/MedicalServicesPage/MedicalServicesPage'
import HealthPackagesPage from './pages/HealthPackagesPage/HealthPackagesPage'
import FindDoctorPage from './pages/FindDoctorPage/FindDoctorPage'
import PatientResourcesPage from './pages/PatientResourcesPage/PatientResourcesPage'
import InsurancePage from './pages/InsurancePage/InsurancePage'
import LoginPage from './pages/LoginPage/LoginPage'
import AppointmentPage from './pages/AppointmentPage/AppointmentPage'
import DiseasePage from './pages/DiseasePage/DiseasePage'
import HospitalsPage from './pages/HospitalsPage/HospitalsPage'
import HospitalPage from './pages/HospitalPage/HospitalPage'
import Footer from './components/Footer/Footer'
import NavigationBar from './components/Navbar/Navbar'
import './App.css'

// Component to handle scroll restoration
const ScrollToTop = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
};

function App() {
  useEffect(() => {
    // Initialize AOS
    AOS.init({
      duration: 1000,
      once: true,
      easing: 'ease'
    });

    // Disable browser's scroll restoration
    if ('scrollRestoration' in window.history) {
      window.history.scrollRestoration = 'manual';
    }

    // Handle initial route
    const path = window.location.pathname;
    if (path !== '/' && path !== '') {
      window.history.replaceState({}, '', '/');
    }

    // Handle browser back/forward buttons
    const handlePopState = () => {
      const currentPath = window.location.pathname;
      if (currentPath !== '/' && !currentPath.startsWith('/diseases/')) {
        window.history.replaceState({}, '', '/');
      }
      window.scrollTo(0, 0);
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  return (
    <Router>
      <div className="app">
        <ScrollToTop />
        <NavigationBar />
        <div className="content">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/services" element={<ServicesPage />} />
            <Route path="/departments" element={<DepartmentsPage />} />
            <Route path="/medical-services" element={<MedicalServicesPage />} />
            <Route path="/health-packages" element={<HealthPackagesPage />} />
            <Route path="/find-doctor" element={<FindDoctorPage />} />
            <Route path="/patient-resources" element={<PatientResourcesPage />} />
            <Route path="/insurance" element={<InsurancePage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/appointment" element={<AppointmentPage />} />
            <Route path="/diseases/:slug" element={<DiseasePage />} />
            <Route path="/hospitals" element={<HospitalsPage />} />
            <Route path="/hospital/:id" element={<HospitalPage />} />
          </Routes>
          <Footer />
        </div>
      </div>
    </Router>
  )
}

export default App
