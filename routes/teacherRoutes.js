const express = require('express');
const app = express.Router();
const { createTeacher, teacherLogin } = require('../controllers/teacherController');

app.post('/createTeacher', createTeacher);
app.post('/loginTeacher', teacherLogin);

module.exports = app;