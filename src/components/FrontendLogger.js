import React, { useState } from 'react';
import './FrontendLogger.css'; // Import the CSS file for styling

const FrontendLogger = ({ onComplete }) => {
  const [logHistory, setLogHistory] = useState([]);
  const [data, setData] = useState({
    exercise: '',
    exerciseDuration: '',
    meal: '',
    calories: '',
    weight: '',
    height: '',
  });
  const [selectedLogs, setSelectedLogs] = useState({ first: null, second: null });
  const [comparisonResult, setComparisonResult] = useState(null);

  const handleInputChange = (field, value) => {
    setData((prevData) => ({
      ...prevData,
      [field]: value,
    }));
  };

  const handleSaveLog = () => {
    const timestamp = new Date().toLocaleString();
    const newLog = {
      id: logHistory.length + 1,
      timestamp,
      ...data,
    };

    setLogHistory((prevLogs) => [...prevLogs, newLog]);
    setData({ exercise: '', exerciseDuration: '', meal: '', calories: '', weight: '', height: '' });

    // Scroll to the top of the page after saving the log
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleCompare = () => {
    const { first, second } = selectedLogs;
    if (first === null || second === null || first === second) {
      setComparisonResult('Please select two different logged entries.');
      // Ensure the page scrolls to the top even for error messages
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    const log1 = logHistory[first];
    const log2 = logHistory[second];

    const bmi1 = log1.weight && log1.height ? (log1.weight / ((log1.height / 100) ** 2)).toFixed(2) : null;
    const bmi2 = log2.weight && log2.height ? (log2.weight / ((log2.height / 100) ** 2)).toFixed(2) : null;

    const bmiDifference = bmi1 && bmi2 ? (bmi1 - bmi2).toFixed(2) : 'N/A';
    const recommendation =
      bmiDifference > 0
        ? 'Consider reducing calorie intake and increasing physical activity.'
        : bmiDifference < 0
        ? 'Great progress! Maintain a balanced diet and regular exercise.'
        : 'Your BMI is consistent. Keep up the good work!';

    setComparisonResult({
      log1,
      log2,
      bmiDifference,
      recommendation,
    });

    // Scroll to the top of the page after comparing logs
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="logger-container">
      <div className="card">
        <h1>Fitness & Nutrition Tracker</h1>
        <h2>Log Your Data</h2>
        <div className="input-grid">
          <input
            type="text"
            placeholder="Exercise"
            value={data.exercise}
            onChange={(e) => handleInputChange('exercise', e.target.value)}
          />
          <input
            type="number"
            placeholder="Exercise Duration (minutes)"
            value={data.exerciseDuration}
            onChange={(e) => handleInputChange('exerciseDuration', e.target.value)}
          />
          <input
            type="text"
            placeholder="Meal"
            value={data.meal}
            onChange={(e) => handleInputChange('meal', e.target.value)}
          />
          <input
            type="number"
            placeholder="Calories"
            value={data.calories}
            onChange={(e) => handleInputChange('calories', e.target.value)}
          />
          <input
            type="number"
            placeholder="Weight (kg)"
            value={data.weight}
            onChange={(e) => handleInputChange('weight', e.target.value)}
          />
          <input
            type="number"
            placeholder="Height (cm)"
            value={data.height}
            onChange={(e) => handleInputChange('height', e.target.value)}
          />
        </div>
        <button className="save-button" onClick={handleSaveLog}>
          Save Log
        </button>
        <h2>Logged Data</h2>
        <div className="log-history">
          {logHistory.length > 0 ? (
            logHistory.map((log) => (
              <div key={log.id} className="log-item">
                <h3>Logged Data {log.id}</h3>
                <p><strong>Timestamp:</strong> {log.timestamp}</p>
                <p><strong>Exercise:</strong> {log.exercise || 'N/A'}</p>
                <p><strong>Exercise Duration:</strong> {log.exerciseDuration || 'N/A'} mins</p>
                <p><strong>Meal:</strong> {log.meal || 'N/A'}</p>
                <p><strong>Calories:</strong> {log.calories || 'N/A'}</p>
                <p><strong>Weight:</strong> {log.weight || 'N/A'} kg</p>
                <p><strong>Height:</strong> {log.height || 'N/A'} cm</p>
              </div>
            ))
          ) : (
            <p>No logged data yet.</p>
          )}
        </div>

        {logHistory.length > 1 && (
          <div className="compare-section">
            <h3>Compare Logs</h3>
            <div className="compare-selects">
              <select
                onChange={(e) => setSelectedLogs((prev) => ({ ...prev, first: parseInt(e.target.value, 10) }))}
              >
                <option value="">Select First Log</option>
                {logHistory.map((log, index) => (
                  <option key={index} value={index}>
                    Logged Data {log.id}
                  </option>
                ))}
              </select>
              <select
                onChange={(e) => setSelectedLogs((prev) => ({ ...prev, second: parseInt(e.target.value, 10) }))}
              >
                <option value="">Select Second Log</option>
                {logHistory.map((log, index) => (
                  <option key={index} value={index}>
                    Logged Data {log.id}
                  </option>
                ))}
              </select>
            </div>
            <button className="compare-button" onClick={handleCompare}>
              Compare
            </button>
          </div>
        )}

        {comparisonResult && (
          <div className="comparison-result">
            {typeof comparisonResult === 'string' ? (
              <p>{comparisonResult}</p>
            ) : (
              <>
                <h3>Comparison Result</h3>
                <p><strong>Log 1:</strong> {comparisonResult.log1.timestamp}</p>
                <p><strong>Log 2:</strong> {comparisonResult.log2.timestamp}</p>
                <p><strong>BMI Difference:</strong> {comparisonResult.bmiDifference}</p>
                <p><strong>Recommendation:</strong> {comparisonResult.recommendation}</p>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default FrontendLogger; // Ensure the component is exported as default