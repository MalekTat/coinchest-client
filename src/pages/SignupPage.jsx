import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "../styles/SignupPage.css";
import Popup from "../components/Popup"; 
import { SERVER_BaseURL } from "../config";

const SignupPage = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [profilePhoto, setProfilePhoto] = useState(null);
  const [error, setError] = useState("");
  const [showPopup, setShowPopup] = useState(false); 
  const navigate = useNavigate();

  const handleFileChange = (e) => {
    setProfilePhoto(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("username", username);
    formData.append("email", email);
    formData.append("password", password);
    if (profilePhoto) {
      formData.append("profilePhoto", profilePhoto);
    }

    try {
      await axios.post(`${SERVER_BaseURL}/api/auth/signup`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      navigate("/login");
    } catch (err) {
      setError(err.response?.data?.message || "An error occurred.");
      setShowPopup(true); 
    }
  };

  return (
    <div className="signup-container-wrapper">
      <div className="signup-container">
        <h2>Sign Up</h2>
        {showPopup && <Popup message={error} onClose={() => setShowPopup(false)} />}
        <form onSubmit={handleSubmit} encType="multipart/form-data">
          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
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
          <input
            type="file"
            onChange={handleFileChange}
            accept="image/*"
          />
          <button type="submit">Sign Up</button>
        </form>
        <p>
          Already have an account? <a href="/login">Login</a>
        </p>
      </div>
    </div>
  );
};

export default SignupPage;
