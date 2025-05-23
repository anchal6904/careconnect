import React, { useEffect } from 'react'
import 'bootstrap/dist/css/bootstrap.min.css'
import AOS from 'aos'
import 'aos/dist/aos.css'
import HomePage from './pages/HomePage/HomePage'
import Footer from './components/Footer/Footer'
import NavigationBar from './components/Navbar/Navbar'
import './App.css'

function App() {
  useEffect(() => {
    // Initialize AOS
    AOS.init({
      duration: 1000,
      once: true,
      easing: 'ease'
    });

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
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  return (
    <div className="app">
      <NavigationBar />
      <div className="content">
      <HomePage />
      <Footer />
      </div>
    </div>
  )
}

export default App
