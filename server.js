const express = require('express');
const connectDB = require('./config/db');
const cors = require('cors');
const adminRoutes = require('./routes/adminRoutes');
const teacherRoutes = require('./routes/teacherRoutes');
const studentRoutes = require('./routes/studentRoutes');
const attendanceRoutes = require('./routes/attendanceRoutes');

require('dotenv').config();

const app = express();


// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

//test route
app.get('/', (req, res) => {
    res.send('Hello World \n connected to the server');
});

// Routes
app.use('/api/admin', adminRoutes);
app.use('/api/teacher', teacherRoutes);
app.use('/api/student', studentRoutes);
app.use('/api/attendance', attendanceRoutes);

// Start server
const PORT = process.env.PORT;
app.listen(PORT, () =>{
    // Database connection
connectDB().then(() => console.log('Database connected'));
console.log(`Server running on port ${PORT}`);
} );
