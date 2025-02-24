const express = require('express');
const app = express.Router();
const { createTeacher, teacherLogin, getTeachers } = require('../controllers/teacherController');

app.post('/createTeacher', createTeacher);
app.get('/getTeacher', getTeachers);
app.post('/loginTeacher', teacherLogin);

module.exports = app;