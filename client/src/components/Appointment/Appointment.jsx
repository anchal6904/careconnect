import React, { useState, useEffect } from 'react';
import { FaUserMd, FaCalendarAlt, FaHospital, FaUserAlt, FaBirthdayCake, FaCheckCircle, FaTimesCircle } from 'react-icons/fa';
import { MdEmail, MdPhone, MdMessage, MdSchedule, MdCalendarToday } from 'react-icons/md';
import { supabase } from '../../backend/config/supabaseClient';
import './Appointment.css';

const Appointment = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    dob: '',
    dobDisplay: '',
    appointmentDate: '',
    appointmentDateDisplay: '',
    gender: '',
    department: '',
    doctor: '',
    message: ''
  });

  const [formStatus, setFormStatus] = useState({
    loading: false,
    success: false,
    error: false,
    errorMessage: ''
  });

  const [departments, setDepartments] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const [showNotification, setShowNotification] = useState({
    show: false,
    type: '',
    message: ''
  });

  // Date validation helpers
  const today = new Date().toISOString().split('T')[0];
  const maxDate = new Date();
  maxDate.setFullYear(maxDate.getFullYear() - 1);
  const maxDob = maxDate.toISOString().split('T')[0];
  const futureDate = new Date();
  futureDate.setMonth(futureDate.getMonth() + 3);
  const maxAppointmentDate = futureDate.toISOString().split('T')[0];

  // Load departments on component mount
  useEffect(() => {
    const fetchDepartments = async () => {
      const { data, error } = await supabase
        .from('departments')
        .select('*')
        .order('name', { ascending: true });

      if (error) {
        console.error('Error fetching departments:', error);
        setFormStatus(prev => ({
          ...prev,
          error: true,
          errorMessage: 'Failed to load departments. Please refresh the page.'
        }));
      } else {
        setDepartments(data);
      }
      setIsLoading(false);
    };

    fetchDepartments();
  }, []);

  // Load doctors when department is selected
  useEffect(() => {
    const fetchDoctors = async () => {
      if (formData.department) {
        const { data, error } = await supabase
          .from('doctors')
          .select('*')
          .eq('department_id', formData.department)
          .order('name', { ascending: true });

        if (error) {
          console.error('Error fetching doctors:', error);
          setFormStatus(prev => ({
            ...prev,
            error: true,
            errorMessage: 'Failed to load doctors. Please select department again.'
          }));
        } else {
          setDoctors(data);
        }
      }
    };

    fetchDoctors();
  }, [formData.department]);

  const formatDateForInput = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    const year = date.getFullYear();
    return `${month}/${day}/${year}`;
  };

  const parseDateInput = (value, inputName) => {
    let cleaned = value.replace(/[^\d/]/g, '');

    // Auto-add slashes
    if (cleaned.length >= 2 && cleaned.charAt(2) !== '/') {
      cleaned = cleaned.slice(0, 2) + '/' + cleaned.slice(2);
    }
    if (cleaned.length >= 5 && cleaned.charAt(5) !== '/') {
      cleaned = cleaned.slice(0, 5) + '/' + cleaned.slice(5);
    }

    cleaned = cleaned.slice(0, 10);

    if (cleaned.length === 10) {
      const [month, day, year] = cleaned.split('/');
      const date = new Date(year, month - 1, day);
      
      if (date.getMonth() === parseInt(month) - 1 && 
          date.getDate() === parseInt(day) && 
          date.getFullYear() === parseInt(year)) {
        
        const formattedDate = `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
        
        if (inputName === 'dob') {
          if (formattedDate <= maxDob) {
            return formattedDate;
          }
        } else if (inputName === 'appointmentDate') {
          if (formattedDate >= today && formattedDate <= maxAppointmentDate) {
            return formattedDate;
          }
        }
      }
    }
    return '';
  };

  const handleDateInputChange = (e) => {
    const { name, value } = e.target;
    const baseFieldName = name.replace('Display', '');

    if (e.target.type === 'date') {
      setFormData(prev => ({
        ...prev,
        [baseFieldName]: value,
        [`${baseFieldName}Display`]: formatDateForInput(value)
      }));
    } else {
      const displayValue = value;
      const dateValue = parseDateInput(value, baseFieldName);
      
      setFormData(prev => ({
        ...prev,
        [baseFieldName]: dateValue,
        [`${baseFieldName}Display`]: displayValue
      }));
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    if (name === 'phone') {
      const phoneNumber = value.replace(/\D/g, '');
      if (phoneNumber.length <= 10) {
        setFormData(prev => ({
          ...prev,
          [name]: phoneNumber
        }));
      }
      return;
    }

    if (name === 'department') {
      setFormData(prev => ({
        ...prev,
        [name]: value,
        doctor: ''
      }));
      return;
    }

    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const validateEmail = (email) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  };

  const validateForm = () => {
    const { name, email, phone, dob, appointmentDate, gender, department, doctor } = formData;
    
    if (!name.trim()) {
      setFormStatus({
        loading: false,
        success: false,
        error: true,
        errorMessage: 'Please enter your full name'
      });
      return false;
    }
    
    if (!validateEmail(email)) {
      setFormStatus({
        loading: false,
        success: false,
        error: true,
        errorMessage: 'Please enter a valid email address'
      });
      return false;
    }
    
    if (phone.length !== 10) {
      setFormStatus({
        loading: false,
        success: false,
        error: true,
        errorMessage: 'Please enter a 10-digit phone number'
      });
      return false;
    }
    
    if (!dob) {
      setFormStatus({
        loading: false,
        success: false,
        error: true,
        errorMessage: 'Please enter your date of birth'
      });
      return false;
    }
    
    if (!appointmentDate) {
      setFormStatus({
        loading: false,
        success: false,
        error: true,
        errorMessage: 'Please select an appointment date'
      });
      return false;
    }
    
    if (!gender) {
      setFormStatus({
        loading: false,
        success: false,
        error: true,
        errorMessage: 'Please select your gender'
      });
      return false;
    }
    
    if (!department) {
      setFormStatus({
        loading: false,
        success: false,
        error: true,
        errorMessage: 'Please select a department'
      });
      return false;
    }
    
    if (!doctor) {
      setFormStatus({
        loading: false,
        success: false,
        error: true,
        errorMessage: 'Please select a doctor'
      });
      return false;
    }
    
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormStatus(prev => ({ ...prev, loading: true, success: false, error: false }));

    if (!validateForm()) {
      setShowNotification({
        show: true,
        type: 'error',
        message: 'Please fill all required fields correctly'
      });
      setFormStatus(prev => ({ ...prev, loading: false }));
      return;
    }

    try {
      const { data, error } = await supabase
        .from('appointments')
        .insert([
          {
            patient_name: formData.name,
            patient_email: formData.email,
            patient_phone: formData.phone,
            patient_dob: formData.dob,
            appointment_date: formData.appointmentDate,
            gender: formData.gender,
            department_id: formData.department,
            doctor_id: formData.doctor,
            message: formData.message
          }
        ]);

      if (error) throw error;

      setShowNotification({
        show: true,
        type: 'success',
        message: 'Appointment booked successfully!'
      });

      // Reset form
      setFormData({
        name: '',
        email: '',
        phone: '',
        dob: '',
        dobDisplay: '',
        appointmentDate: '',
        appointmentDateDisplay: '',
        gender: '',
        department: '',
        doctor: '',
        message: ''
      });
      
    } catch (error) {
      console.error('Error booking appointment:', error);
      setShowNotification({
        show: true,
        type: 'error',
        message: 'Failed to book appointment. Please try again.'
      });
      setFormStatus(prev => ({ ...prev, error: true, errorMessage: 'Failed to book appointment. Please try again.' }));
    } finally {
      setFormStatus(prev => ({ ...prev, loading: false }));
    }
  };

  // Add useEffect to handle notification timeout
  useEffect(() => {
    if (showNotification.show) {
      const timer = setTimeout(() => {
        setShowNotification(prev => ({ ...prev, show: false }));
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [showNotification.show]);

  return (
    <section className="appointment-section">
      <div className="appointment-container">
        <div className="section-title">
          <h2>Schedule Your Visit</h2>
          <p>Book an appointment with our experienced healthcare professionals and take the first step towards better health.</p>
        </div>

        <form className="appointment-form" onSubmit={handleSubmit}>
          <div className="form-grid">
            {/* Personal Information Section */}
            <div className="form-section personal-info">
              <h3>Personal Information</h3>
              <div className="form-group">
                <div className="input-icon">
                  <FaUserAlt className="icon" />
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    placeholder="Your Full Name"
                    required
                  />
                </div>
              </div>

              <div className="form-group">
                <div className="input-icon">
                  <MdEmail className="icon" />
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder="Email Address"
                    required
                  />
                </div>
              </div>

              <div className="form-group">
                <div className="input-icon">
                  <MdPhone className="icon" />
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    placeholder="Phone Number (10 digits)"
                    required
                    maxLength="10"
                    pattern="[0-9]{10}"
                  />
                </div>
                {formData.phone && formData.phone.length < 10 && (
                  <small className="input-hint">Enter a 10-digit phone number</small>
                )}
              </div>
            </div>

            {/* Date and Gender Section */}
            <div className="form-section date-gender">
              <h3>Date & Gender</h3>
              <div className="form-group">
                <div className="input-icon">
                  <MdCalendarToday className="icon" />
                  <input
                    type="date"
                    name="dob"
                    value={formData.dob}
                    onChange={handleDateInputChange}
                    required
                    max={maxDob}
                    className="date-field"
                  />
                  <label className="date-label">Date of Birth</label>
                </div>
              </div>

              <div className="form-group">
                <div className="input-icon">
                  <MdCalendarToday className="icon" />
                  <input
                    type="date"
                    name="appointmentDate"
                    value={formData.appointmentDate}
                    onChange={handleDateInputChange}
                    required
                    min={today}
                    max={maxAppointmentDate}
                    className="date-field"
                  />
                  <label className="date-label">Preferred Appointment Date</label>
                </div>
              </div>

              <div className="form-group gender-group">
                <label>Gender</label>
                <div className="radio-group">
                  <label>
                    <input
                      type="radio"
                      name="gender"
                      value="male"
                      checked={formData.gender === 'male'}
                      onChange={handleInputChange}
                      required
                    />
                    Male
                  </label>
                  <label>
                    <input
                      type="radio"
                      name="gender"
                      value="female"
                      checked={formData.gender === 'female'}
                      onChange={handleInputChange}
                    />
                    Female
                  </label>
                  <label>
                    <input
                      type="radio"
                      name="gender"
                      value="other"
                      checked={formData.gender === 'other'}
                      onChange={handleInputChange}
                    />
                    Other
                  </label>
                </div>
              </div>
            </div>

            {/* Department and Doctor Selection */}
            <div className="form-section department-selection">
              <h3>Medical Department</h3>
              <div className="form-group">
                <div className="input-icon">
                  <FaHospital className="icon" />
                  <select
                    name="department"
                    value={formData.department}
                    onChange={handleInputChange}
                    required
                  >
                    <option value="">Select Department</option>
                    {departments.map(dept => (
                      <option key={dept.id} value={dept.id}>
                        {dept.name} - {dept.description}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="form-group">
                <div className="input-icon">
                  <FaUserMd className="icon" />
                  <select
                    name="doctor"
                    value={formData.doctor}
                    onChange={handleInputChange}
                    required
                    disabled={!formData.department}
                  >
                    <option value="">Select Doctor</option>
                    {doctors.map(doctor => (
                      <option key={doctor.id} value={doctor.id}>
                        {doctor.name} - {doctor.specialization}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          </div>

          <div className="form-group message-group">
            <div className="input-icon">
              <MdMessage className="icon" style={{ top: '25px' }} />
              <textarea
                name="message"
                value={formData.message}
                onChange={handleInputChange}
                placeholder="Additional Notes or Special Requirements (Optional)"
                rows="4"
              ></textarea>
            </div>
          </div>

          {formStatus.error && (
            <div className="error-message">
              {formStatus.errorMessage}
            </div>
          )}

          <div className="form-submit">
            <button 
              type="submit" 
              disabled={formStatus.loading || formStatus.success}
              className={formStatus.success ? 'success' : ''}
            >
              {formStatus.loading ? (
                <>
                  <span className="spinner"></span> Booking...
                </>
              ) : formStatus.success ? (
                '✓ Appointment Booked!'
              ) : (
                'Book Appointment'
              )}
            </button>
          </div>
        </form>

        {/* Custom Notification */}
        {showNotification.show && (
          <div className={`custom-notification ${showNotification.type}`}>
            <div className="notification-content">
              {showNotification.type === 'success' ? (
                <FaCheckCircle className="notification-icon" />
              ) : (
                <FaTimesCircle className="notification-icon" />
              )}
              <span>{showNotification.message}</span>
            </div>
            <div className="notification-progress"></div>
          </div>
        )}
      </div>
    </section>
  );
};

export default Appointment;