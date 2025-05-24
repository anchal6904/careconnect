import express from 'express';
const router=express.Router();

import { supabaseAdmin,supabase } from '../supabaseClient.js';


router.post('/signup', async (req, res) => {
  try {
    const { name, email, password, confirm_password } = req.body;

    // Validation
    if (!name || !email || !password || !confirm_password) {
      return res.status(400).json({ success: false, message: "All fields are required" });
    }

    if (password !== confirm_password) {
      return res.status(400).json({ success: false, message: "Passwords do not match" });
    }

    // Create user using Supabase Admin API
    const { data: authData, error: authError } = await supabaseAdmin.auth.admin.createUser({
      email: email.toLowerCase(),
      password,
      email_confirm: true,
      user_metadata: {
        name,
        user_type: "patient",
      },
    });

    if (authError) {
      console.error("Auth error:", authError);

      if (
        authError.message &&
        (authError.message.includes("already been registered") || authError.message.includes("already exists"))
      ) {
        return res.status(400).json({ success: false, message: "Email is already registered" });
      }

      return res.status(400).json({ success: false, message: authError.message });
    }

    if (!authData || !authData.user) {
      return res.status(500).json({ success: false, message: "Failed to create user account" });
    }

    // Insert profile data into patients table
    const { error: profileError } = await supabaseAdmin
      .from('patients')
      .insert({
        id: authData.user.id,
        name,
        email: email.toLowerCase(),
        phone_number: null,
        gender: null,
        date_of_birth: null,
        blood_group: null,
        address: null,
        emergency_contact_name: null,
        emergency_contact_phone: null,
        created_at: new Date(),
        updated_at: new Date(),
      });

    if (profileError) {
      console.error("Patient profile creation error:", profileError);

      // Clean up: delete auth user if profile creation fails
      try {
        await supabaseAdmin.auth.admin.deleteUser(authData.user.id);
      } catch (deleteError) {
        console.error("Error deleting auth user:", deleteError);
      }

      return res.status(400).json({ success: false, message: profileError.message || "Failed to create patient profile" });
    }

    // Success response
    return res.status(201).json({
      success: true,
      message: "Patient registered successfully",
      user: {
        id: authData.user.id,
        email: authData.user.email,
        user_type: "patient",
      },
    });

  } catch (error) {
    console.error("Error registering patient:", error);
    return res.status(500).json({ success: false, message: error.message || "Server error" });
  }
});


router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  // Sign in using Supabase Auth
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    return res.status(401).json({ message: error.message || 'Invalid credentials' });
  }

  const user = data.user;

  // ✅ Check user_type from Supabase Auth metadata
  if (user.user_metadata?.user_type !== 'patient') {
    return res.status(403).json({ message: 'Unauthorized user type' });
  }

  // Fetch profile data from patients table
  const { data: patientProfile, error: profileError } = await supabase
    .from('patients')
    .select('id, name, email')
    .eq('id', user.id)
    .single();

  if (profileError) {
    return res.status(500).json({ message: 'Error fetching patient profile' });
  }

  // Respond with session and profile
  res.status(200).json({
    message: 'Login successful',
    session: data.session, // includes access_token, refresh_token
    patient: {
      ...patientProfile,
      user_type: user.user_metadata.user_type // add user_type in response if needed
    }
  });
});


// backend route: /findNearbyDoctors?lat=28.61&lng=77.23

router.get('/findNearbyDoctors', async (req, res) => {
  try {
    const { lat, lng } = req.query;

    if (!lat || !lng) {
      return res.status(400).json({
        success: false,
        message: 'Latitude and longitude are required',
      });
    }

    const { data: doctors, error } = await supabaseAdmin
      .from('doctors')
      .select('*')
      .eq('is_visible', true);

    if (error) {
      return res.status(500).json({ success: false, message: error.message });
    }

    const toRad = (value) => (value * Math.PI) / 180;

    const calculateDistance = (lat1, lon1, lat2, lon2) => {
      const R = 6371; // Radius of Earth in km
      const dLat = toRad(lat2 - lat1);
      const dLon = toRad(lon2 - lon1);
      const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(toRad(lat1)) *
          Math.cos(toRad(lat2)) *
          Math.sin(dLon / 2) *
          Math.sin(dLon / 2);
      const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
      return R * c;
    };

    const doctorsWithDistance = doctors
      .map((doc) => ({
        ...doc,
        distance: calculateDistance(lat, lng, doc.latitude, doc.longitude),
      }))
      .sort((a, b) => a.distance - b.distance); // sort by distance

    return res.status(200).json({
      success: true,
      data: doctorsWithDistance,
    });
  } catch (err) {
    console.error('Error fetching nearby doctors:', err);
    return res.status(500).json({
      success: false,
      message: 'Server error',
    });
  }
});


export default router;
