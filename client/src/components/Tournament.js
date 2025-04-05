import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "./AuthContext";
import Result from "./Result";

const Tournament = () => {
  let { user } = useAuth();
  const [userID, setUserID] = useState("");
  const navigate = useNavigate();
  const { roomId } = useParams();
  const [players, setPlayers] = useState([]);
  const [gamer, setGamer] = useState("");
  const [rnd, setRnd] = useState(null);
  const [outPlayers, setOutPlayers] = useState([]);
  const [roomName, setRoomName] = useState("");
  const [admin, setAdmin] = useState("");
  const [isAdmin, setIsAdmin] = useState(false);
  const [isPlaying, setIsPlaying] = useState(true);
  const [started, setStarted] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        user = JSON.parse(localStorage.getItem("user"));
        setUserID(user.id);
        if (!user) {
          navigate("/login");
        }

        const response = await axios.get("https://code-1v1-tournament-platform-backend.vercel.app/api/tournament/getTournamentDetails", {
          params: { roomId }
        });

        const { Participants, Players, roundNo, RoomName, Admin, isStarted, isDeclared, isRunning } = response.data;

        setStarted(isStarted);

        if (!isRunning) {
          navigate(`/room/${roomId}`);
          return;
        }

        if (Players.length === 1) {
          navigate(`/room/${roomId}/tournament/finalresult`);
          return;
        }

        const out = Participants.filter(participant => !Players.some(player => player.id === participant.id));
        setOutPlayers(out);
        setPlayers(Players);
        setRoomName(RoomName);
        setAdmin(Admin);

        if (!isStarted) setRnd(roundNo);
        if (Admin === user.id) setIsAdmin(true);

        const gamr = Participants.find(player => player.id === user.id);
        setGamer(gamr);

        const Index = Players.findIndex(player => player.id === user.id);
        if (Index === -1) setIsPlaying(false);
        if (isStarted && Index !== -1) navigate(`/room/${roomId}/tournament/round`);
        if (isDeclared) navigate(`/room/${roomId}/tournament/finalresult`);
      } catch (error) {
        console.error("Error fetching tournament details:", error);
        navigate(`/room/${roomId}`);
      }
    };

    fetchData();
    const interval = setInterval(fetchData, 2000);
    return () => clearInterval(interval);
  }, []);

  const leaveTournament = async () => {
    try {
      await axios.post("https://code-1v1-tournament-platform-backend.vercel.app/api/tournament/leaveTournament", { roomId, userID });
      navigate(`/room/${roomId}`);
    } catch (error) {
      console.error("Error leaving tournament:", error);
    }
  };

  const endTournament = async () => {
    if (started) {
      alert("A Round is running. Wait for it to end!");
      return;
    }

    try {
      await axios.post("https://code-1v1-tournament-platform-backend.vercel.app/api/tournament/endTournament", { roomId });
      navigate(`/room/${roomId}`);
    } catch (error) {
      console.error("Error ending tournament:", error);
    }
  };

  const startRound = async () => {
    if (started) {
      alert("Already a Round is running. Wait for it to end!");
      return;
    }

    try {
      await axios.post("https://code-1v1-tournament-platform-backend.vercel.app/api/tournament/startRound", { roomId });
      if (isPlaying) navigate(`/room/${roomId}/tournament/round`);
    } catch (error) {
      console.error("Error starting tournament:", error);
    }
  };

  const declareResult = async () => {
    if (rnd === 0) {
      alert("You need to conduct at least one round before declaring results!");
      return;
    }
    if (started) {
      alert("A Round is running. Wait for it to end!");
      return;
    }

    try {
      await axios.post("https://code-1v1-tournament-platform-backend.vercel.app/api/tournament/declareResult", { roomId });
      navigate(`/room/${roomId}/tournament/finalresult`);
    } catch (error) {
      console.error("Error declaring results:", error);
    }
  };

  return (
    <div style={{
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      minHeight: "94.5vh",
      backgroundImage: `
        linear-gradient(to right, rgba(255,255,255,0.05) 2px, transparent 1px),
        linear-gradient(to bottom, rgba(255,255,255,0.05) 2px, transparent 1px)
      `,
      backgroundSize: "40px 40px",
      backgroundColor: "#000",
      color: "#fff",
      fontFamily: "'Winky Sans', sans-serif",
      padding: "20px",
      textAlign: "center"
    }}>
      <div>
        <h1 style={{ marginTop: "1rem", fontFamily: "Winky Sans" }}>
          The Tournament of {roomName}
        </h1>
      </div>

      {isPlaying ? (
        <h2>Best of luck, {gamer?.name}!</h2>
      ) : (
        <h2>Better luck next time, {gamer?.name}!</h2>
      )}

      {rnd && roomId && rnd > 0 ? (
        <div style={{ display: "flex", width: "100%" }}>
          <div style={{ flex: "1", paddingRight: "10px" }}>
            <h2>Active players:</h2>
            <PlayerList list={players} userID={userID} admin={admin} />
            <h2>Out of the tournament players:</h2>
            <PlayerList list={outPlayers} userID={userID} admin={admin} />
          </div>
          <div style={{ flex: "1", paddingLeft: "10px" }}>
            <Result roomId={roomId} rnd={rnd} />
          </div>
        </div>
      ) : (
        <div style={{ width: "100%" }}>
          <h2>Active players:</h2>
          <PlayerList list={players} userID={userID} admin={admin} />
          <h2>Out of the tournament players:</h2>
          <PlayerList list={outPlayers} userID={userID} admin={admin} />
        </div>
      )}

      {isAdmin ? (
        <div style={{ marginTop: "4rem", display: "flex", gap: "2rem", flexWrap: "wrap", justifyContent: "center" }}>
          <ActionButton text={`Start Round ${rnd + 1}!`} onClick={startRound} />
          <ActionButton text="Declare all active players as Winners" onClick={declareResult} />
          <ActionButton text="End Tournament" onClick={endTournament} />
        </div>
      ) : (
        <div style={{ marginTop: "4rem" }}>
          <ActionButton text="Leave Tournament" onClick={leaveTournament} />
        </div>
      )}
    </div>
  );
};

const PlayerList = ({ list, userID, admin }) => (
  <div style={{
    maxHeight: "300px",
    overflowY: "auto",
    width: "100%"
  }}>
    <ul style={{
      display: "grid",
      gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
      gap: "10px",
      listStyle: "none",
      padding: 0,
      margin: 0
    }}>
      {list?.map((player, index) => (
        <li key={index} style={{
          marginBottom: "5px",
          padding: "10px",
          background: "#34495e",
          borderRadius: "4px"
        }}>
          {player.name} {player.id === userID && "(You)"} {player.id === admin && "(Admin)"}
        </li>
      ))}
    </ul>
  </div>
);

const ActionButton = ({ text, onClick }) => (
  <button
    onClick={onClick}
    style={{
      padding: "1rem",
      fontSize: "1.2rem",
      fontWeight: "bold",
      fontFamily: "'Winky Sans', sans-serif",
      color: "#fff",
      backgroundColor: "rgba(255, 50, 50, 0.9)",
      border: "none",
      borderRadius: "10px",
      cursor: "pointer",
      boxShadow: "0 2px 5px rgba(0, 0, 0, 0.3)",
      transition: "background-color 0.3s ease, transform 0.2s ease"
    }}
    onMouseEnter={(e) => {
      e.target.style.transform = "scale(1.05)";
    }}
    onMouseLeave={(e) => {
      e.target.style.transform = "scale(1)";
    }}
  >
    {text}
  </button>
);

export default Tournament;
