import { supabase } from '../backend/config/supabaseClient';
import { doctorSignup as apiSignup, doctorLogin as apiLogin, updateDoctorProfile as apiUpdateProfile } from '../api/api';

export const doctorSignup = async (formData) => {
  try {
    const response = await apiSignup(formData);
    
    if (response.data.success) {
      return { success: true, data: response.data };
    } else {
      return { success: false, message: response.data.message };
    }
  } catch (error) {
    console.error('Doctor signup error details:', error.response?.data || error);
    return {
      success: false,
      message: error.response?.data?.message || 'Registration failed'
    };
  }
};

export const login = async (email, password) => {
  try {
    const response = await apiLogin({ email, password });
    console.log('Login response:', response); // Debug log
    
    if (response.data.success) {
      const userData = response.data.user;
      
      // Store all necessary user data
      localStorage.setItem('user', JSON.stringify(userData));
      localStorage.setItem('userRole', 'doctor');
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('id', userData.id);
      localStorage.setItem('isAuthenticated', 'true');
      localStorage.setItem('username', userData.name || userData.email);
      
      return { success: true, user: userData };
    } else {
      return { success: false, message: response.data.message };
    }
  } catch (error) {
    console.error('Login error:', error.response?.data || error);
    return {
      success: false,
      message: error.response?.data?.message || 'Login failed'
    };
  }
};

export const logout = async () => {
  try {
    await supabase.auth.signOut();
    // Clear all stored data
    localStorage.removeItem('user');
    localStorage.removeItem('userRole');
    localStorage.removeItem('token');
    localStorage.removeItem('id');
    localStorage.removeItem('isAuthenticated');
    localStorage.removeItem('username');
    return { success: true };
  } catch (error) {
    return { success: false, message: error.message };
  }
};

export const isAuthenticated = () => {
  return localStorage.getItem('isAuthenticated') === 'true';
};

export const getCurrentUser = () => {
  const user = localStorage.getItem('user');
  return user ? JSON.parse(user) : null;
};

export const getAuthToken = () => {
  return localStorage.getItem('token');
};

export const updateProfile = async (doctorId, updateData) => {
  try {
    const response = await apiUpdateProfile(doctorId, updateData);
    
    if (response.data.success) {
      return { success: true, data: response.data.data };
    } else {
      return { success: false, message: response.data.message };
    }
  } catch (error) {
    console.error('Profile update error:', error.response?.data || error);
    return {
      success: false,
      message: error.response?.data?.message || 'Profile update failed'
    };
  }
};

export const updateSchedule = async (doctorId, scheduleData) => {
  return updateProfile(doctorId, scheduleData);
};

