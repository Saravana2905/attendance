const Attendance = require("../models/Attendance");
const students = require("../models/Student");

exports.markAttendance = async (req, res) => {
    try {
        const { rollno, status, date } = req.body;
        const student = await students.findOne({ rollno });
        if (!student) {
            return res.status(404).json({
                status: 404,
                success: false,
                message: "Student not found"
            });
        }
        const attendance = new Attendance({
            student: student._id,
            status,
            date
        });
        await attendance.save();
        res.status(201).json({
            status: 201,
            success: true,
            message: "Attendance marked successfully"
        });
    } catch (error) {
        res.status(500).json({
            status: 500,
            success: false,
            message: "Error marking attendance",
            error
        });
    }
};

exports.getAttendanceByDate = async (req, res) => {
    try {
        const { date } = req.query;
        const records = await Attendance.find({ date }).populate("student", "name rollno");
        res.status(200).json({
            status: 200,
            success: true,
            message: "Attendance records retrieved successfully",
            records
        });
    } catch (error) {
        res.status(500).json({
            status: 500,
            success: false,
            message: "Error retrieving attendance records",
            error
        });
    }
};

exports.clearAttendance = async (req, res) => {
    try {
        await Attendance.deleteMany({});
        res.status(200).json({
            status: 200,
            success: true,
            message: "All attendance records cleared"
        });
    } catch (error) {
        res.status(500).json({
            status: 500,
            success: false,
            message: "Error clearing attendance records",
            error
        });
    }
};
