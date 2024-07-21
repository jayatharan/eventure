import mongoose from 'mongoose';

const { Schema } = mongoose;

// Define the User schema
const userSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
}, {
  timestamps: true, // Adds createdAt and updatedAt fields
});

// Create the User model
const User = mongoose.model('User', userSchema);

export default User;
