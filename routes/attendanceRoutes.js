const express = require("express");
const app = express.Router();
const { markAttendance, getAttendanceByDate, clearAttendance, getAttendanceByclass, getAttendanceByclassAndHour, getAttendanceByclassAndHourAndDate, markAttendanceClassWise, getAttendanceByDateAndHour } = require('../controllers/attendanceController');

app.post('/markAttendance', markAttendance);
app.get('/getAttendanceByDate', getAttendanceByDate);
app.delete('/clearAttendance', clearAttendance);
app.get('/getAttendanceByClass/:className', getAttendanceByclass);  
app.get('/getAttendanceByClass/:className/:hour', getAttendanceByclassAndHour); 
app.get('/getAttendanceByClass/:className/:hour/:date', getAttendanceByclassAndHourAndDate);
app.post('/markAttendanceClass', markAttendanceClassWise);
app.get('/getAttendanceByDateAndHour/:date/:hour', getAttendanceByDateAndHour);
app.get('/getAttendanceByClassHourAndDate/:classId/:hour/:date', getAttendanceByclassAndHourAndDate);

module.exports = app;