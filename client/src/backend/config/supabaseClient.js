import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://bbnlvkafbfecjiiwjnjv.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJibmx2a2FmYmZlY2ppaXdqbmp2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDc4OTk5NTYsImV4cCI6MjA2MzQ3NTk1Nn0.T9mqfZbQGfHHrZzYdAZCkVt5AXWCIwWFy46NJUfjHwM'

export const supabase = createClient(supabaseUrl, supabaseKey);
