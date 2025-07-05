import mongoose from 'mongoose';
import baseSchema from './baseSchema.js';

const user = new mongoose.Schema({
  ...baseSchema.obj,
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  profilePicture: { type: String, default: null }
});

export default mongoose.model('User', user);
