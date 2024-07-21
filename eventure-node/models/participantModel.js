import mongoose from 'mongoose';

const { Schema } = mongoose;

// Define the Participant schema
const participantSchema = new Schema({
  eventId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'Event',  
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'User',  // Assuming you have a User model
  },
  status:{
    type: String,
    required: true,
    default: "waiting"
  },
}, {
  timestamps: true, // Adds createdAt and updatedAt fields
});

// Create the Participant model
const Participant = mongoose.model('Participant', participantSchema);

export default Participant;
