import express from 'express';
import cors from 'cors';
import { supabaseAdmin } from './supabaseClient.js';
import patientRouter from './routes/patientRoutes.js';
import doctorRouter from './routes/doctorRoutes.js';



const app = express();
const port = 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Test database connection
// app.get('/test-db', async (req, res) => {
//     try {
//         const { data, error } = await supabase
//             .from('patients')
//             .select('*')
//             .limit(5);

//         if (error) throw error;

//         res.status(200).json({
//             success: true,
//             data: data
//         });
//     } catch (error) {
//         res.status(500).json({
//             success: false,
//             error: error.message
//         });
//     }
// });

// const fetchDoctors = async () => {
//   const { data, error } = await supabaseAdmin
//     .from('doctors')
//     .select('*');

//   if (error) {
//     console.error("Error fetching doctors:", error);
//   } else {
//     console.log("Doctors data:", data);
//   }
// };

// fetchDoctors();

app.use('/patients',patientRouter);
app.use('/doctors',doctorRouter)

// Home route
app.get('/',(req,res)=>{
    res.status(200).json({
        message:"Server is running",
        data:"hello"
    })
});

// 404 handler - Keep this as the last route
app.get('*',(req,res)=>{
    res.status(404).json({
        message:"No page found"
    })
});

app.listen(port,()=>{
    console.log(`Server is running on port ${port}`);
});