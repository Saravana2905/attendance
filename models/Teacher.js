const mongoose = require("mongoose");

const TeacherSchema = mongoose.Schema({
    name: String,
    email: { type: String, unique: true },
    phone: String,
    password: String,
    classes: [{ type: mongoose.Schema.Types.ObjectId, ref: "Class" }]
});

module.exports = mongoose.model("Teacher", TeacherSchema);
