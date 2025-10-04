import React from 'react';
import './Advertisement.css'; // Import CSS for styling

const Advertisement = () => {
  return (
    <div className="advertisement-container">
      <h1 className="advertisement-title">Welcome to Fitness & Nutrition Tracker</h1>
      <p className="advertisement-description">
        Track your fitness progress and maintain a healthy lifestyle with our app.
      </p>
      <div className="advertisement-section">
        <div className="advertisement-item">
          <img
            src="https://example.com/exercise-photo.jpg"
            alt="Exercise"
            className="advertisement-image"
          />
          <p>Stay active with regular exercise.</p>
        </div>
        <div className="advertisement-item">
          <img
            src="https://example.com/healthy-nutrition.jpg"
            alt="Nutrition"
            className="advertisement-image"
          />
          <p>Maintain a balanced diet for better health.</p>
        </div>
      </div>
    </div>
  );
};

export default Advertisement;
