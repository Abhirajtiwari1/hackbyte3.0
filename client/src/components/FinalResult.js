import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "./AuthContext";
import "../css/Result.css";

const FinalResult = () => {
  let { user } = useAuth();
  const navigate = useNavigate();
  const [newPlayers, setNewPlayers] = useState([]);
  const [userID, setUserID] = useState("");
  const [oldPlayers, setOldPlayers] = useState([]);
  const [matchResults, setMatchResults] = useState([]);
  const { roomId } = useParams();
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        user = JSON.parse(localStorage.getItem("user"));
        setUserID(user.id);
        if (!user) navigate("/login");

        const response = await axios.get("https://code-1v1-tournament-platform-backend.vercel.app/api/tournament/getTournamentDetails", {
          params: { roomId }
        });

        const { OldPlayers, Players, Admin } = response.data;
        if (Admin === user.id) setIsAdmin(true);
        setOldPlayers(OldPlayers);
        setNewPlayers(Players);
      } catch (error) {
        console.error("Error fetching results:", error);
      }
    };

    fetchData();
  }, [userID, navigate, roomId]);

  useEffect(() => {
    const checkEnd = async () => {
      try {
        const response = await axios.get("https://code-1v1-tournament-platform-backend.vercel.app/api/tournament/getTournamentDetails", {
          params: { roomId }
        });
        const { isRunning } = response.data;
        if (!isRunning) navigate(`/room/${roomId}`);
      } catch (error) {
        console.error("Error checking end:", error);
        navigate(`/room/${roomId}`);
      }
    };

    checkEnd();
    const interval = setInterval(checkEnd, 2000);
    return () => clearInterval(interval);
  }, [userID, navigate, roomId]);

  useEffect(() => {
    const calculateMatchResults = () => {
      const results = [];
      const newPlayersSet = new Set(newPlayers.map(player => player.name));
      const numPlayers = oldPlayers.length;

      for (let i = 0; i < numPlayers; i += 2) {
        const player1 = oldPlayers[i];
        const player2 = i + 1 < numPlayers ? oldPlayers[i + 1] : null;
        const winner = newPlayersSet.has(player1.name)
          ? player1.name
          : player2 && newPlayersSet.has(player2.name)
          ? player2.name
          : "Bot";
        results.push([player1.name, player2 ? player2.name : "Bot", winner]);
      }

      setMatchResults(results);
    };

    calculateMatchResults();
  }, [oldPlayers, newPlayers]);

  const leaveTournament = () => {
    axios
      .post("https://code-1v1-tournament-platform-backend.vercel.app/api/tournament/leaveTournament", { roomId, userID })
      .then(() => navigate(`/room/${roomId}`))
      .catch(error => console.error("Error leaving tournament:", error));
  };

  const endTournament = () => {
    axios
      .post("https://code-1v1-tournament-platform-backend.vercel.app/api/tournament/endTournament", { roomId })
      .then(() => navigate(`/room/${roomId}`))
      .catch(error => console.error("Error ending tournament:", error));
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
        fontFamily: "'Roboto', sans-serif",
        padding: "20px",
        textAlign: "center"
      }}
    >
      {matchResults && (
        <h1 style={{ marginTop: "5rem", fontSize: "40px", fontFamily: "Arial, sans-serif", color: "white" }}>
          Congratulations to{" "}
          {matchResults
            .filter(match => match[2] !== "Bot")
            .map((match, index) => (
              <span key={index} style={{ fontSize: "40px", fontWeight: "bold", color: "#FFA500" }}>
                {match[2]}
                {index !== matchResults.length - 1
                  ? index === matchResults.length - 2
                    ? " and "
                    : ", "
                  : "!"}
              </span>
            ))}
        </h1>
      )}

      <center style={{ marginTop: "3rem" }}>
        <h2>Final Round Results:</h2>
      </center>
      <div className="match-results-table" style={{ width: "50%" }}>
        <table className="match-results-table__table" style={{ marginTop: "1rem" }}>
          <thead>
            <tr>
              <th className="match-results-table__header">Match</th>
              <th className="match-results-table__header">Winner</th>
            </tr>
          </thead>
          <tbody>
            {matchResults?.map((match, index) => (
              <tr key={index}>
                <td className="match-results-table__cell">{match[0]} vs {match[1]}</td>
                <td className="match-results-table__cell">{match[2]}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div style={{ position: "absolute", marginTop: "15rem" }}>
        <button
          style={{
            marginTop: "3rem",
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
            display: "inline-block"
          }}
          onMouseEnter={e => {
            e.target.style.backgroundColor = "#c0392b";
            e.target.style.transform = "scale(1.05)";
          }}
          onMouseLeave={e => {
            e.target.style.backgroundColor = "#e74c3c";
            e.target.style.transform = "scale(1)";
          }}
          onClick={isAdmin ? endTournament : leaveTournament}
        >
          {isAdmin ? "End Tournament" : "Leave Tournament"}
        </button>
      </div>
    </div>
  );
};

export default FinalResult;
