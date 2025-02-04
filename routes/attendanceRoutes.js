const express = require("express");
const app = express.Router();
const { markAttendance, getAttendanceByDate, clearAttendance } = require('../controllers/attendanceController');

app.post('/markAttendance', markAttendance);
app.get('/getAttendanceByDate', getAttendanceByDate);
app.delete('/clearAttendance', clearAttendance);

module.exports = app;