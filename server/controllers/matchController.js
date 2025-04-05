
import bcrypt from 'bcryptjs';
import User from '../models/User.js';
import Room from '../models/Room.js';
import dotenv from 'dotenv';

dotenv.config();

// Function to execute code using the compiler API
async function executeCode(script, language, stdin) {
  const execution_data = {
    clientId: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET,
    script: script,
    language: language,
    stdin: stdin,
    versionIndex: "0",
  };

  try {
    const response = await fetch("https://api.jdoodle.com/v1/execute", {
      method: 'POST',
      body: JSON.stringify(execution_data),
      headers: { 'Content-Type': 'application/json' },
    });

    const data = await response.json();
    return data.output.trim(); // Trim output to remove extra newlines/spaces
  } catch (error) {
    console.error('Error executing code:', error);
    throw new Error('Execution failed');
  }
}

const getProblemID = async (req, res) => {
  try {
    const { userID } = req.query;
    const user = await User.findOne({ userID });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    const problemID = user.problemID;
    res.status(200).json({ problemID });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

const submitCode = async (req, res) => {
  try {
    const { script, language, userID, problemID } = req.body;

    let passedTestcases = 0;
    let totalTestcases = 0;

    const headerResponse = await fetch(`https://judgedat.u-aizu.ac.jp/testcases/${problemID}/header`);
    const headerData = await headerResponse.json();
    const headers = headerData.headers;

    for (const header of headers) {
      const serial = header.serial;
      totalTestcases++;

      const testCaseResponse = await fetch(`https://judgedat.u-aizu.ac.jp/testcases/${problemID}/${serial}`);
      const testCaseData = await testCaseResponse.json();
      const input = testCaseData.in.trim();
      const expectedOutput = testCaseData.out.trim();

      try {
        const actualOutput = await executeCode(script, language, input);
        if (actualOutput === expectedOutput) {
          passedTestcases++;
        }
      } catch (error) {
        console.error('Code execution error:', error);
      }
    }

    const user = await User.findById(userID);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    user.numberOfTestsPassed = passedTestcases;
    user.submissionTime = new Date();
    await user.save();

    res.status(200).json({ passedTestcases, totalTestcases });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

async function findResult(array) {
  let players = [];

  for (let i = 0; i < array.length; i += 2) {
    const ID1 = array[i].id;
    const user1 = await User.findById(ID1);
    const t1 = user1?.numberOfTestsPassed;
    const s1 = user1?.submissionTime;

    if (i === array.length - 1) {
      if (t1 > 0) players.push(array[i]);
    } else {
      const ID2 = array[i + 1].id;
      const user2 = await User.findById(ID2);
      const t2 = user2?.numberOfTestsPassed;
      const s2 = user2?.submissionTime;

      if (s1 === null && s2 !== null) {
        players.push(array[i + 1]);
      } else if (s1 !== null && s2 === null) {
        players.push(array[i]);
      } else if (s1 === null && s2 === null) {
        players.push(array[i]);
      } else {
        if (t1 > t2) {
          players.push(array[i]);
        } else if (t1 < t2) {
          players.push(array[i + 1]);
        } else {
          if (s1 < s2) {
            players.push(array[i]);
          } else {
            players.push(array[i + 1]);
          }
        }
      }
    }
  }

  return players;
}

const calculateResult = async (req, res) => {
  try {
    const { roomId } = req.body;
    const room = await Room.findOne({ roomId });
    if (!room) {
      return res.status(404).json({ message: 'Room not found' });
    }

    if (room.resultCalculated) {
      return res.status(200).json({ message: 'Results already calculated' });
    }

    const players = room.players;
    room.oldPlayers = players;
    const newPlayers = await findResult(players);
    room.players = newPlayers;
    room.resultCalculated = true;
    room.roundStarted = false;

    await room.save();

    res.status(200).json({ message: 'Results calculated' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

export default {
  getProblemID,
  submitCode,
  calculateResult,
};
