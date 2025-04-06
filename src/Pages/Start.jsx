import React from "react";
import "./start.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faStar } from "@fortawesome/free-solid-svg-icons";

const Start = () => {
  const floatingStars = Array.from({ length: 12 }); // Array of 12 stars 

  return (
    <div className="start-page">
      <h1>Welcome to the Start Page!</h1>

      {floatingStars.map((_, i) => {

        // randomize size and duration of the stars
        const size = 20 + Math.random() * 40;
        const duration = 15 + Math.random() * 10;

        // Distribute the stars across the screen
        const left = `${Math.random() * 50 + (i < 6 ? 0 : 50)}%`;

        return (
          <FontAwesomeIcon
            key={i}
            icon={faStar}
            className="floating-icon"
            style={{
              left,
              fontSize: `${size}px`,
              animationDuration: `${duration}s`,
              animationDelay: `${Math.random() * 10}s`,
            }}
          />
        );
      })}
    </div>
  );
};

export default Start;
