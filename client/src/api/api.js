import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:5000',  // Remove /api since it's not in the backend
  headers: {
    'Content-Type': 'application/json',
  },
});

// Patient endpoints
export const patientSignup = async (formData) => api.post('/patients/signup', formData);
export const patientLogin = async (credentials) => api.post('/patients/login', credentials);


// Doctor endpoints
export const doctorSignup = async (formData) => api.post('/doctors/signupDoctor', formData);
export const doctorLogin = async (credentials) => api.post('/doctors/loginDoctor', credentials);
export const fetchDoctors = async () => api.get('/doctors/fetchDoctors');
export const fetchDoctorById = async (id) => api.get(`/doctors/doctor/${id}`);
export const updateDoctorProfile = async (doctorId, updateData) => api.put(`/doctors/updateDoctorProfile/${doctorId}`, updateData);

// Helper functions for specific updates
export const updateDoctorSchedule = async (doctorId, scheduleData) => {
  // Use the same updateDoctorProfile endpoint for schedule updates
  return updateDoctorProfile(doctorId, scheduleData);
};

export default api;