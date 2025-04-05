import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom"; 
import { useAuth } from "./AuthContext";

const CreateRoom = () => {
  const [roomName, setRoomName] = useState("");
  const [userName, setUserName] = useState("");
  const [userID, setUserID] = useState("");
  let { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    user = JSON.parse(localStorage.getItem("user"));
    setUserID(user.id);
    if (!user) {
      navigate("/login");
    }
  }, [user, navigate]);

  const handleCreateRoom = () => {
    if (roomName === "") {
      alert("Room Name input can't be empty");
      return;
    }
    if (userName === "") {
      alert("Your Name input can't be empty");
      return;
    }
    axios
      .post("https://code-1v1-tournament-platform-backend.vercel.app/api/rooms/create", {
        roomName,
        userName,
        userID,
      })
      .then((response) => {
        navigate(`/room/${response.data.roomId}`);
      })
      .catch((error) => {
        console.error("Error creating room:", error);
      });
  };

  return (
    <div style={{ 
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      minHeight: "95.5vh",
      backgroundImage: `
        linear-gradient(to right, rgba(255,255,255,0.05) 1px, transparent 1px),
        linear-gradient(to bottom, rgba(255,255,255,0.05) 1px, transparent 1px)
      `,
      backgroundSize: "40px 40px",
      backgroundColor: "#000",
      color: "#fff",
      fontFamily: "'Roboto', sans-serif",
      paddingBottom: "2rem"
    }}>
      <h1 style={{ 
        fontSize: "3rem",
        fontWeight: "bold",
        textAlign: "center",
        marginBottom: "4rem",
        textShadow: "2px 2px 4px rgba(0, 0, 0, 0.4)"
      }}>Create Room</h1>
      <div style={{ marginBottom: "1rem" }}>
        <label htmlFor="roomName" style={{ color: "#fff", fontSize: "1.5rem", marginBottom: "0.5rem",fontFamily:"Winky Sans"}}>Room Name: &nbsp;</label>
        <input
          type="text"
          id="roomName"
          value={roomName}
          onChange={(e) => setRoomName(e.target.value)}
          style={{
            padding: "0.5rem",
            borderRadius: "5px",
            border: "2px solid #fff",
            marginBottom: "1rem",
            width: "300px",
            fontSize: "1.2rem",
            backgroundColor: "rgba(255, 255, 255, 0.1)",
            color: "#fff",
            outline: "none",
            transition: "border-color 0.3s ease, background-color 0.3s ease",
          }}
        />
      </div>
      <div style={{ marginBottom: "1rem" }}>
        <label htmlFor="userName" style={{ color: "#fff", fontSize: "1.5rem", marginBottom: "0.5rem" , fontFamily:"Winky Sans"}}>Your Name: &nbsp;</label>
        <input
          type="text"
          id="userName"
          value={userName}
          onChange={(e) => setUserName(e.target.value)}
          style={{ 
            padding: "0.5rem",
            borderRadius: "5px",
            border: "2px solid #fff",
            marginBottom: "1rem",
            width: "300px",
            fontSize: "1.2rem",
            backgroundColor: "rgba(255, 255, 255, 0.1)",
            color: "#fff",
            outline: "none",
            transition: "border-color 0.3s ease, background-color 0.3s ease",
          }}
        />
      </div>
      <button onClick={handleCreateRoom} style={{ 
        padding: "1rem",
        backgroundColor: "rgba(255, 50, 50, 0.9)",
        color: "#fff",
        border: "none",
        borderRadius: "10px",
        cursor: "pointer",
        boxShadow: "0 2px 5px rgba(0, 0, 0, 0.3)",
        transition: "background-color 0.3s ease, transform 0.2s ease",
        fontSize: "1.2rem",
        fontWeight: "bold",
        textShadow: "1px 1px 2px rgba(0, 0, 0, 0.6)",
        marginTop:"2rem",
        fontFamily:"Winky Sans",
      }}
     
      >
        Create Room
      </button>
    </div>
  );
};

export default CreateRoom;
