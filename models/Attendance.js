const mongoose = require("mongoose");

const AttendanceSchema = new mongoose.Schema({
    student: { type: mongoose.Schema.Types.ObjectId, ref: "Student" },
    date: { type: Date, default: Date.now },
    hour: { type: String, required: true },
    att_status: { type: String, enum: ["Present", "Absent", "OnDuty"], required: true }
});

module.exports = mongoose.model("Attendance", AttendanceSchema);
