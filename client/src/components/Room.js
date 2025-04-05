import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import { useAuth } from "./AuthContext";
import { useNavigate } from "react-router-dom";

const Room = () => {
  const { roomId } = useParams();
  const [gamer, setGamer] = useState("");
  const [roomName, setRoomName] = useState("");
  const [userID, setUserID] = useState("");
  const [participants, setParticipants] = useState([]);
  const [isAdmin, setIsAdmin] = useState(false);
  const [admi, setAdmi] = useState("");
  const [started, setStarted] = useState(false);
  let { user } = useAuth();
  const navigate = useNavigate();

  let errorShown = false;

  useEffect(() => {
    const fetchRoomDetails = async () => {
      try {
        user = JSON.parse(localStorage.getItem("user"));
        setUserID(user.id);
        if (!user) {
          navigate("/login");
        }

        const response = await axios.get(
          "https://code-1v1-tournament-platform-backend.vercel.app/api/rooms/getRoomDetails",
          { params: { roomId } }
        );
        const { name, admin, participants, isStarted, players } = response.data.room;

        setAdmi(admin);
        setRoomName(name);
        setStarted(isStarted);
        setParticipants(participants);

        const gamr = participants.find((participant) => participant.id === user.id);
        setGamer(gamr);
        if (admin === user.id) {
          setIsAdmin(true);
        }

        const isThere = players.findIndex((player) => player.id === user.id);
        if (started && !(isThere === -1 && players.length > 0)) {
          navigate(`/room/${roomId}/tournament`);
          return;
        }
      } catch (error) {
        if (!errorShown) {
          errorShown = true;
          alert("Room doesn't exist");
          navigate("/home");
        }
      }
    };

    fetchRoomDetails();
    const interval = setInterval(fetchRoomDetails, 5000);
    return () => clearInterval(interval);
  }, [userID, started]);

  const handleLeaveRoom = () => {
    axios
      .post("https://code-1v1-tournament-platform-backend.vercel.app/api/rooms/leave", {
        roomId,
        userID,
      })
      .then(() => navigate("/home"))
      .catch((error) => console.error("Error leaving room:", error));
  };

  const handleDeleteRoom = () => {
    axios
      .delete("https://code-1v1-tournament-platform-backend.vercel.app/api/rooms/deleteRoom", {
        data: { roomId },
      })
      .then(() => navigate("/home"))
      .catch((error) => console.error("Error deleting room:", error));
  };

  const startTournament = () => {
    if (participants.length === 1) {
      alert("You need at least 2 players!");
      return;
    }
    axios
      .post("https://code-1v1-tournament-platform-backend.vercel.app/api/tournament/startTournament", {
        roomId,
      })
      .then(() => navigate(`/room/${roomId}/tournament`))
      .catch((error) => console.error("Error starting tournament:", error));
  };

  const copyRoomId = () => {
    var roomIdText = document.querySelector("#room-id-span");
    var tempInput = document.createElement("input");
    document.body.appendChild(tempInput);
    tempInput.value = roomIdText.innerText;
    tempInput.select();
    document.execCommand("copy");
    document.body.removeChild(tempInput);
    alert("Room ID copied to clipboard: " + roomIdText.innerText);
  };

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        minHeight: "94.5vh",
        backgroundImage: `
          linear-gradient(to right, rgba(255,255,255,0.05) 1px, transparent 1px),
          linear-gradient(to bottom, rgba(255,255,255,0.05) 1px, transparent 1px)
        `,
        backgroundSize: "40px 40px",
        backgroundColor: "#000",
        color: "#fff",
        fontFamily: "'Winky Sans', sans-serif",
        padding: "20px",
        textAlign: "center",
      }}
    >
      <h1 style={{ marginTop: "2rem" }}>Hello, {gamer?.name}</h1>
      <h1 style={{ marginTop: "1rem" }}>Welcome to {roomName}</h1>
      <h4 style={{ marginTop: "1rem", color: "#fffccc" }}>
        Share Room ID with others to join:{" "}
        <span
          id="room-id-span"
          style={{
            marginLeft: "0.5rem",
            fontSize: "20px",
            fontFamily: "'Courier New', monospace",
            color: "#ffcccc",
          }}
        >
          {roomId}
        </span>
        <button
          onClick={copyRoomId}
          style={{
            marginLeft: "0.1rem",
            background: "#fff",
            color: "#000",
            border: "none",
            padding: "0.5rem 0.5rem",
            borderRadius: "5px",
            cursor: "pointer",
          }}
        >
          Copy
        </button>
      </h4>

      <h2>Participants:</h2>
      <div style={{ maxHeight: "300px", overflowY: "auto", width: "100%" }}>
        <ul
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
            gap: "10px",
            listStyle: "none",
            padding: 0,
            margin: 0,
          }}
        >
          {participants?.map((participant, index) => (
            <li
              key={index}
              style={{
                marginBottom: "5px",
                padding: "10px",
                background: "#34495e",
                borderRadius: "4px",
              }}
            >
              {participant.name} {participant.id === userID && "(You)"}{" "}
              {participant.id === admi && "(Admin)"}
            </li>
          ))}
        </ul>
      </div>

      {isAdmin ? (
        <div style={{ position: "absloute", marginTop: "15rem" }}>
          <button
            style={{
              textDecoration: "none",
              color: "#fff",
              fontSize: "1.5rem",
              fontWeight: "bold",
              textShadow: "1px 1px 2px rgba(0, 0, 0, 0.6)",
              padding: "1rem",
              backgroundColor: "rgba(255, 50, 50, 0.9)",
              border: "none",
              borderRadius: "10px",
              cursor: "pointer",
              boxShadow: "0 2px 5px rgba(0, 0, 0, 0.3)",
              transition: "background-color 0.3s ease, transform 0.2s ease",
              display: "inline-block", 
              fontFamily: "'Winky Sans', sans-serif",
            }}
            onMouseEnter={(e) => {
              e.target.style.backgroundColor = "#1abc9c";
              e.target.style.transform = "scale(1.05)";
            }}
            onMouseLeave={(e) => {
              e.target.style.backgroundColor = "#16a085";
              e.target.style.transform = "scale(1)";
            }}
            onClick={startTournament}
          >
            Start Tournament
          </button>
          <button
            style={{
              marginLeft: "10rem",
              textDecoration: "none",
              color: "#fff",
              fontSize: "1.5rem",
              fontWeight: "bold",
             
              padding: "1rem",
              backgroundColor: "rgba(255, 50, 50, 0.9)",
              border: "none",
              borderRadius: "10px",
              cursor: "pointer",
             fontFamily: "'Winky Sans', sans-serif",
              transition: "background-color 0.3s ease, transform 0.2s ease",
              display: "inline-block", 
              
              
            }}
            onMouseEnter={(e) => {
              e.target.style.backgroundColor = "#c0392b";
              e.target.style.transform = "scale(1.05)";
            }}
            onMouseLeave={(e) => {
              e.target.style.backgroundColor = "#e74c3c";
              e.target.style.transform = "scale(1)";
            }}
            onClick={handleDeleteRoom}
          >
            Delete Room
          </button>
        </div>
      ) : (
        <div style={{ position: "absloute", marginTop: "15rem" }}>
          <button
            style={{
              textDecoration: "none",
              color: "#fff",
              fontSize: "1.5rem",
              fontWeight: "bold",
              textShadow: "1px 1px 2px rgba(0, 0, 0, 0.6)",
              padding: "1rem",
              backgroundColor: "#e74c3c",
              border: "none",
              borderRadius: "10px",
              cursor: "pointer",
              boxShadow: "0 2px 5px rgba(0, 0, 0, 0.3)",
              transition: "background-color 0.3s ease, transform 0.2s ease",
              display: "inline-block",
            }}
            onMouseEnter={(e) => {
              e.target.style.backgroundColor = "#c0392b";
              e.target.style.transform = "scale(1.05)";
            }}
            onMouseLeave={(e) => {
              e.target.style.backgroundColor = "#e74c3c";
              e.target.style.transform = "scale(1)";
            }}
            onClick={handleLeaveRoom}
          >
            Leave Room
          </button>
        </div>
      )}
    </div>
  );
};

export default Room;
