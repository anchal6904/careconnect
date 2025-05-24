import express from 'express';
const router = express.Router();

import { supabaseAdmin,supabase } from '../supabaseClient.js';

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

export default router;
