import React, { useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route, useLocation, Navigate } from 'react-router-dom'
import 'bootstrap/dist/css/bootstrap.min.css'
import 'react-toastify/dist/ReactToastify.css'
import AOS from 'aos'
import 'aos/dist/aos.css'
import { ToastContainer } from 'react-toastify'
import { isAuthenticated, getCurrentUser } from './utils/patientAuth.js'
import HomePage from './pages/HomePage/HomePage'
import AboutPage from './pages/AboutPage/AboutPage' 
import DepartmentsPage from './pages/DepartmentsPage/DepartmentsPage'
import FindDoctorPage from './pages/FindDoctorPage/FindDoctorPage'
// import LoginPage from './pages/LoginPage/LoginPage' // Commented out old login
import AppointmentPage from './pages/AppointmentPage/AppointmentPage'
import DiseasePage from './pages/DiseasePage/DiseasePage'
import DoctorsPage from '../src/pages/DoctorPage/DoctorsPage'
import DoctorDashboard from './pages/DoctorDashboard/DoctorDashboard'
import PatientDashboard from './pages/PatientDashboard/PatientDashboard'
import Footer from './components/Footer/Footer'
import NavigationBar from './components/Navbar/Navbar'
import DashboardNavbar from './components/DashboardNavbar/DashboardNavbar'
import ProtectedRoute from './components/ProtectedRoute/ProtectedRoute'

// New components
import OptionsPage from './pages/optionspage/OptionsPage'
import PatientLogin from './components/userLogin/login'
import PatientSignup from './components/userSignup/signup'
import DoctorLogin from './components/doctorlogin/login'
import DoctorSignup from './components/doctorsignup/signup'

import './App.css'

// Component to handle scroll restoration
const ScrollToTop = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
};

// Component to handle navbar visibility
const NavbarHandler = () => {
  const location = useLocation();
  const isAuth = isAuthenticated();
  const isDashboardRoute = location.pathname.includes('doctor-dashboard') || 
                          location.pathname.includes('patient-dashboard');

  if (isDashboardRoute) {
    return <DashboardNavbar />;
  }
  return <NavigationBar />;
};

// Component to handle footer visibility
const FooterHandler = () => {
  const location = useLocation();
  const isDashboardRoute = location.pathname.includes('doctor-dashboard') || 
                          location.pathname.includes('patient-dashboard');

  if (!isDashboardRoute) {
    return <Footer />;
  }
  return null;
};

// Protected Route component
const ProtectedRouteComponent = ({ children, allowedRoles }) => {
  const isAuth = isAuthenticated();
  const userRole = localStorage.getItem('userRole');

  if (!isAuth) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(userRole)) {
    // If user is not authorized for this route, redirect to their appropriate dashboard
    return <Navigate to={`/${userRole}-dashboard`} replace />;
  }

  return children;
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
  }, []);

  return (
    <Router>
      <div className="app">
        <ScrollToTop />
        <ToastContainer position="top-right" autoClose={3000} />
        <NavbarHandler />
        <div className="content">
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<HomePage />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/departments" element={<DepartmentsPage />} />
            <Route path="/find-doctor" element={<FindDoctorPage />} />
            {/* <Route path="/login" element={<LoginPage />} /> Old login route */}
            <Route path="/login" element={<OptionsPage />} />
            <Route path="/patient-login" element={<PatientLogin />} />
            <Route path="/patient-signup" element={<PatientSignup />} />
            <Route path="/doctor-login" element={<DoctorLogin />} />
            <Route path="/doctor-signup" element={<DoctorSignup />} />
            <Route path="/appointment" element={<AppointmentPage />} />
            <Route path="/diseases/:slug" element={<DiseasePage />} />
            <Route path="/doctors" element={<DoctorsPage />} />
            {/* Protected Dashboard Routes */}
            <Route
              path="/patient-dashboard/*"
              element={
                <ProtectedRouteComponent allowedRoles={['patient']}>
                  <PatientDashboard />
                </ProtectedRouteComponent>
              }
            />
            <Route
              path="/doctor-dashboard/*"
              element={
                <ProtectedRouteComponent allowedRoles={['doctor']}>
                  <DoctorDashboard />
                </ProtectedRouteComponent>
              }
            />
          </Routes>
          <FooterHandler />
        </div>
      </div>
    </Router>
  )
}

export default App
