const Student = require("../models/Student");
const Class = require("../models/Class");

/**
 * Create a new student and assign them to a class.
 */
exports.createStudent = async (req, res) => {
    try {
        const { name, rollno, email, phone, profileimg, classId } = req.body;

        // Check if the class exists
        const studentClass = await Class.findById(classId);
        if (!studentClass) {
            return res.status(404).json({
                status: 404,
                success: false,
                message: "Class not found"
            });
        }

        // Check if a student with the given roll number already exists
        const existingStudent = await Student.findOne({ rollno });
        if (existingStudent) {
            return res.status(400).json({
                status: 400,
                success: false,
                message: "Student with this roll number already exists"
            });
        }

        // Create the student
        const student = new Student({ name, rollno, email, phone, profileimg, class: classId });
        await student.save();

        // Add student to the class
        studentClass.students.push(student._id);
        await studentClass.save();

        res.status(201).json({
            status: 201,
            success: true,
            message: "Student created successfully",
            student
        });
    } catch (error) {
        res.status(500).json({
            status: 500,
            success: false,
            message: "Error creating student",
            error
        });
    }
};

/**
 * Get student by roll number
 */
exports.getStudentByRollNo = async (req, res) => {
    try {
        const { rollno } = req.params;

        // Find the student based on roll number
        const student = await Student.findOne({ rollno }).populate("class", "className");
        if (!student) {
            return res.status(404).json({
                status: 404,
                success: false,
                message: "Student not found"
            });
        }

        res.status(200).json({
            status: 200,
            success: true,
            student
        });
    } catch (error) {
        res.status(500).json({
            status: 500,
            success: false,
            message: "Error fetching student",
            error
        });
    }
};

// Get students by classId
exports.getStudentsByClass = async (req, res) => {
    try {
        const { classId } = req.params;

        // Find the class based on classId
        const studentClass = await Class.findById(classId).populate("students");
        if (!studentClass) {
            return res.status(404).json({
                status: 404,
                success: false,
                message: "Class not found"
            });
        }

        res.status(200).json({
            status: 200,
            success: true,
            students: studentClass.students
        });
    } catch (error) {
        res.status(500).json({
            status: 500,
            success: false,
            message: "Error fetching students",
            error
        });
    }
};