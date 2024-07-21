import mongoose from 'mongoose';

const { Schema } = mongoose;

// Define the Task schema
const taskSchema = new Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  status:{
    type: String,
    required: true,
    default: "waiting"
  },
  deadLine: {
    type: Date,
    required: true,
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'User',  // Assuming you have a User model
  },
  eventId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'Event',  // Assuming you have an Event model
  },
}, {
  timestamps: true, // Adds createdAt and updatedAt fields
});

// Create the Task model
const Task = mongoose.model('Task', taskSchema);

export default Task;
