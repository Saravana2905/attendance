const Attendance = require("../models/Attendance");
const students = require("../models/Student");
const Class = require('../models/Class.js')

exports.markAttendance = async (req, res) => {
    try {
        const { rollno, att_status, date, hour } = req.body;
        console.log('rollno-->', rollno, 'att_status-->', att_status, 'date-->', date, 'hour-->', hour);
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

exports.getAttendanceByclassAndHourAndDate = async (req, res) => {
    try {
        const { classId, hour, date } = req.params;
        console.log('classId-->', classId, 'hour-->', hour, 'date-->', date);

        // Find the class by classId
        const studentClass = await Class.findById(classId);
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

        // Find attendance records for these students that match the specified hour and date
        const records = await Attendance.find({ 
            student: { $in: studentIds },
            hour: hour,
            date: new Date(date)
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

exports.markAttendanceClassWise = async (req, res) => {
    try {
        const { date, hour, students: studentList } = req.body;
        console.log('date-->', date, 'hour-->', hour, 'students-->', studentList);

        // Validate the date
        const parsedDate = new Date(date);
        if (isNaN(parsedDate.getTime())) {
            return res.status(400).json({
                status: 400,
                success: false,
                message: "Invalid date value provided"
            });
        }

        // Find students based on the provided roll numbers
        const rollNumbers = studentList.map(student => student.rollno);
        const classStudents = await students.find({ rollno: { $in: rollNumbers } });

        if (!classStudents.length) {
            return res.status(404).json({
                status: 404,
                success: false,
                message: "Students not found"
            });
        }

        // Create attendance records for each student based on the provided roll numbers and statuses
        let attendance = [];
        studentList.forEach(student => {
            const classStudent = classStudents.find(s => s.rollno === student.rollno);
            if (classStudent) {
                attendance.push({
                    student: classStudent._id,
                    att_status: student.att_status,
                    hour,
                    date: parsedDate
                });
            }
        });

        // Insert attendance records
        await Attendance.insertMany(attendance);

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

exports.getAttendanceByDateAndHour = async (req, res) => {
    try {
        const { date, hour } = req.params;
        console.log('date-->', date, 'hour-->', hour);

        // Validate the date
        const parsedDate = new Date(date);
        if (isNaN(parsedDate.getTime())) {
            return res.status(400).json({
                status: 400,
                success: false,
                message: "Invalid date value provided"
            });
        }

        // Find attendance records that match the specified date and hour
        const records = await Attendance.find({
            date: parsedDate,
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

exports.getAttendanceByClassHourAndDate = async (req, res) => {
    try {
        const { className, hour, date } = req.params;
        console.log('className-->', className, 'hour-->', hour, 'date-->', date);

        // Validate the date
        const parsedDate = new Date(date);
        if (isNaN(parsedDate.getTime())) {
            return res.status(400).json({
                status: 400,
                success: false,
                message: "Invalid date value provided"
            });
        }

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

        // Find attendance records for these students that match the specified hour and date
        const records = await Attendance.find({ 
            student: { $in: studentIds },
            hour: hour,
            date: parsedDate
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