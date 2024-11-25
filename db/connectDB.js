const mongoose = require("mongoose");

const connectDB = async () => {
    try {
        const conn = await mongoose.connect('mongodb://localhost:27017/userata6', { }); 
        console.log(`MongoDB Connected: ${conn.connection.host}`);
    } catch (error) {
        console.error(`Error: ${error.message}`);
        process.exit(1);  // Exit process with failure if connection fails
    }
};

module.exports = connectDB;