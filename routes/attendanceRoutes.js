const express = require("express");
const app = express.Router();
const { markAttendance, getAttendanceByDate, clearAttendance, getAttendanceByclass, getAttendanceByclassAndHour } = require('../controllers/attendanceController');

app.post('/markAttendance', markAttendance);
app.get('/getAttendanceByDate', getAttendanceByDate);
app.delete('/clearAttendance', clearAttendance);
app.get('/getAttendanceByClass/:className', getAttendanceByclass);  
app.get('/getAttendanceByClass/:className/:hour', getAttendanceByclassAndHour);  

module.exports = app;