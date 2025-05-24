// Remove Supabase import since we're using hardcoded credentials
// import { supabase } from '../../../server/supabaseClient';

export const login = async (email, password) => {
  // Hardcoded credentials
  const validCredentials = {
    patient: {
      email: 'patient@example.com',
      password: 'patient123'
    },
    doctor: {
      email: 'doctor@example.com',
      password: 'doctor123'
    }
  };

  // Check patient credentials
  if (email === validCredentials.patient.email && password === validCredentials.patient.password) {
    const userData = {
      id: '1',
      email: email,
      name: 'John Doe',
      phone: '1234567890',
      role: 'patient'
    };
    localStorage.setItem('user', JSON.stringify(userData));
    localStorage.setItem('userRole', 'patient');
    localStorage.setItem('username', userData.name);
    return { success: true, role: 'patient' };
  }

  // Check doctor credentials
  if (email === validCredentials.doctor.email && password === validCredentials.doctor.password) {
    const userData = {
      id: '1',
      email: email,
      name: 'Dr. Smith',
      phone: '1234567890',
      role: 'doctor'
    };
    localStorage.setItem('user', JSON.stringify(userData));
    localStorage.setItem('userRole', 'doctor');
    localStorage.setItem('username', userData.name);
    return { success: true, role: 'doctor' };
  }

  return { success: false, message: 'Invalid credentials' };
};

export const signup = async (userData) => {
  // For now, just return success since we're using hardcoded credentials
  return {
    success: true,
    message: 'Registration successful'
  };
};

export const logout = () => {
  localStorage.removeItem('user');
  localStorage.removeItem('userRole');
  localStorage.removeItem('username');
};

export const isAuthenticated = () => {
  return !!localStorage.getItem('user');
};

export const getCurrentUser = () => {
  const user = localStorage.getItem('user');
  return user ? JSON.parse(user) : null;
};

export const getAuthToken = () => {
  const user = getCurrentUser();
  return user ? user.token : null;
}; 