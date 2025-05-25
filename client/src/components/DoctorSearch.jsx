import React, { useState, useEffect } from 'react';
import axios from 'axios';

const DoctorSearch = () => {
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        const response = await axios.get('http://localhost:5000/doctors/fetchDoctors');
        if (response.data.success) {
          setDoctors(response.data.data);
        } else {
          setError('Failed to fetch doctors');
        }
      } catch (err) {
        setError(err.message || 'Error fetching doctors');
      } finally {
        setLoading(false);
      }
    };

    fetchDoctors();
  }, []);

  if (loading) {
    return <div className="text-center p-4">Loading doctors...</div>;
  }

  if (error) {
    return <div className="text-red-500 text-center p-4">{error}</div>;
  }

  return (
    <div className="container mx-auto p-4">
      <h2 className="text-2xl font-bold mb-4">Available Doctors</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {doctors.map((doctor) => (
          <div key={doctor.id} className="bg-white rounded-lg shadow-md p-4">
            <h3 className="text-xl font-semibold">{doctor.name}</h3>
            <p className="text-gray-600">{doctor.specialty}</p>
            <div className="mt-2">
              <p>Experience: {doctor.experience} years</p>
              <p>Rating: {doctor.rating}/5</p>
              <p>Consultation Fee: ₹{doctor.consultation_fee}</p>
            </div>
          </div>
        ))}
      </div>
      {doctors.length === 0 && (
        <p className="text-center text-gray-500">No doctors available at the moment.</p>
      )}
    </div>
  );
};

export default DoctorSearch; 