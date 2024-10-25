const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config();

// async functions is a technique that enables the program to start a 
// potentially long-running task and still be responsive to other events while that task runs
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('MongoDB connected');
  } catch (err) {
    console.error(err.message);
    process.exit(1);
  }
};

module.exports = connectDB;