import React, { useState, useEffect } from 'react';
import './FrontendLogger.css'; // Import the CSS file for styling
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';
import { Line } from 'react-chartjs-2'; // Import chart library
import CaloriesBurntPage from './CaloriesBurntPage';
import BMIProgressPage from './BMIProgressPage';
import { saveUserProfile, loadUserProfile } from '../utils/userProfileUtils'; // Ensure both functions are imported

// Register required components for Chart.js
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

const FrontendLogger = ({ onComplete, onLogout, username = 'User' }) => { // Add username prop
  const [logHistory, setLogHistory] = useState([]);
  const [data, setData] = useState({
    exercise: '',
    exerciseDuration: '',
    caloriesBurnt: '',
    meal: '',
    calories: '',
  });
  const [userProfile, setUserProfile] = useState(loadUserProfile()); // Load user profile from localStorage
  const [currentPage, setCurrentPage] = useState('main');
  const [showUserDetails, setShowUserDetails] = useState(false);
  const [showSidebar, setShowSidebar] = useState(false);
  const [previousPage, setPreviousPage] = useState('main'); // Track the previous page
  const [isEditing, setIsEditing] = useState(false); // State to toggle edit mode
  const [editedData, setEditedData] = useState({ weight: '', height: '' }); // Temporary state for editing
  const [showPrompt, setShowPrompt] = useState(true); // State to show the "Set your information first" prompt
  const [showUserActivity, setShowUserActivity] = useState(false); // State to toggle user activity dropdown

  useEffect(() => {
    if (!userProfile.weight || !userProfile.height) {
      setShowPrompt(true); // Show prompt if weight and height are not set
    } else {
      setShowPrompt(false); // Hide prompt if weight and height are already set
    }
  }, [userProfile]);

  const updateBMI = (weight, height) => {
    return (weight / ((height / 100) ** 2)).toFixed(2);
  };

  const handleExerciseLog = () => {
    const caloriesBurnt = (parseFloat(data.exerciseDuration) * 8).toFixed(2); // Example: 8 calories per minute
    const weightLoss = (caloriesBurnt / 7700).toFixed(2); // 7700 calories = 1 kg
    const updatedWeight = (parseFloat(userProfile.weight) - weightLoss).toFixed(2);
    const updatedBMI = updateBMI(updatedWeight, userProfile.height);

    const updatedProfile = {
      ...userProfile,
      weight: updatedWeight,
      bmi: updatedBMI,
    };

    setUserProfile(updatedProfile);
    saveUserProfile(updatedProfile);

    const updatedLog = {
      type: 'exercise', // Categorize as exercise log
      exercise: data.exercise,
      exerciseDuration: data.exerciseDuration,
      caloriesBurnt: caloriesBurnt,
      timestamp: new Date().toLocaleString(),
    };

    setLogHistory((prevLogs) => [...prevLogs, updatedLog]);
    setData((prevData) => ({ ...prevData, exercise: '', exerciseDuration: '' }));
  };

  const handleMealLog = () => {
    const caloriesIntake = parseFloat(data.calories) || 0;
    const weightGain = (caloriesIntake / 7700).toFixed(2); // 7700 calories = 1 kg
    const updatedWeight = (parseFloat(userProfile.weight) + parseFloat(weightGain)).toFixed(2);
    const updatedBMI = updateBMI(updatedWeight, userProfile.height);

    const updatedProfile = {
      ...userProfile,
      weight: updatedWeight,
      bmi: updatedBMI,
    };

    setUserProfile(updatedProfile);
    saveUserProfile(updatedProfile);

    const updatedLog = {
      type: 'meal', // Categorize as meal log
      meal: data.meal,
      mealTime: new Date().toLocaleTimeString(), // Add meal time
      caloriesIntake: caloriesIntake,
      timestamp: new Date().toLocaleString(),
    };

    setLogHistory((prevLogs) => [...prevLogs, updatedLog]);
    setData((prevData) => ({ ...prevData, meal: '', calories: '' }));
  };

  // Prepare data for the charts
  const chartData = {
    labels: logHistory.map((log) => log.timestamp || 'Unknown'),
    datasets: [
      {
        label: 'Calories Tracking',
        data: logHistory.map((log) => {
          if (log.type === 'exercise') {
            return -parseFloat(log.caloriesBurnt) || 0; // Negative for calories burnt
          } else if (log.type === 'meal') {
            return parseFloat(log.caloriesIntake) || 0; // Positive for calories intake
          }
          return 0;
        }),
        borderColor: '#3B82F6',
        backgroundColor: 'rgba(59, 130, 246, 0.2)',
        fill: true,
      },
      {
        label: 'BMI Progress',
        data: logHistory.map((_, index) => {
          const initialWeight = parseFloat(userProfile.weight);
          const cumulativeCalories = logHistory
            .slice(0, index + 1)
            .reduce((sum, log) => {
              if (log.type === 'exercise') {
                return sum - (parseFloat(log.caloriesBurnt) || 0);
              } else if (log.type === 'meal') {
                return sum + (parseFloat(log.caloriesIntake) || 0);
              }
              return sum;
            }, 0);
          const weight = initialWeight + cumulativeCalories / 7700; // Adjust weight based on cumulative calories
          return weight && userProfile.height
            ? (weight / ((userProfile.height / 100) ** 2)).toFixed(2)
            : null;
        }),
        borderColor: '#10B981',
        backgroundColor: 'rgba(16, 185, 129, 0.2)',
        fill: true,
      },
    ],
  };

  const calculateRecommendations = () => {
    if (logHistory.length === 0) return 'No data available for recommendations.';

    const totalCaloriesChange = logHistory.reduce((sum, log) => {
      if (log.type === 'exercise') {
        return sum - (parseFloat(log.caloriesBurnt) || 0);
      } else if (log.type === 'meal') {
        return sum + (parseFloat(log.caloriesIntake) || 0);
      }
      return sum;
    }, 0);

    const currentWeight = parseFloat(userProfile.weight) + totalCaloriesChange / 7700;
    const currentBMI = currentWeight && userProfile.height
      ? (currentWeight / ((userProfile.height / 100) ** 2)).toFixed(2)
      : null;

    let recommendation = 'Keep up the good work!';
    if (currentBMI > 25) {
      recommendation = 'Consider reducing calorie intake and increasing physical activity.';
    } else if (currentBMI < 18.5) {
      recommendation = 'Consider increasing calorie intake with a balanced diet.';
    }

    return `Current BMI: ${currentBMI || 'N/A'}\nRecommendation: ${recommendation}`;
  };

  const calculateCaloriesRecommendations = () => {
    if (logHistory.length === 0) return 'No data available for recommendations.';

    const totalCaloriesBurnt = logHistory.reduce((sum, log) => {
      if (log.type === 'exercise') {
        return sum + (parseFloat(log.caloriesBurnt) || 0);
      }
      return sum;
    }, 0);

    const totalCaloriesIntake = logHistory.reduce((sum, log) => {
      if (log.type === 'meal') {
        return sum + (parseFloat(log.caloriesIntake) || 0);
      }
      return sum;
    }, 0);

    const calorieBalance = totalCaloriesIntake - totalCaloriesBurnt;

    let recommendation = 'Your calorie balance is on track!';
    if (calorieBalance > 500) {
      recommendation = 'Consider reducing your calorie intake or increasing physical activity.';
    } else if (calorieBalance < -500) {
      recommendation = 'Consider increasing your calorie intake to maintain energy levels.';
    }

    return `Total Calories Burnt: ${totalCaloriesBurnt.toFixed(2)} kcal\n` +
           `Total Calories Intake: ${totalCaloriesIntake.toFixed(2)} kcal\n` +
           `Calorie Balance: ${calorieBalance.toFixed(2)} kcal\n` +
           `Recommendation: ${recommendation}`;
  };

  const lastLog = logHistory[logHistory.length - 1] || data; // Use the last log or fallback to default data

  const handleMenuToggle = () => {
    setPreviousPage(currentPage); // Save the current page as the previous page
    setShowSidebar((prev) => !prev); // Toggle the sidebar
  };

  const handleGoBack = () => {
    if (showSidebar) {
      setShowSidebar(false); // Close the sidebar
    } else {
      setCurrentPage(previousPage); // Navigate back to the previous page
    }
  };

  const handlePromptClick = () => {
    setShowPrompt(false); // Hide the prompt when clicked
  };

  const saveEditedDetails = () => {
    if (!editedData.weight || !editedData.height) {
      alert('Please enter both weight and height.');
      return;
    }

    const updatedBMI = updateBMI(parseFloat(editedData.weight), parseFloat(editedData.height));
    const updatedProfile = {
      ...userProfile,
      weight: parseFloat(editedData.weight),
      height: parseFloat(editedData.height),
      bmi: updatedBMI,
    };

    setUserProfile(updatedProfile);
    saveUserProfile(updatedProfile); // Save updated profile to localStorage
    setIsEditing(false); // Exit edit mode
    setEditedData({ weight: '', height: '' }); // Reset editedData
  };

  const saveInitialDetails = () => {
    if (!editedData.weight || !editedData.height) {
      alert('Please enter both weight and height.');
      return;
    }

    const updatedBMI = updateBMI(parseFloat(editedData.weight), parseFloat(editedData.height));
    const updatedProfile = {
      ...userProfile,
      weight: parseFloat(editedData.weight),
      height: parseFloat(editedData.height),
      bmi: updatedBMI,
    };

    setUserProfile(updatedProfile);
    saveUserProfile(updatedProfile); // Save updated profile to localStorage
    setShowPrompt(false); // Hide the prompt
    setEditedData({ weight: '', height: '' }); // Reset editedData
  };

  if (currentPage === 'caloriesBurnt') {
    return (
      <CaloriesBurntPage
        chartData={chartData}
        onGoBack={handleGoBack}
        recommendations={calculateCaloriesRecommendations()} // Pass calorie-specific recommendations
      />
    );
  }

  if (currentPage === 'bmiProgress') {
    return (
      <BMIProgressPage
        chartData={chartData}
        onGoBack={handleGoBack}
        recommendations={calculateRecommendations()}
      />
    );
  }

  return (
    <div className="logger-container">
      {/* Menu Button */}
      <button className="menu-button" onClick={handleMenuToggle}>
        ☰
      </button>

      {/* Sidebar */}
      {showSidebar && (
        <div className="sidebar">
          <button className="sidebar-button" onClick={handleGoBack}>
            Go Back
          </button>
          <h2>Dashboard</h2>
          <div className="sidebar-section">
            <h3
              className="user-activity-header"
              onClick={() => setShowUserActivity((prev) => !prev)} // Toggle user activity dropdown
              style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}
            >
              User Activity
              <span>{showUserActivity ? '▲' : '▼'}</span> {/* Arrow indicator */}
            </h3>
            {showUserActivity && ( // Conditionally render the dropdown content
              <ul>
                {logHistory.map((log, index) => (
                  <li key={index}>
                    {log.timestamp}: {log.type === 'exercise' ? (
                      <>
                        {log.exercise} for {log.exerciseDuration} mins
                      </>
                    ) : (
                      <>
                        {log.meal} at {log.mealTime}
                      </>
                    )}
                  </li>
                ))}
              </ul>
            )}
          </div>
          <div className="sidebar-section">
            <button className="sidebar-chart-button" onClick={() => setCurrentPage('caloriesBurnt')}>
              View Calories Burnt Chart
            </button>
            <button className="sidebar-chart-button" onClick={() => setCurrentPage('bmiProgress')}>
              View BMI Progress Chart
            </button>
          </div>
        </div>
      )}

      {/* User Profile Section */}
      <div className="user-profile">
        <div
          className="user-profile-initial"
          onClick={() => setShowUserDetails((prev) => !prev)} // Toggle user details
        >
          M
        </div>
        {showUserDetails && (
          <div className="user-details-dropdown">
            {(!userProfile.weight || !userProfile.height) ? (
              <>
                <p>Please enter your weight and height to continue:</p>
                <p>
                  <strong>Weight:</strong>
                  <input
                    type="number"
                    value={editedData.weight}
                    onChange={(e) => setEditedData((prev) => ({ ...prev, weight: e.target.value }))}
                    placeholder="Enter weight (kg)"
                  />
                </p>
                <p>
                  <strong>Height:</strong>
                  <input
                    type="number"
                    value={editedData.height}
                    onChange={(e) => setEditedData((prev) => ({ ...prev, height: e.target.value }))}
                    placeholder="Enter height (cm)"
                  />
                </p>
                <button onClick={saveInitialDetails}>Save</button>
              </>
            ) : isEditing ? (
              <>
                <p>
                  <strong>Weight:</strong>
                  <input
                    type="number"
                    value={editedData.weight}
                    onChange={(e) => setEditedData((prev) => ({ ...prev, weight: e.target.value }))}
                    placeholder="Enter weight"
                  />
                </p>
                <p>
                  <strong>Height:</strong>
                  <input
                    type="number"
                    value={editedData.height}
                    onChange={(e) => setEditedData((prev) => ({ ...prev, height: e.target.value }))}
                    placeholder="Enter height"
                  />
                </p>
                <button onClick={saveEditedDetails}>Save</button>
                <button onClick={() => setIsEditing(false)}>Cancel</button>
              </>
            ) : (
              <>
                <p><strong>Username:</strong> {username}</p>
                <p><strong>Weight:</strong> {userProfile.weight || 'N/A'} kg</p>
                <p><strong>Height:</strong> {userProfile.height || 'N/A'} cm</p>
                <p><strong>BMI:</strong> {userProfile.bmi || 'N/A'}</p>
                <button onClick={() => {
                  setIsEditing(true);
                  setEditedData({ weight: userProfile.weight, height: userProfile.height }); // Initialize editedData
                }}>
                  Edit
                </button>
                <button onClick={onLogout}>Logout</button> {/* Logout button */}
              </>
            )}
          </div>
        )}
      </div>

      {/* Prompt to set user information */}
      {showPrompt && (
        <div className="set-info-prompt">
          <p>Please set your weight and height in the profile section.</p>
        </div>
      )}

      <div className="card">
        <h1>Fitness & Nutrition Tracker</h1>

        {/* Section 1: Exercise Logging */}
        <h2>Log Exercise</h2>
        <div className="input-grid">
          <input
            type="text"
            placeholder="Exercise"
            value={data.exercise}
            onChange={(e) => setData((prev) => ({ ...prev, exercise: e.target.value }))}
          />
          <input
            type="number"
            placeholder="Exercise Duration (minutes)"
            value={data.exerciseDuration}
            onChange={(e) => setData((prev) => ({ ...prev, exerciseDuration: e.target.value }))}
          />
        </div>
        <p>Calories Burnt: {(parseFloat(data.exerciseDuration) * 8).toFixed(2)} kcal</p>
        <button className="save-button" onClick={handleExerciseLog}>
          Save Exercise Log
        </button>

        {/* Section 2: Meal Logging */}
        <h2>Log Meal</h2>
        <div className="input-grid">
          <input
            type="text"
            placeholder="Meal"
            value={data.meal}
            onChange={(e) => setData((prev) => ({ ...prev, meal: e.target.value }))}
          />
          <input
            type="number"
            placeholder="Calories"
            value={data.calories}
            onChange={(e) => setData((prev) => ({ ...prev, calories: e.target.value }))}
          />
        </div>
        <p>Calories Intake: {parseFloat(data.calories) || 0} kcal</p>
        <button className="save-button" onClick={handleMealLog}>
          Save Meal Log
        </button>

        <h2>Logged Data</h2>
        <div className="log-history">
          {logHistory.length > 0 ? (
            logHistory.map((log, index) => (
              <div key={index} className="log-item">
                <h3>Logged Data {index + 1}</h3>
                <p><strong>Timestamp:</strong> {log.timestamp}</p>
                {log.type === 'exercise' && (
                  <>
                    <p><strong>Exercise Type:</strong> {log.exercise}</p>
                    <p><strong>Exercise Duration:</strong> {log.exerciseDuration} mins</p>
                    <p><strong>Calories Burnt:</strong> {log.caloriesBurnt} kcal</p>
                  </>
                )}
                {log.type === 'meal' && (
                  <>
                    <p><strong>Meal Type:</strong> {log.meal}</p>
                    <p><strong>Meal Time:</strong> {log.mealTime}</p>
                    <p><strong>Calories Intake:</strong> {log.caloriesIntake} kcal</p>
                  </>
                )}
              </div>
            ))
          ) : (
            <p>No logged data yet.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default FrontendLogger;