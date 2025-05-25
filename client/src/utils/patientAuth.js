import { supabase } from '../backend/config/supabaseClient';
import { patientSignup as apiSignup, patientLogin as apiLogin } from '../api/api';

export const signup = async (formData) => {
  try {
    const response = await apiSignup({
      name: formData.name,
      email: formData.email,
      phone_number: formData.phone_number,
      password: formData.password,
      confirm_password: formData.password // Backend requires this field
    });
    
    if (response.data.success) {
      return { success: true, data: response.data };
    } else {
      return { success: false, message: response.data.message };
    }
  } catch (error) {
    console.error('Signup error details:', error.response?.data || error);
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
      const userData = {
        ...response.data.data.patient,
        session: response.data.data.session
      };

      // Store user data consistently
      localStorage.setItem('user', JSON.stringify(userData));
      localStorage.setItem('userRole', 'patient');
      localStorage.setItem('isAuthenticated', 'true');
      localStorage.setItem('username', userData.name || userData.email);
      
      if (response.data.data.session?.access_token) {
        localStorage.setItem('token', response.data.data.session.access_token);
      }

      return { 
        success: true, 
        user: userData
      };
    } else {
      return { 
        success: false, 
        message: response.data.message || 'Login failed' 
      };
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
    localStorage.removeItem('user');
    localStorage.removeItem('userRole');
    localStorage.removeItem('isAuthenticated');
    localStorage.removeItem('username');
    localStorage.removeItem('token');
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