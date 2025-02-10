const Teacher = require('../models/Teacher.js')
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
require('dotenv').config();

exports.createTeacher = async (req, res) => {
    try {
        const { name, email, phone, password, img } = req.body;
        console.log("request---->", req.body);
        const hashedPassword = await bcrypt.hash(password, 10);
        const nteacher = new Teacher({ name, email, phone, password: hashedPassword, img });
        console.log("teacher---->", nteacher);
        await nteacher.save();
        res.status(201).json({ message: "Teacher created successfully" });
    } catch (error) {
        res.status(500).json({ message: "Error creating teacher", error });
    }
};

// Login Teacher
exports.teacherLogin = async (req, res) => {
    const { email, password } = req.body;
    const teacher = await Teacher.findOne({ email });

    if (!teacher) return res.status(401).json({ message: "Invalid email or password" });

    const isMatch = await bcrypt.compare(password, teacher.password);
    if (!isMatch) return res.status(401).json({ message: "Invalid email or password" });

    const token = jwt.sign({ id: teacher._id, role: "teacher" }, process.env.JWT_SECRET, { expiresIn: "1d" });
    res.status(200).json({ token });
};
