import React, { useState, useContext } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Popup from '../components/Popup'; 
import { AuthContext } from '../context/AuthContext'; 
import '../styles/LoginPage.css';
import { SERVER_BaseURL } from '../config';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [showPopup, setShowPopup] = useState(false);
  const { login } = useContext(AuthContext); 
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(`${SERVER_BaseURL}/api/auth/login`, { email, password });
      
      // Save token and user info to context
      const { authToken, user } = response.data;
      login(authToken, user);

      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'An error occurred.');
      setShowPopup(true);
    }
  };

  return (
    <div className="login-container-wrapper">
      <div className="login-container">
        <h2>Login</h2>
        {showPopup && <Popup message={error} onClose={() => setShowPopup(false)} />}
        <form onSubmit={handleSubmit}>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button type="submit">Login</button>
        </form>
        <p>
          Don’t have an account ?{" "}<a href="/signup">Sign up</a>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;
