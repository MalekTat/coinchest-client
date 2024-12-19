import React, { useState, useContext } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Popup from '../components/Popup'; 
import ConfirmationModal from '../components/ConfirmationModal';
import { AuthContext } from '../context/AuthContext';
import { SERVER_BaseURL } from '../config';
import '../styles/ProfileEditPage.css'

const ProfileEditPage = () => {
  const { user, setUser, logout } = useContext(AuthContext); 
  const [username, setUsername] = useState(user?.username || '');
  const [email, setEmail] = useState(user?.email || '');
  const [password, setPassword] = useState('');
  const [profilePhoto, setProfilePhoto] = useState(null);
  const [message, setMessage] = useState(''); 
  const [showPopup, setShowPopup] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false); 
  const navigate = useNavigate();

  const handleFileChange = (e) => {
    setProfilePhoto(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append('username', username);
    formData.append('email', email);
    if (password) formData.append('password', password);
    if (profilePhoto) formData.append('profilePhoto', profilePhoto);

    try {
      const response = await axios.put(`${SERVER_BaseURL}/api/account/edit`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });

      
      setUser(response.data); 
      setMessage('Your account has been successfully updated!');
      setShowPopup(true); 
    } catch (err) {
      setMessage(err.response?.data?.message || 'An error occurred.');
      setShowPopup(true); 
    }
  };

  const handleDeleteAccount = async () => {
    try {
      await axios.delete(`${SERVER_BaseURL}/api/account/delete`, {
        headers: {
          authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      logout(); 
      navigate('/'); 
    } catch (err) {
      setMessage(err.response?.data?.message || 'An error occurred.');
      setShowPopup(true);
    }
  };

  return (
    <div className="edit-profile-container-wrapper">
      <div className="edit-profile-container">
        <h2>Edit Profile</h2>
        {showPopup && <Popup message={message} onClose={() => setShowPopup(false)} />}
        {showConfirmation && (
          <ConfirmationModal
            message="Are you sure you want to delete your account? This action cannot be undone."
            onConfirm={() => {
              setShowConfirmation(false);
              handleDeleteAccount();
            }}
            onCancel={() => setShowConfirmation(false)}
          />
        )}
        <div className="profile-photo-container">
          <img
            src={profilePhoto ? URL.createObjectURL(profilePhoto) : user?.profilePhoto || '/default-avatar.png'}
            alt="Profile"
            className="profile-photo-preview"
          />
          <button className="upload-button" onClick={() => document.getElementById('profilePhoto').click()}>
            ...
          </button>
          <input
            type="file"
            id="profilePhoto"
            onChange={handleFileChange}
            accept="image/*"
            hidden
          />
        </div>
        <form onSubmit={handleSubmit} encType="multipart/form-data" className="edit-profile-form">
          <div className="form-group">
            <label htmlFor="username">Username:</label>
            <input
              type="text"
              id="username"
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="email">Email:</label>
            <input
              type="email"
              id="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="password">New Password:</label>
            <input
              type="password"
              id="password"
              placeholder="New Password (Optional)"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <button type="submit" className="save-button">Save Changes</button>
        </form>
        <button className="delete-account-button" onClick={() => setShowConfirmation(true)}>
          Delete Account
        </button>
      </div>
    </div>
  );
};


export default ProfileEditPage;
