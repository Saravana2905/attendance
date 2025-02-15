const mongoose = require("mongoose");

const StudentSchema = new mongoose.Schema({
    name: String,
    rollno: String,
    email: { type: String, unique: true },
    phone: String,
    class: { type: mongoose.Schema.Types.ObjectId, ref: "Class" }
});

module.exports = mongoose.model("Student", StudentSchema);