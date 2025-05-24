import express from 'express';
const router = express.Router();
import { v4 as uuidv4 } from 'uuid';
import { supabaseAdmin, supabase } from '../supabaseClient.js'  // supabaseAdmin is your admin client

// Helper function to convert day name + time to a Date object of the next upcoming day
function getNextDateForDayTime(dayName, timeString) {
  const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const dayIndex = daysOfWeek.indexOf(dayName);
  if (dayIndex === -1) return null;

  let [time, meridian] = timeString.split(' ');
  let [hours, minutes] = time.split(':').map(Number);

  if (meridian.toLowerCase() === 'pm' && hours !== 12) hours += 12;
  if (meridian.toLowerCase() === 'am' && hours === 12) hours = 0;

  const now = new Date();
  let targetDate = new Date(now);
  targetDate.setHours(0, 0, 0, 0);

  let daysToAdd = (dayIndex + 7 - targetDate.getDay()) % 7;
  if (daysToAdd === 0) {
    const appointmentTimeToday = new Date(targetDate);
    appointmentTimeToday.setHours(hours, minutes, 0, 0);
    if (appointmentTimeToday <= now) daysToAdd = 7;
  }

  targetDate.setDate(targetDate.getDate() + daysToAdd);
  targetDate.setHours(hours, minutes, 0, 0);
  return targetDate;
}

router.post('/book-appointment', async (req, res) => {
  const { patient_id, doctor_id, selected_day, selected_time, appointment_type = 'consultation', reason = '' } = req.body;

  if (!patient_id || !doctor_id || !selected_day || !selected_time) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  const appointment_date = getNextDateForDayTime(selected_day, selected_time);
  if (!appointment_date) {
    return res.status(400).json({ error: "Invalid day or time format" });
  }

  try {
    // Check if the slot is already booked using regular client (RLS applies)
    const { data: existingAppointments, error: fetchError } = await supabase
      .from('appointments')
      .select('*')
      .eq('doctor_id', doctor_id)
      .eq('appointment_date', appointment_date.toISOString());

    if (fetchError) {
      console.error('Error fetching existing appointments:', fetchError);
      return res.status(500).json({ error: 'Error checking existing appointments' });
    }

    if (existingAppointments && existingAppointments.length > 0) {
      return res.status(409).json({ error: "This slot is already booked. Please choose another time." });
    }

    // Insert new appointment using admin client (bypass RLS)
    const newAppointment = {
      id: uuidv4(),
      patient_id,
      doctor_id,
      appointment_date: appointment_date.toISOString(),
      appointment_type,
      status: 'confirmed',
      reason,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      reminder_sent: false,
      reminder_sent_at: null,
    };

    const { data, error } = await supabaseAdmin.from('appointments').insert([newAppointment]);

    if (error) {
      console.error('Error booking appointment:', error);
      return res.status(500).json({ error: "Failed to book appointment", details: error.message });
    }

    // ✅ Add booking notification
    const { data: doctorData } = await supabaseAdmin
      .from("doctors")
      .select("name")
      .eq("id", doctor_id)
      .single();

    const doctorName = doctorData?.name || "the doctor";
    const notificationMessage = `✅ Your appointment with Dr. ${doctorName} is confirmed for ${selected_day} at ${selected_time}.`;

    await supabaseAdmin.from("notifications").insert([
      {
        user_id: patient_id,
        message: notificationMessage,
        type: "booking",
        created_at: new Date().toISOString(),
        read: false,
      },
    ]);

    res.json({ message: "Appointment booked successfully", appointment: newAppointment });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
});




router.get('/doctor-appointments/:doctorId', async (req, res) => {
  const { doctorId } = req.params;

  const { data, error } = await supabaseAdmin
    .from('appointments')
    .select(`
      appointment_date,
      reason,
      appointment_type,
      patient_id,
      patients ( name )
    `)
    .eq('doctor_id', doctorId)
    .order('appointment_date', { ascending: true });

  if (error) {
    console.error('Error fetching doctor appointments:', error);
    return res.status(500).json({ error: 'Failed to fetch appointments' });
  }

  // Format with day + time
  const formattedData = data.map((appointment) => {
    const date = new Date(appointment.appointment_date);
    const options = { weekday: 'long' };
    const day = date.toLocaleDateString('en-US', options);
    const time = date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
    });

    return {
      patient_name: appointment.patients.name,
      reason: appointment.reason,
      appointment_type: appointment.appointment_type,
      date: date.toISOString().split('T')[0],
      day,
      time,
    };
  });

  res.json({ appointments: formattedData });
});



export default router;
