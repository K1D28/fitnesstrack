import React, { useState } from 'react';
import { saveUserProfile } from '../utils/userProfileUtils';

const Login = ({ onLogin }) => {
  const [credentials, setCredentials] = useState({ username: '', password: '' });
  const [userDetails, setUserDetails] = useState({ weight: '', height: '' });
  const [error, setError] = useState('');

  const handleLogin = () => {
    const { username, password } = credentials;
    const { weight, height } = userDetails;

    if (username === 'User' && password === 'Password') {
      if (!weight || !height) {
        setError('Please enter your weight and height.');
        return;
      }

      const bmi = (parseFloat(weight) / ((parseFloat(height) / 100) ** 2)).toFixed(2);
      saveUserProfile({ username, weight: parseFloat(weight), height: parseFloat(height), bmi });
      onLogin();
    } else {
      setError('Invalid username or password.');
    }
  };

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif', textAlign: 'center' }}>
      <h1>Login</h1>
      <div style={{ marginBottom: '20px' }}>
        <input
          type="text"
          placeholder="Username"
          value={credentials.username}
          onChange={(e) => setCredentials((prev) => ({ ...prev, username: e.target.value }))}
          style={{ padding: '10px', marginRight: '10px' }}
        />
        <input
          type="password"
          placeholder="Password"
          value={credentials.password}
          onChange={(e) => setCredentials((prev) => ({ ...prev, password: e.target.value }))}
          style={{ padding: '10px', marginRight: '10px' }}
        />
      </div>
      <div style={{ marginBottom: '20px' }}>
        <input
          type="number"
          placeholder="Weight (kg)"
          value={userDetails.weight}
          onChange={(e) => setUserDetails((prev) => ({ ...prev, weight: e.target.value }))}
          style={{ padding: '10px', marginRight: '10px' }}
        />
        <input
          type="number"
          placeholder="Height (cm)"
          value={userDetails.height}
          onChange={(e) => setUserDetails((prev) => ({ ...prev, height: e.target.value }))}
          style={{ padding: '10px', marginRight: '10px' }}
        />
      </div>
      <button
        onClick={handleLogin}
        style={{
          padding: '10px 20px',
          fontSize: '16px',
          backgroundColor: '#007BFF',
          color: '#FFF',
          border: 'none',
          borderRadius: '5px',
          cursor: 'pointer',
        }}
      >
        Login
      </button>
      {error && <p style={{ color: 'red' }}>{error}</p>}
    </div>
  );
};

export default Login;
