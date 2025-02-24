const Teacher = require("../models/Teacher.js");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
require("dotenv").config();

exports.createTeacher = async (req, res) => {
    try {
        const { name, email, phone, password, img } = req.body;
        console.log("request---->", req.body);
        const hashedPassword = await bcrypt.hash(password, 10);
        const newTeacher = new Teacher({ name, email, phone, password: hashedPassword, img });
        await newTeacher.save();
        res.status(201).json({ 
            status: 201,
            success: true,
            message: "Teacher created successfully" 
        });
    } catch (error) {
        res.status(500).json({ 
            status: 500,
            success: false,
            message: "Error creating teacher",
            error 
        });
    }
};

exports.getTeachers = async (req, res) => {
    try {
        const teachers = await Teacher.find();
        res.status(200).json({ 
            status: 200,
            success: true,
            teachers 
        });
    } catch (error) {
        res.status(500).json({ 
            status: 500,
            success: false,
            message: "Error fetching teachers",
            error 
        });
    }
};

exports.teacherLogin = async (req, res) => {
    try {
        const { email, password } = req.body;
        const teacher = await Teacher.findOne({ email });
        if (!teacher) {
            return res.status(401).json({
                status: 401,
                success: false,
                message: "Invalid email or password"
            });
        }
        const isMatch = await bcrypt.compare(password, teacher.password);
        if (!isMatch) {
            return res.status(401).json({
                status: 401,
                success: false,
                message: "Invalid email or password"
            });
        }
        const token = jwt.sign({ id: teacher._id, role: "teacher" }, process.env.JWT_SECRET, { expiresIn: "1d" });
        res.status(200).json({
            status: 200,
            success: true,
            token
        });
    } catch (error) {
        res.status(500).json({
            status: 500,
            success: false,
            message: "Error during teacher login",
            error
        });
    }
};
