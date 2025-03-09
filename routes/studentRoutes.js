const express = require("express");
const { createStudent, getStudentByRollNo, getStudentsByClass } = require("../controllers/studentController");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

router.post('/create', createStudent);
router.get('/rollno/:rollno', getStudentByRollNo);
router.get('/class/:classId', getStudentsByClass);

// router.post("/create", authMiddleware, createStudent);
// router.get("/rollno/:rollno", authMiddleware, getStudentByRollNo);  // Get student by roll number

module.exports = router;
