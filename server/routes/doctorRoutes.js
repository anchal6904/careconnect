import express from 'express';
const router = express.Router();

import { supabaseAdmin,supabase } from '../supabaseClient.js';


// Get doctor availability
router.get('/doctor/:id/availability', async (req, res) => {
  const id = req.params.id;

  try {
    const { data, error } = await supabase
      .from('doctors')
      .select('available_days, available_hours')
      .eq('id', id)
      .single();

    if (error || !data) {
      return res.status(404).json({ error: "Doctor not found" });
    }

    // Convert string to array
    const available_days = data.available_days ? data.available_days.split(',') : [];
    const available_hours = data.available_hours ? data.available_hours.split(',') : [];

    if (available_days.length === 0 || available_hours.length === 0) {
      return res.status(404).json({ error: "Doctor not found or no availability data" });
    }

    res.json({
      available_days,
      available_hours,
    });
  } catch (error) {
    console.error('Error fetching doctor availability:', error);
    res.status(500).json({ error: "Internal server error" });
  }
});


router.post('/signupDoctor', async (req, res) => {
  try {
    const {
      name,
      email,
      password,
      confirm_password,
      qualifications,
      specialty,
      experience,
      phone_number,
    } = req.body;

    // Basic validation
    if (
      !name ||
      !email ||
      !password ||
      !confirm_password ||
      !qualifications ||
      !specialty
    ) {
      return res.status(400).json({ success: false, message: "All required fields must be filled" });
    }

    if (password !== confirm_password) {
      return res.status(400).json({ success: false, message: "Passwords do not match" });
    }

    // Create Supabase auth user with metadata (store email, phone, password only here)
    const { data: authData, error: authError } = await supabaseAdmin.auth.admin.createUser({
      email: email.toLowerCase(),
      password,
      email_confirm: true,
      user_metadata: {
        name,
        user_type: "doctor",
        phone_number,  // phone number stored here, NOT in doctors table
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

    // Prepare doctor profile data WITHOUT email, phone_number, password
    const doctorData = {
      id: authData.user.id,
      name,
      specialty,
      experience: experience || 0,
      qualification: qualifications,
      bio: "",
      consultation_fee: 0,
      rating: 0,
      available_days: null,
      available_hours: null,
      avatar_url: null,
      location_link: null,
      onboarding_complete: false,
      is_visible: false,
      created_at: new Date(),
      updated_at: new Date(),
    };

    console.log("Inserting doctor record:", doctorData);

    // Insert doctor profile data into doctors table
    const { error: doctorError } = await supabaseAdmin
      .from("doctors")
      .insert(doctorData);

    if (doctorError) {
      console.error("Doctor creation error:", doctorError);

      // Clean up auth user if profile creation fails
      try {
        await supabaseAdmin.auth.admin.deleteUser(authData.user.id);
        console.log("Deleted auth user after doctor creation failed");
      } catch (deleteError) {
        console.error("Error deleting auth user:", deleteError);
      }

      return res.status(400).json({
        success: false,
        message: doctorError.message || "Failed to create doctor profile",
      });
    }

    // Success response (email still available from Auth)
    return res.status(201).json({
      success: true,
      message: "Doctor registered successfully",
      user: {
        id: authData.user.id,
        email: authData.user.email,
        user_type: "doctor",
      },
    });
  } catch (error) {
    console.error("Error registering doctor:", error);
    return res.status(500).json({
      success: false,
      message: error.message || "Server error",
    });
  }
});


router.post('/loginDoctor', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Basic validation
    if (!email || !password) {
      return res.status(400).json({ success: false, message: "Email and password are required" });
    }

    // Sign in doctor using Supabase Auth
    const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
      email: email.toLowerCase(),
      password,
    });

    if (signInError) {
      console.error("Login error:", signInError);
      return res.status(401).json({ success: false, message: "Invalid email or password" });
    }

    const { user, session } = signInData;

    // Optional: Check if user_type is "doctor" from user_metadata
    if (user?.user_metadata?.user_type !== "doctor") {
      return res.status(403).json({ success: false, message: "Access denied: not a doctor account" });
    }

    // Success response
    return res.status(200).json({
      success: true,
      message: "Doctor logged in successfully",
      user: {
        id: user.id,
        email: user.email,
        user_type: user.user_metadata.user_type,
      },
      token: session.access_token,
    });
  } catch (error) {
    console.error("Login exception:", error);
    return res.status(500).json({ success: false, message: "Server error" });
  }
});

router.post("/logout", async (req, res) => {
    //common for both patient and doctor
  try {
    const { error } = await supabase.auth.signOut();

    if (error) {
      return res.status(400).json({ success: false, message: error.message });
    }

    return res
      .status(200)
      .json({ success: true, message: "Logout successful" });
  } catch (error) {
    console.error("Error logging out:", error);
    return res.status(500).json({ success: false, message: "Server error" });
  }
});

import axios from 'axios';

router.put('/updateDoctorProfile/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = {};

    // Extract fields from request body
    const {
      consultation_fee,
      available_days,
      available_hours,
      avatar_url,
      location_link,
      bio,
    } = req.body;

    // Only include fields that are provided in the update
    if (consultation_fee !== undefined) updateData.consultation_fee = consultation_fee;
    if (available_days !== undefined) updateData.available_days = available_days;
    if (available_hours !== undefined) updateData.available_hours = available_hours;
    if (avatar_url !== undefined) updateData.avatar_url = avatar_url;
    if (bio !== undefined) updateData.bio = bio;

    // If location is being updated, try to geocode it
    if (location_link !== undefined) {
      updateData.location_link = location_link;
      
      try {
        const geoResponse = await axios.get(
          `https://api.opencagedata.com/geocode/v1/json`,
          {
            params: {
              q: location_link,
              key: "2dd092ec7de04b3eb21d6d4f067befa8", // Use environment variable
            },
          }
        );

        const geoData = geoResponse.data;

        if (geoData.results.length > 0) {
          updateData.latitude = geoData.results[0].geometry.lat;
          updateData.longitude = geoData.results[0].geometry.lng;
        }
      } catch (geoError) {
        console.error('Geocoding failed:', geoError.message);
        // Continue with update even if geocoding fails
      }
    }

    // Add updated timestamp
    updateData.updated_at = new Date();

    // Check if this is a complete profile update
    const isCompleteProfile = 
      consultation_fee !== undefined &&
      available_days !== undefined &&
      available_hours !== undefined &&
      avatar_url !== undefined &&
      location_link !== undefined &&
      bio !== undefined;

    if (isCompleteProfile) {
      updateData.onboarding_complete = true;
      updateData.is_visible = true;
    }

    // Update the doctor profile
    const { error } = await supabaseAdmin
      .from("doctors")
      .update(updateData)
      .eq("id", id);

    if (error) {
      console.error("Error updating doctor profile:", error);
      return res.status(400).json({
        success: false,
        message: error.message || "Failed to update doctor profile",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Doctor profile updated successfully",
      data: updateData
    });

  } catch (error) {
    console.error("Server error:", error);
    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
});


// Get all doctors
router.get('/fetchDoctors', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('doctors')
      .select('*');

    if (error) {
      return res.status(500).json({ success: false, message: 'Error fetching doctors', error });
    }

    return res.status(200).json({ success: true, data });
  } catch (error) {
    console.error('Error:', error);
    return res.status(500).json({ success: false, message: 'Server error' });
  }
});

export default router;
