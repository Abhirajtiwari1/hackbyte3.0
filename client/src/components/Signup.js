import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useAuth } from "./AuthContext";
import "../css/Login.css";

const Signup = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const isLoggedIn = localStorage.getItem("user");
    if (isLoggedIn) {
      navigate("/home");
    }
  }, [navigate]);

  const handleSignup = (e) => {
    e.preventDefault();
    axios
      .post("https://code-1v1-tournament-platform-backend.vercel.app/api/auth/signup", {
        name,
        email,
        password,
      })
      .then((response) => {
        console.log(response.data);
        navigate("/login");
      })
      .catch((error) => {
        console.error("Error signing up:", error);
        alert("Signup failed: " + (error?.response?.data?.message || "Try again later."));
      });
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
          linear-gradient(to right, rgba(255,255,255,0.05) 1px, transparent 1px),
          linear-gradient(to bottom, rgba(255,255,255,0.05) 1px, transparent 1px)
        `,
        backgroundSize: "40px 40px",
        backgroundColor: "#000",
        color: "#fff",
        fontFamily: "'Roboto', sans-serif",
      }}
    >
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
        Join the 1v1 Coding Arena
      </h1>

      <div
        style={{
          width: "300px",
          border: "2px solid #fff",
          borderRadius: "20px",
          padding: "30px",
          boxShadow: "0 10px 20px rgba(255,50,50,0.9)",
          background: "#000",
        }}
      >
        <h2
          style={{
            textAlign: "center",
            marginBottom: "1.5rem",
            fontSize: "1.8rem",
            textShadow: "1px 1px 2px rgba(255, 255, 255, 0.2)",
            fontFamily: "'Winky Sans', sans-serif",
          }}
        >
          Sign Up
        </h2>

        <form
          onSubmit={handleSignup}
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Name"
            style={{
              width: "100%",
              marginBottom: "1rem",
              padding: "1rem",
              border: "none",
              borderRadius: "10px",
              background: "rgba(255, 255, 255, 0.1)",
              color: "#fff",
              textAlign: "center",
              fontSize: "1rem",
            }}
            required
          />

          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email"
            style={{
              width: "100%",
              marginBottom: "1rem",
              padding: "1rem",
              border: "none",
              borderRadius: "10px",
              background: "rgba(255, 255, 255, 0.1)",
              color: "#fff",
              textAlign: "center",
              fontSize: "1rem",
            }}
            required
          />

          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            style={{
              width: "100%",
              marginBottom: "1rem",
              padding: "1rem",
              border: "none",
              borderRadius: "10px",
              background: "rgba(255, 255, 255, 0.1)",
              color: "#fff",
              textAlign: "center",
              fontSize: "1rem",
            }}
            required
          />

          <button
            type="submit"
            style={{
              width: "100%",
              padding: "1rem",
              backgroundColor: "rgba(255, 50, 50, 0.9)",
              color: "#fff",
              border: "none",
              borderRadius: "10px",
              cursor: "pointer",
              fontSize: "1.2rem",
              fontFamily: "'Winky Sans', sans-serif",
              fontWeight: "bold",
              transition: "all 0.3s ease",
            }}
            onMouseEnter={(e) => {
              e.target.style.transform = "scale(1.05)";
            }}
            onMouseLeave={(e) => {
              e.target.style.transform = "scale(1)";
            }}
          >
            Sign Up
          </button>
        </form>

        <p
          style={{
            marginTop: "1.5rem",
            textAlign: "center",
            fontSize: "1rem",
            fontFamily: "'Winky Sans', sans-serif",
          }}
        >
          Already have an account?{" "}
          <a
            href="/login"
            style={{
              color: "rgba(255, 50, 50, 0.9)",
              textDecoration: "none",
              fontWeight: "bold",
            }}
          >
            Login
          </a>
        </p>
      </div>
    </div>
  );
};

export default Signup;
