import React, { useState, useEffect } from 'react';
import './AdvertisementPopup.css';

const AdvertisementPopup = ({ onClose }) => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setVisible(true), 100); // Delay to trigger transition
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className={`popup-overlay ${visible ? 'popup-visible' : ''}`}>
      <div className="popup-content">
        <h2>Stay Fit and Healthy!</h2>
        <p>Discover the best exercises and nutrition tips to maintain your health.</p>
        <img
          src="https://via.placeholder.com/300x200?text=Fitness+Ad"
          alt="Fitness Advertisement"
          className="popup-image"
        />
        <button
          className="popup-close-button"
          onClick={() => {
            console.log('Close button clicked'); // Debug log
            if (onClose) {
              console.log('Triggering onClose callback'); // Debug log
              onClose();
            } else {
              console.error('onClose callback is not defined'); // Error log
            }
          }}
        >
          Close
        </button>
      </div>
    </div>
  );
};

export default AdvertisementPopup;
