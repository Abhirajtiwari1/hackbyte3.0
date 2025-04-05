import React, { useState, useEffect } from "react";
import axios from "axios";
import { useAuth } from "./AuthContext";
import { useNavigate } from "react-router-dom";
import "../css/Login.css"; // keep this if you have styles there

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { login } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const isLoggedIn = localStorage.getItem("user");
    if (isLoggedIn) {
      navigate("/home");
    }
  }, [navigate]);

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        "https://code-1v1-tournament-platform-backend.vercel.app/api/auth/login",
        { email, password }
      );
      const userData = response.data;
      login(userData);
      navigate("/home");
    } catch (error) {
      console.error("Error logging in:", error);
      if (error.response?.status === 401) {
        alert("Invalid email or password!");
      } else {
        alert("An error occurred. Please try again later.");
      }
    }
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
        Welcome to the 1v1 Coding Arena
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
          Login
        </h2>

        <form
          onSubmit={handleLogin}
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
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
            Login
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
          Don't have an account?{" "}
          <a
            href="/signup"
            style={{
              color: "rgba(255, 50, 50, 0.9)",
              textDecoration: "none",
              fontWeight: "bold",
              fontFamily: "Winky Sans",
            }}
          >
            Sign Up
          </a>
        </p>
      </div>
    </div>
  );
};

export default Login;
