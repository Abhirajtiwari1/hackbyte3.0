import mongoose from 'mongoose';

const roomSchema = new mongoose.Schema({
  roomId: {
    type: String,
    required: true,
    unique: true
  },
  name: {
    type: String,
    required: true
  },
  admin: {
    type: String,
    required: true
  },
  isStarted: {
    type: Boolean,
    default: false
  },
  roundStarted: {
    type: Boolean,
    default: false
  },
  resultDeclared: {
    type: Boolean,
    default: false
  },
  resultCalculated: {
    type: Boolean,
    default: false
  },
  roundNo: {
    type: Number,
    default: 0
  },
  players: {
    type: [{ name: String, id: String }],
    default: []
  },
  oldPlayers: {
    type: [{ name: String, id: String }],
    default: []
  },
  roundStartTime: {
    type: Date
  },
  participants: {
    type: [{ name: String, id: String }],
    default: []
  },
  createdAt: {
    type: Date,
    default: Date.now,
    expires: 10800 // 3 hours
  }
});

const Room = mongoose.model('Room', roomSchema);

export default Room;
