import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://uvyzikaydcswkzyeypxx.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InV2eXppa2F5ZGNzd2t6eWV5cHh4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDc2NDkwNjcsImV4cCI6MjA2MzIyNTA2N30.wSJQhz3sZbh-RR8gVu2tvLH_5qezwULeEVqQCT8ls5E'; // Found in Supabase > Project Settings > API

export const supabase = createClient(supabaseUrl, supabaseKey);
