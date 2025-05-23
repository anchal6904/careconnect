// src/supabaseClient.js
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://bbnlvkafbfecjiiwjnjv.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJibmx2a2FmYmZlY2ppaXdqbmp2Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc0Nzg5OTk1NiwiZXhwIjoyMDYzNDc1OTU2fQ.nsZYGk0Mkc2HbkVNBOfZGnGS7YzOa7nSUWtPFoKoP5w'

export const supabase = createClient(supabaseUrl, supabaseKey)
