const Attendance = require("../models/Attendance");
const students = require('../models/Student')

exports.markAttendance = async (req, res) => {
    try {
        const { rollno, status, date } = req.body;

        // Find the student based on rollno
        const student = await students.findOne({ rollno });
        if (!student) {
            return res.status(404).json({ message: "Student not found" });
        }

        // Create and save the attendance record
        const attendance = new Attendance({
            student: student._id,  // Use student's _id instead of rollno
            status,
            date  // Add date to the attendance record
        });
        await attendance.save();

        res.status(201).json({ message: "Attendance marked successfully" });
    } catch (error) {
        res.status(500).json({ message: "Error marking attendance", error });
    }
};

exports.getAttendanceByDate = async (req, res) => {
    try {
        const { date } = req.query;
        const records = await Attendance.find({ date }).populate('student', 'name rollno');
        res.json({ message: "Attendance records retrieved successfully", records });
    } catch (error) {
        res.status(500).json({ message: "Error retrieving attendance records", error });
    }
};

exports.clearAttendance = async (req, res) => {
    await Attendance.deleteMany({});
    res.json({ message: "All attendance records cleared" });
};
