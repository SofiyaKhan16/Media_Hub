import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('MongoDB connection established successfully.');
  } catch (err) {
    console.error('Error connecting to MongoDB:', err.message);
    console.error('Ensure that MONGODB_URI is correctly set in your .env file.');
    process.exit(1);
  }
};

export default connectDB;
