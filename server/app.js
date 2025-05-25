import express from 'express';
import cors from 'cors';
import { supabaseAdmin } from './supabaseClient.js';
import patientRouter from './routes/patientRoutes.js';
import doctorRouter from './routes/doctorRoutes.js';
import appointmentRouter from './routes/appointmentRouter.js';



const app = express();
const port = 5000;


app.use(cors()); 
app.use(express.json());

// Debug middleware to log all requests
app.use((req, res, next) => {
    console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
    next();
});

const fetchDoctors = async () => {
  const { data, error } = await supabaseAdmin
    .from('doctors') 
    .select('*') 
    .eq('name', 'Nita'); // Example condition to fetch doctors

  if (error) {
    console.error("Error fetching doctors:", error); 
  } else { 
    console.log("Doctors data:", data);
  }
};

fetchDoctors();

// Mount routers
app.use('/patients', patientRouter);
app.use('/doctors', doctorRouter);
app.use('/',appointmentRouter);

// Home route
app.get('/',(req,res)=>{
    res.status(200).json({
        message:"Server is running",
        data:"hello"
    }); 
});

// 404 handler - Keep this as the last route
app.use((req,res)=>{
    console.log('404 - Route not found:', req.method, req.url);
    res.status(404).json({
        message:"Route not found"
    });
});

app.listen(port,()=>{
    console.log(`Server is running on port ${port}`);

});