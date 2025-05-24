import { supabase } from '../supabaseClient.js';

router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    return res.status(401).json({ message: error.message || 'Invalid credentials' });
  }

  const user = data.user;

  // You can fetch profile if needed
  const { data: patientProfile, error: profileError } = await supabase
    .from('patients')
    .select('id, name, email')
    .eq('id', user.id)
    .single();

  if (profileError) {
    return res.status(500).json({ message: 'Error fetching patient profile' });
  }

  res.status(200).json({
    message: 'Login successful',
    session: data.session, // contains access_token, refresh_token etc.
    patient: patientProfile
  });
});
