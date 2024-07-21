import mongoose from 'mongoose';

const { Schema } = mongoose;

// Define the Event schema
const eventSchema = new Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  location: {
    type: String,
    required: true,
  },
  startDate: {
    type: Date,
    required: true,
  },
  admins: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  tasks: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Task',
  }],
  participants: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Participant',
  }],
}, {
  timestamps: true,
});

// Create the Event model
const Event = mongoose.model('Event', eventSchema);

export default Event;
