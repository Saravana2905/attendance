const mongoose = require("mongoose");

const connectDB = async () => {
    try {
        await mongoose.connect('mongodb+srv://admin:admin123@cluster0.mbkdi.mongodb.net/attendance?retryWrites=true&w=majority&appName=Cluster0');
        console.log("MongoDB connected...");
    } catch (error) {
        console.error("MongoDB connection error:", error);
        process.exit(1);
    }
};

module.exports = connectDB;
