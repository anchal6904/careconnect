// src/supabaseClient.js
import { createClient } from '@supabase/supabase-js'

const supabaseAdmin = createClient(
  'https://bbnlvkafbfecjiiwjnjv.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJibmx2a2FmYmZlY2ppaXdqbmp2Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc0Nzg5OTk1NiwiZXhwIjoyMDYzNDc1OTU2fQ.nsZYGk0Mkc2HbkVNBOfZGnGS7YzOa7nSUWtPFoKoP5w' // Ye aapka secret service role key hoga
);

const supabase = createClient(
  'https://bbnlvkafbfecjiiwjnjv.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJibmx2a2FmYmZlY2ppaXdqbmp2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDc4OTk5NTYsImV4cCI6MjA2MzQ3NTk1Nn0.T9mqfZbQGfHHrZzYdAZCkVt5AXWCIwWFy46NJUfjHwM'
);

export {supabase, supabaseAdmin };
