import React, { useEffect } from "react";
import { useAuth } from "./AuthContext";
import { Link, useNavigate } from "react-router-dom";

const Home = () => {
  let { user, logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    user = JSON.parse(localStorage.getItem("user"));
    if (!user) {
      navigate("/login");
    }
  }, [user, navigate]);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        height: "100vh",
        backgroundImage: `
          linear-gradient(to right, rgba(255,255,255,0.05) 2px, transparent 1px),
          linear-gradient(to bottom, rgba(255,255,255,0.05) 2px, transparent 1px)
        `,
        backgroundSize: "40px 40px",
        backgroundColor: "#000",
        color: "#fff",
        fontFamily: "'Roboto', sans-serif",
      }}
    >
      {user && (
        <h1
          style={{
            fontSize: "3rem",
            fontWeight: "bold",
            textAlign: "center",
            marginBottom: "2rem",
            textShadow: "2px 2px 4px rgba(255, 255, 255, 0.2)",
            fontFamily: "'Winky Sans', sans-serif",
          }}
        >
          Welcome, {user.name}!
        </h1>
      )}

      <div>
        <Link
          to="/create-room"
          style={{
            textDecoration: "none",
            color: "#fff",
            fontSize: "1.5rem",
            fontWeight: "bold",
            textShadow: "1px 1px 2px rgba(255, 255, 255, 0.2)",
            padding: "1rem",
            backgroundColor: "rgba(255, 50, 50, 0.9)",
            border: "none",
            borderRadius: "10px",
            cursor: "pointer",
            boxShadow: "0 2px 5px rgba(0, 0, 0, 0.3)",
            transition: "background-color 0.3s ease, transform 0.2s ease",
            display: "inline-block",
            marginBottom: "2rem",
            marginRight: "1rem", 
            fontFamily: "'Winky Sans', sans-serif",
          }}
         
         
        >
          Create Room
        </Link>

        <Link
          to="/join-room"
          style={{
            textDecoration: "none",
            color: "#fff",
            fontSize: "1.5rem",
            fontWeight: "bold",
            textShadow: "1px 1px 2px rgba(255, 255, 255, 0.2)",
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
          
         
        >
          Join Room
        </Link>
      </div>

      <button
        onClick={handleLogout}
        style={{
          marginTop: "4rem",
          padding: "1rem",
          backgroundColor: "#e74c3c",
          color: "#fff",
          border: "none",
          borderRadius: "10px",
          cursor: "pointer",
          boxShadow: "0 2px 5px rgba(0, 0, 0, 0.3)",
          transition: "background-color 0.3s ease, transform 0.2s ease",
          fontSize: "1.2rem",
          fontWeight: "bold",
          textShadow: "1px 1px 2px rgba(255, 255, 255, 0.2)", 
          fontFamily: "'Winky Sans', sans-serif",
        }}
      
      >
        Logout
      </button>
    </div>
  );
};

export default Home;
