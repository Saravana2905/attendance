const Admin = require("../models/Admin");
const Teacher = require("../models/Teacher");
const Student = require("../models/Student");
const Class = require("../models/Class");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
require("dotenv").config();

exports.createAdmin = async (req, res) => {
    try {
        console.log("request---->", req.body);
        const { name, email, password, phone, img } = req.body;
        const hashedPassword = await bcrypt.hash(password, 10);
        const admin = new Admin({ name, email, password: hashedPassword, phone, img });
        await admin.save();
        res.status(201).json({ 
            status: 201,
            success: true,
            message: "Admin created successfully"
        });
    } catch (error) {
        res.status(500).json({ 
            status: 500,
            success: false,
            message: "Error creating admin",
            error
        });
    }
};

exports.adminLogin = async (req, res) => {
    try {
        console.log("request---->", req.body);
        const { email, password } = req.body;
        const admin = await Admin.findOne({ email });
        if (!admin) return res.status(401).json({ 
            status: 401,
            success: false,
            message: "Invalid email" 
        });
        const isMatch = await bcrypt.compare(password, admin.password);
        if (!isMatch) return res.status(401).json({ 
            status: 401,
            success: false,
            message: "Invalid password" 
        });
        const token = jwt.sign({ id: admin._id, role: "admin" }, process.env.JWT_SECRET, { expiresIn: "1d" });
        res.status(200).json({ 
            status: 200,
            success: true,
            token 
        });
    } catch (error) {
        res.status(500).json({
            status: 500,
            success: false,
            message: "Error during admin login",
            error
        });
    }
};

exports.createClass = async (req, res) => {
    try {
        const { className } = req.body;
        const newClass = new Class({ className });
        await newClass.save();
        res.status(201).json({ 
            status: 201,
            success: true,
            message: "Class created successfully", 
            newClass 
        });
    } catch (error) {
        res.status(500).json({ 
            status: 500,
            success: false,
            message: "Error creating class",
            error
        });
    }
};

exports.allocateClass = async (req, res) => {
    try {
        const { teacherId, classId } = req.body;
        console.log("Request Data:", req.body);

        const teacher = await Teacher.findById(teacherId);
        if (!teacher) {
            return res.status(404).json({ 
                status: 404,
                success: false,
                message: "Teacher not found" 
            });
        }

        const studentClass = await Class.findById(classId);
        if (!studentClass) {
            return res.status(404).json({ 
                status: 404,
                success: false,
                message: "Class not found" 
            });
        }

        if (!Array.isArray(teacher.classes)) teacher.classes = [];
        if (!Array.isArray(studentClass.teachers)) studentClass.teachers = [];

        if (!teacher.classes.includes(classId)) {
            teacher.classes.push(classId);
            await teacher.save();
        }

        if (!studentClass.teachers.includes(teacherId)) {
            studentClass.teachers.push(teacherId);
            await studentClass.save();
        }

        res.status(200).json({ 
            status: 200,
            success: true,
            message: "Class allocated to teacher successfully" 
        });
    } catch (error) {
        console.error("Error allocating class to teacher:", error);
        res.status(500).json({ 
            status: 500,
            success: false,
            message: "Error allocating class to teacher",
            error: error.message 
        });
    }
};