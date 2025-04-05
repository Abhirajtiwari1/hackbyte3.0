import React from "react";
import { motion } from "framer-motion";
import { Typewriter } from "react-simple-typewriter";

const Info = () => {
  // Container for the full screen background
  const gridStyle = {
    position: "relative",
    width: "100vw",
    minHeight: "100vh", // Change height to minHeight to allow scrolling
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    backgroundColor: "black",
    overflowX: "hidden", // Keep horizontal scroll disabled
  };
  

  // Grid overlay lines
  const gridOverlayStyle = {
    content: "''",
    position: "absolute",
    width: "100%",
    height: "100%",
    backgroundImage:
      "linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)",
    backgroundSize: "40px 40px",
    zIndex: 0,
  };

  // Wrapper for text
  const contentWrapperStyle = {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 1,
    textAlign: "center",
    marginTop: "0px", // Reset margin to prevent unwanted shifting
    paddingTop: "50px", // Adjust spacing as needed
  };
  

  const textStyle = {
    color: "white",
    fontSize: "5.5rem",
    fontWeight: "bold",
    fontFamily: "'Winky Sans', sans-serif",
    marginBottom: "0px", // No extra space below heading
    zIndex: 1,
  };

  const typewriterStyle = {
    color: "rgba(255, 50, 50, 0.9)",
    fontSize: "2rem",
    fontWeight: "500",
    fontFamily: "'Winky Sans', sans-serif",
    marginTop: "-10px", // Push typewriter closer to heading
    zIndex: 1,
  }; 


  

  // Card container
  const cardContainerStyle = {
    display: "flex",
    justifyContent: "center",
    alignItems: "flex-start",
    gap: "30px",
    marginTop: "40px",
    zIndex: 1,
  };

// Each card
const cardStyle = {
  width: "350px",
  height: "350px",
  backgroundColor: "#1a1a1a",
  borderRadius: "10px",
  boxShadow: "0 4px 10px rgba(0, 0, 0, 0.4)",
  overflow: "hidden",
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  padding: "15px", 
  boxShadow: "0 4px 10px rgba(255, 0, 0, 0.8)",
};

// Image in card
const cardImageStyle = {
  width: "100%", // Occupies full width of card
  height: "auto", // Adjusts height proportionally
  objectFit: "cover",
  borderRadius: "8px",
};

// Button below image
const cardButtonStyle = {
  padding: "10px 20px",
  backgroundColor: "rgba(255, 0, 0, 0.8)",
  color: "#fff",
  border: "none",
  borderRadius: "5px", 
  fontFamily: "'Winky Sans', sans-serif",
  fontSize: "1rem",
  cursor: "pointer", 
  marginTop: "50px", // Space between image and button
};

  


  return (
    <div style={gridStyle}>
      <div style={gridOverlayStyle}></div>

      {/* Content wrapper for alignment */}
      <div style={contentWrapperStyle}>
        <motion.h1
          style={textStyle}
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.5 }}
        >
          Welcome To Codium
        </motion.h1>

        {/* Typewriter Effect */}
        <div style={typewriterStyle}>
          <Typewriter
            words={["Innovate", "Build", "Inspire"]}
            loop={true}
            cursor
            cursorStyle="|"
            typeSpeed={80}
            deleteSpeed={50}
            delaySpeed={1000}
          />
        </div> 
       
       {/* cards */} 
       <div style={cardContainerStyle}>
  {/* Card 1 */}
  <div style={cardStyle}>
    <img
      src="https://plus.unsplash.com/premium_photo-1720287601920-ee8c503af775?fm=jpg&q=60&w=3000&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NXx8Y29kaW5nfGVufDB8fDB8fHww"
      alt="Card 1"
      style={cardImageStyle}
    />
    <button style={cardButtonStyle}>Colloborative Coding</button>
  </div>

  {/* Card 2 */}
  <div style={cardStyle}>
    <img
      src="https://plus.unsplash.com/premium_photo-1720287601920-ee8c503af775?fm=jpg&q=60&w=3000&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NXx8Y29kaW5nfGVufDB8fDB8fHww"
      alt="Card 2"
      style={cardImageStyle}
    />
    <button
      style={cardButtonStyle}
      onClick={() => {
      window.location.href = "/login";
      }}
    >
      1V1 Coding
    </button>
  </div>
</div>


          
      </div>
    </div>
  );
};

export default Info;