import React, { useState, useEffect } from 'react';
import Login from './components/Login'; // Ensure this matches the export type
import Advertisement from './components/Advertisement'; // Ensure this matches the export type
import AdvertisementPopup from './components/AdvertisementPopup'; // Ensure this matches the export type
import FrontendLogger from './components/FrontendLogger'; // Ensure this matches the export type
import Logger from './components/Logger'; // Ensure this matches the export type

const App = () => {
  const [currentStep, setCurrentStep] = useState('popup'); // Manage the current step in the flow

  useEffect(() => {
    console.log('Current step:', currentStep); // Debug log for state transitions
  }, [currentStep]);

  const handlePopupClose = () => {
    console.log('AdvertisementPopup close button pressed'); // Debug log
    setCurrentStep('login'); // Transition to the login step
    console.log('Navigating to login step'); // Debug log
  };

  const handleLogin = () => {
    setCurrentStep('frontendLogger'); // Transition to the FrontendLogger step
  };

  const handleFrontendLoggerComplete = () => {
    setCurrentStep('logger'); // Transition to the Logger step
  };

  return (
    <div>
      {/* Render components based on the current step */}
      {currentStep === 'popup' && (
        <AdvertisementPopup
          onClose={() => {
            console.log('onClose callback triggered'); // Debug log
            handlePopupClose();
          }}
        />
      )}
      {currentStep === 'login' && (
        <div>
          <div style={{ display: 'flex', justifyContent: 'flex-end', padding: '10px' }}>
            <Login onLogin={handleLogin} />
          </div>
          <Advertisement />
        </div>
      )}
      {currentStep === 'frontendLogger' && (
        <FrontendLogger onComplete={handleFrontendLoggerComplete} />
      )}
      {currentStep === 'logger' && <Logger />}
    </div>
  );
};

export default App;
