import React, { useState, useEffect } from 'react';
import Login from './components/Login';
import Advertisement from './components/Advertisement';
import AdvertisementPopup from './components/AdvertisementPopup';
import FrontendLogger from './components/FrontendLogger';
import Logger from './components/Logger';

const App = () => {
  const [currentStep, setCurrentStep] = useState('popup'); // Manage the current step in the flow

  useEffect(() => {
    console.log('Current step:', currentStep); // Debug log for state transitions
  }, [currentStep]);

  const handlePopupClose = () => {
    setCurrentStep('login'); // Transition to the login step
  };

  const handleLogin = () => {
    setCurrentStep('frontendLogger'); // Transition to the FrontendLogger step
  };

  const handleFrontendLoggerComplete = () => {
    setCurrentStep('logger'); // Transition to the Logger step
  };

  const handleLogout = () => {
    setCurrentStep('popup'); // Reset to the popup step
  };

  const handleGoBack = () => {
    setCurrentStep('login'); // Navigate back to the login step
  };

  return (
    <div>
      {currentStep === 'popup' && (
        <AdvertisementPopup onClose={handlePopupClose} />
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
        <FrontendLogger
          onComplete={handleFrontendLoggerComplete}
          onLogout={handleLogout}
          onGoBack={handleGoBack}
        />
      )}
      {currentStep === 'logger' && <Logger />}
    </div>
  );
};

export default App;
