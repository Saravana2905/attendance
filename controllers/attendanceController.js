const Attendance = require("../models/Attendance");
const students = require("../models/Student");
const Class = require('../models/Class.js')

exports.markAttendance = async (req, res) => {
    try {
        const { rollno, att_status, date, hour } = req.body;
        const student = await students.findOne({ rollno });
        if (!student) {
            return res.status(404).json({
                status: 404,
                success: false,
                message: "Student not found"
            });
        }
        
        // Validate the date
        const parsedDate = new Date(date);
        if (isNaN(parsedDate.getTime())) {
            return res.status(400).json({
                status: 400,
                success: false,
                message: "Invalid date value provided"
            });
        }
        
        const attendance = new Attendance({
            student: student._id,
            att_status,
            hour,
            date: parsedDate
        });
        await attendance.save();
        res.status(201).json({
            status: 201,
            success: true,
            message: "Attendance marked successfully"
        });
    } catch (error) {
        console.log('error-->', error);
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
        const records = await Attendance.find({ date }).populate("student", "name rollno att_status hour");
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

exports.getAttendanceByclass = async (req, res) => {
    try {
        const { className } = req.params;
        console.log('classname-->', className);
        const studentClass = await Class.findOne({ className });
        if (!studentClass) {
            return res.status(404).json({
                status: 404,
                success: false,
                message: "Class not found"
            });
        }
        const Astudents = await students.find({ class: studentClass._id });
        const studentIds = Astudents.map(sstudent => sstudent._id);
        const records = await Attendance.find({ student: { $in: studentIds } }).populate("student", "name rollno att_status hour");
        res.status(200).json({
            status: 200,
            success: true,
            message: "Attendance records retrieved successfully",
            records
        });
    }
    catch (error) {
        console.log('error-->', error);
        res.status(500).json({
            status: 500,
            success: false,
            message: "Error retrieving attendance records",
            error
        });
    }
};

exports.getAttendanceByclassAndHour = async (req, res) => {
    try {
        const { className, hour } = req.params;
        console.log('className-->', className, 'hour-->', hour);

        // Find the class by className
        const studentClass = await Class.findOne({ className });
        if (!studentClass) {
            return res.status(404).json({
                status: 404,
                success: false,
                message: "Class not found"
            });
        }

        // Find students enrolled in the class
        const Astudents = await students.find({ class: studentClass._id });
        const studentIds = Astudents.map(sstudent => sstudent._id);

        // Find attendance records for these students that match the specified hour
        const records = await Attendance.find({ 
            student: { $in: studentIds },
            hour: hour 
        }).populate("student", "name rollno att_status hour");

        res.status(200).json({
            status: 200,
            success: true,
            message: "Attendance records retrieved successfully",
            records
        });
    } catch (error) {
        console.log('error-->', error);
        res.status(500).json({
            status: 500,
            success: false,
            message: "Error retrieving attendance records",
            error
        });
    }
};