const Attendance = require("../models/Attendance");

exports.markAttendance = async (req, res) => {
    try {
        const { rollno, status } = req.body;

        // Find the student based on rollno
        const student = await Student.findOne({ rollno });
        if (!student) {
            return res.status(404).json({ message: "Student not found" });
        }

        // Create and save the attendance record
        const attendance = new Attendance({
            student: student._id,  // Use student's _id instead of rollno
            status
        });
        await attendance.save();

        res.status(201).json({ message: "Attendance marked successfully" });
    } catch (error) {
        res.status(500).json({ message: "Error marking attendance", error });
    }
};

exports.getAttendanceByDate = async (req, res) => {
    const { date } = req.query;
    const records = await Attendance.find({ date });
    res.json(records);
};

exports.clearAttendance = async (req, res) => {
    await Attendance.deleteMany({});
    res.json({ message: "All attendance records cleared" });
};
