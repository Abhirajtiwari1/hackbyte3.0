import Room from '../models/Room.js';
import User from '../models/User.js';

// Shuffle players randomly
async function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

// Assign problems to players in pairs
async function assignProblem(array) {
  for (let i = 0; i < array.length; i++) {
    const randomNumber = Math.floor(Math.random() * 2);
    const paddedNumber = String(randomNumber).padStart(4, '0');
    const ID = array[i].id;
    const user = await User.findById(ID);
    user.problemID = paddedNumber;
    user.numberOfTestsPassed = 0;
    user.submissionTime = null;
    await user.save();

    i++;
    if (i < array.length) {
      const ID1 = array[i].id;
      const user1 = await User.findById(ID1);
      user1.problemID = paddedNumber;
      user1.numberOfTestsPassed = 0;
      user1.submissionTime = null;
      await user1.save();
    }
  }
}

// Start a new tournament
const startTournament = async (req, res) => {
  try {
    const { roomId } = req.body;
    const room = await Room.findOne({ roomId });
    if (!room) return res.status(404).json({ message: 'Room not found' });

    room.resultCalculated = false;
    room.isStarted = true;
    room.players = room.participants;

    await room.save();
    res.status(200).json({ message: 'Tournament started successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get current tournament details
const getTournamentDetails = async (req, res) => {
  try {
    const { roomId } = req.query;
    const room = await Room.findOne({ roomId });
    if (!room) return res.status(404).json({ message: 'Room not found' });

    const response = {
      Participants: room.participants,
      Players: room.players,
      OldPlayers: room.oldPlayers,
      roundNo: room.roundNo,
      RoomName: room.name,
      Admin: room.admin,
      isStarted: room.roundStarted,
      isDeclared: room.resultDeclared,
      isRunning: room.isStarted,
      isResultCalculated: room.resultCalculated,
    };

    res.status(200).json(response);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get start time for current round
const getTime = async (req, res) => {
  try {
    const { roomId } = req.query;
    const room = await Room.findOne({ roomId });
    if (!room) return res.status(404).json({ message: 'Room not found' });

    res.status(200).json({ startTime: room.roundStartTime });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Start a new round
const startRound = async (req, res) => {
  try {
    const { roomId } = req.body;
    const room = await Room.findOne({ roomId });
    if (!room) return res.status(404).json({ message: 'Room not found' });

    room.resultCalculated = false;
    room.roundStarted = true;
    room.roundNo += 1;

    const shuffledPlayers = await shuffleArray(room.players);
    await assignProblem(shuffledPlayers);

    room.players = shuffledPlayers;
    room.roundStartTime = new Date();

    await room.save();
    res.status(200).json({ message: 'Round started successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Remove player from tournament
const leaveTournament = async (req, res) => {
  try {
    const { roomId, userID } = req.body;
    const room = await Room.findOne({ roomId });
    if (!room) return res.status(404).json({ message: 'Room not found' });

    room.players = room.players.filter(player => player.id !== userID);
    await room.save();

    res.status(200).json({ roomId, message: 'Left tournament successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// End tournament
const endTournament = async (req, res) => {
  try {
    const { roomId } = req.body;
    const room = await Room.findOne({ roomId });
    if (!room) return res.status(404).json({ message: 'Room not found' });

    room.isStarted = false;
    room.roundStarted = false;
    room.resultDeclared = false;
    room.roundNo = 0;
    room.players = [];
    room.oldPlayers = [];

    await room.save();
    res.status(200).json({ message: 'Tournament ended successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Declare result for a round
const declareResult = async (req, res) => {
  try {
    const { roomId } = req.body;
    const room = await Room.findOne({ roomId });
    if (!room) return res.status(404).json({ message: 'Room not found' });

    room.roundStarted = false;
    room.resultDeclared = true;
    await room.save();

    res.status(200).json({ message: 'Result declared successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

export default {
  startTournament,
  getTournamentDetails,
  getTime,
  startRound,
  leaveTournament,
  endTournament,
  declareResult
};
