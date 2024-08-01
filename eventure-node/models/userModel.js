import mongoose from 'mongoose';

const { Schema } = mongoose;

// Define the User schema
const userSchema = new Schema({
  name: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true,
  },
  _t: {
    type: String,
    default: "User"
  }
});

// Create the User model
const User = mongoose.model('User', userSchema);

export default User;
