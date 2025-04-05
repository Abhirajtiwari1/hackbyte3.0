import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "./AuthContext";
import IDE from "./IDE";
import Problem from "./Problem";

const Round = () => {
  let { user } = useAuth();
  const [userID, setUserID] = useState("");
  const navigate = useNavigate();
  const { roomId } = useParams();
  const [gamer, setGamer] = useState("");
  const [opponentName, setOpponentName] = useState("");
  const [rnd, setRnd] = useState(null);
  const [pID, setPID] = useState("");
  const [isAdmin, setIsAdmin] = useState(false);
  const [minutes, setMinutes] = useState("00");
  const [seconds, setSeconds] = useState("30");
  const [resultCalculated, setResultCalculated] = useState(true);

  useEffect(() => {
    user = JSON.parse(localStorage.getItem("user"));
    setUserID(user.id);
    if (!user) {
      navigate("/login");
    } else {
      const fetchData = async () => {
        try {
          const response = await axios.get("https://code-1v1-tournament-platform-backend.vercel.app/api/tournament/getTournamentDetails", { params: { roomId } });
          const { Players, roundNo, Admin, isResultCalculated } = response.data;
          setResultCalculated(isResultCalculated);
          if (Admin === user.id) setIsAdmin(true);
          setRnd(roundNo);

          const userIndex = Players.findIndex(player => player.id === user.id);
          if (userIndex === -1) {
            console.log("Can't find user in players array");
            navigate(`/room/${roomId}/tournament`);
            return;
          }

          setGamer(Players[userIndex]);
          const oppoIndex = userIndex % 2 === 0 ? userIndex + 1 : userIndex - 1;
          setOpponentName(Players[oppoIndex]?.name || 'Bot');

          const res = await axios.get("https://code-1v1-tournament-platform-backend.vercel.app/api/tournament/match/getProblemID", { params: { ID: user.id } });
          const { problemID } = res.data;
          setPID(problemID);
        } catch (error) {
          console.error('Error fetching match:', error);
        }
      };

      fetchData();
    }
  }, []);

  useEffect(() => {
    const fetchTime = async () => {
      try {
        const response = await axios.get("https://code-1v1-tournament-platform-backend.vercel.app/api/tournament/getTime", { params: { roomId } });
        const { startTime } = response.data;
        const currentTime = new Date();
        const difference = Math.abs(currentTime - new Date(startTime));
        const total = 10 * 60 * 1000;
        const left = total - difference;

        if (left <= 0) {
          if (!resultCalculated) {
            try {
              await axios.post("https://code-1v1-tournament-platform-backend.vercel.app/api/tournament/match/calculateResult", { roomId });
              setResultCalculated(true);
            } catch (error) {
              console.error("Error calculating result:", error);
            }
          }
          navigate(`/room/${roomId}/tournament`);
        } else {
          const mins = Math.floor(left / (60 * 1000)).toString().padStart(2, "0");
          const secs = Math.floor((left % (60 * 1000)) / 1000).toString().padStart(2, "0");
          setMinutes(mins);
          setSeconds(secs);
        }
      } catch (error) {
        console.error("Error fetching time:", error);
      }
    };

    fetchTime();
    const interval = setInterval(fetchTime, 5000);
    return () => clearInterval(interval);
  }, [roomId, resultCalculated]);

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
        padding: "20px"
      }}
    >
      <center>
        {rnd && <h1>Round No. - {rnd}</h1>}
        <div
          style={{
            marginTop: "1rem",
            fontSize: "20px",
            fontWeight: "bold",
            color: "#ff4f58",
            padding: "5px"
          }}
        >
          <p>Time Left - {minutes}:{seconds} (updates every 5 seconds)</p>
        </div>
      </center>

      <div
        style={{
          marginTop: "1rem",
          textAlign: "center",
          backgroundColor: "#f0f0f0",
          padding: "15px",
          color: "#000"
        }}
      >
        <span style={{ fontSize: "30px", fontWeight: "bold" }}>{gamer?.name}</span>
        <span style={{ fontSize: "18px", margin: "0 10px" }}>vs</span>
        <span style={{ fontSize: "15px", fontWeight: "bold" }}>{opponentName}</span>
      </div>

      {pID === "" ? (
        <></>
      ) : (
        <div style={{ display: "flex", width: "100%" }}>
          <div style={{ flex: 1 }}>
            <Problem problemId={pID} />
          </div>
          <div style={{ flex: 1 }}>
            {userID && <IDE userID={userID} problemID={pID} />}
          </div>
        </div>
      )}
    </div>
  );
};

export default Round;
