// Doctors Data
export const doctors = [
  {
    id: 1,
    name: "Dr. Sarah Johnson",
    specialization: "Cardiology",
    experience: "15 years",
    education: "MD, Cardiology",
    hospital: "City General Hospital",
    rating: 4.8,
    patients: [1, 2, 3, 4, 5],
    image: "https://randomuser.me/api/portraits/women/1.jpg"
  },
  {
    id: 2,
    name: "Dr. Michael Chen",
    specialization: "Neurology",
    experience: "12 years",
    education: "MD, Neurology",
    hospital: "Central Medical Center",
    rating: 4.7,
    patients: [1, 2, 3],
    image: "https://randomuser.me/api/portraits/men/2.jpg"
  },
  {
    id: 3,
    name: "Dr. Emily Brown",
    specialization: "Pediatrics",
    experience: "10 years",
    education: "MD, Pediatrics",
    hospital: "Children's Hospital",
    rating: 4.9,
    patients: [1, 4, 5],
    image: "https://randomuser.me/api/portraits/women/3.jpg"
  },
  {
    id: 4,
    name: "Dr. James Wilson",
    specialization: "Orthopedics",
    experience: "14 years",
    education: "MD, Orthopedics",
    hospital: "Sports Medicine Center",
    rating: 4.6,
    patients: [2, 3, 5],
    image: "https://randomuser.me/api/portraits/men/4.jpg"
  },
  {
    id: 5,
    name: "Dr. Lisa Martinez",
    specialization: "Dermatology",
    experience: "8 years",
    education: "MD, Dermatology",
    hospital: "Skin Care Clinic",
    rating: 4.7,
    patients: [1, 3, 4],
    image: "https://randomuser.me/api/portraits/women/5.jpg"
  }
];

// Patients Data
export const patients = [
  {
    id: 1,
    name: "John Smith",
    age: 45,
    gender: "Male",
    bloodGroup: "O+",
    contact: "+1 234-567-8901",
    email: "john.smith@email.com",
    address: "123 Main St, City",
    medicalHistory: [
      {
        condition: "Hypertension",
        diagnosed: "2020-01-15",
        status: "Under Control"
      },
      {
        condition: "Type 2 Diabetes",
        diagnosed: "2019-06-20",
        status: "Under Control"
      }
    ],
    doctors: [1, 2, 3, 5],
    lastVisit: "2024-02-15"
  },
  {
    id: 2,
    name: "Emma Davis",
    age: 32,
    gender: "Female",
    bloodGroup: "A+",
    contact: "+1 234-567-8902",
    email: "emma.davis@email.com",
    address: "456 Oak St, City",
    medicalHistory: [
      {
        condition: "Asthma",
        diagnosed: "2018-03-10",
        status: "Under Control"
      }
    ],
    doctors: [1, 2, 4],
    lastVisit: "2024-02-10"
  },
  {
    id: 3,
    name: "Robert Johnson",
    age: 55,
    gender: "Male",
    bloodGroup: "B+",
    contact: "+1 234-567-8903",
    email: "robert.johnson@email.com",
    address: "789 Pine St, City",
    medicalHistory: [
      {
        condition: "Arthritis",
        diagnosed: "2021-04-05",
        status: "Under Treatment"
      }
    ],
    doctors: [1, 2, 4, 5],
    lastVisit: "2024-02-05"
  },
  {
    id: 4,
    name: "Sophia Brown",
    age: 28,
    gender: "Female",
    bloodGroup: "AB+",
    contact: "+1 234-567-8904",
    email: "sophia.brown@email.com",
    address: "321 Elm St, City",
    medicalHistory: [
      {
        condition: "Migraine",
        diagnosed: "2022-07-15",
        status: "Under Treatment"
      }
    ],
    doctors: [1, 3, 5],
    lastVisit: "2024-02-01"
  },
  {
    id: 5,
    name: "David Wilson",
    age: 40,
    gender: "Male",
    bloodGroup: "O-",
    contact: "+1 234-567-8905",
    email: "david.wilson@email.com",
    address: "654 Maple St, City",
    medicalHistory: [
      {
        condition: "High Cholesterol",
        diagnosed: "2023-01-20",
        status: "Under Control"
      }
    ],
    doctors: [1, 3, 4],
    lastVisit: "2024-01-25"
  }
];

// Appointments Data
export const appointments = [
  {
    id: 1,
    patientId: 1,
    doctorId: 1,
    patientName: "John Smith",
    doctorName: "Dr. Sarah Johnson",
    date: "2024-03-01",
    time: "09:00 AM",
    reason: "Regular checkup",
    status: "Scheduled",
    type: "In-person"
  },
  {
    id: 2,
    patientId: 2,
    doctorId: 1,
    patientName: "Emma Davis",
    doctorName: "Dr. Sarah Johnson",
    date: "2024-03-01",
    time: "10:30 AM",
    reason: "Follow-up consultation",
    status: "Scheduled",
    type: "In-person"
  },
  {
    id: 3,
    patientId: 3,
    doctorId: 1,
    patientName: "Robert Johnson",
    doctorName: "Dr. Sarah Johnson",
    date: "2024-03-02",
    time: "02:00 PM",
    reason: "Cardiac evaluation",
    status: "Scheduled",
    type: "In-person"
  },
  {
    id: 4,
    patientId: 4,
    doctorId: 1,
    patientName: "Sophia Brown",
    doctorName: "Dr. Sarah Johnson",
    date: "2024-03-02",
    time: "03:30 PM",
    reason: "Blood pressure check",
    status: "Scheduled",
    type: "In-person"
  },
  {
    id: 5,
    patientId: 5,
    doctorId: 1,
    patientName: "David Wilson",
    doctorName: "Dr. Sarah Johnson",
    date: "2024-03-03",
    time: "11:00 AM",
    reason: "Regular checkup",
    status: "Scheduled",
    type: "In-person"
  },
  {
    id: 6,
    patientId: 1,
    doctorId: 2,
    patientName: "John Smith",
    doctorName: "Dr. Michael Chen",
    date: "2024-03-04",
    time: "09:30 AM",
    reason: "Neurological consultation",
    status: "Scheduled",
    type: "In-person"
  },
  {
    id: 7,
    patientId: 1,
    doctorId: 3,
    patientName: "John Smith",
    doctorName: "Dr. Emily Brown",
    date: "2024-02-15",
    time: "10:00 AM",
    reason: "General checkup",
    status: "Completed",
    type: "In-person"
  },
  {
    id: 8,
    patientId: 1,
    doctorId: 5,
    patientName: "John Smith",
    doctorName: "Dr. Lisa Martinez",
    date: "2024-02-20",
    time: "02:30 PM",
    reason: "Skin condition check",
    status: "Completed",
    type: "In-person"
  },
  {
    id: 9,
    patientId: 1,
    doctorId: 1,
    patientName: "John Smith",
    doctorName: "Dr. Sarah Johnson",
    date: "2024-02-25",
    time: "11:30 AM",
    reason: "Cardiac follow-up",
    status: "Cancelled",
    type: "In-person"
  }
];

// Prescriptions Data
export const prescriptions = [
  {
    id: 1,
    patientId: 1,
    doctorId: 1,
    patientName: "John Smith",
    doctorName: "Dr. Sarah Johnson",
    date: "2024-02-15",
    medications: [
      {
        name: "Lisinopril",
        dosage: "10mg",
        frequency: "Once daily",
        duration: "30 days"
      },
      {
        name: "Metformin",
        dosage: "500mg",
        frequency: "Twice daily",
        duration: "30 days"
      }
    ],
    notes: "Take medications with meals. Monitor blood pressure daily."
  },
  {
    id: 2,
    patientId: 1,
    doctorId: 2,
    patientName: "John Smith",
    doctorName: "Dr. Michael Chen",
    date: "2024-02-20",
    medications: [
      {
        name: "Gabapentin",
        dosage: "300mg",
        frequency: "Three times daily",
        duration: "14 days"
      }
    ],
    notes: "Take as prescribed for nerve pain management."
  },
  {
    id: 3,
    patientId: 1,
    doctorId: 5,
    patientName: "John Smith",
    doctorName: "Dr. Lisa Martinez",
    date: "2024-02-25",
    medications: [
      {
        name: "Clobetasol",
        dosage: "0.05%",
        frequency: "Apply twice daily",
        duration: "14 days"
      }
    ],
    notes: "Apply to affected areas only. Avoid contact with eyes."
  }
];

// Notifications Data
export const notifications = [
  {
    id: 1,
    message: "New appointment scheduled for March 1st, 2024",
    time: "2 hours ago",
    read: false,
    type: "appointment"
  },
  {
    id: 2,
    message: "Your prescription has been updated",
    time: "1 day ago",
    read: false,
    type: "prescription"
  },
  {
    id: 3,
    message: "Lab results are now available",
    time: "2 days ago",
    read: true,
    type: "lab"
  },
  {
    id: 4,
    message: "Appointment reminder: Tomorrow at 9:00 AM",
    time: "3 days ago",
    read: true,
    type: "reminder"
  }
]; 