import express from 'express';
import cors from 'cors';
import { supabase } from './supabaseClient.js';

const app=express();

app.use(cors());
app.use(express.json());


async function getData() {
  const { data, error } = await supabase
    .from('patients')
    .select('*');

  if (error) {
    console.error('Error:', error);
  } else {
    console.log('Data:', data);
  }
}

getData();