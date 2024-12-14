import React, { useState, useContext } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Popup from '../components/Popup'; 
import ConfirmationModal from '../components/ConfirmationModal';
import { AuthContext } from '../context/AuthContext';
import { SERVER_BaseURL } from '../config';
import '../styles/ProfileEditPage.css'

const ProfileEditPage = () => {
  const { user, setUser, logout } = useContext(AuthContext); // Add setUser for refreshing user data
  const [username, setUsername] = useState(user?.username || '');
  const [email, setEmail] = useState(user?.email || '');
  const [password, setPassword] = useState('');
  const [profilePhoto, setProfilePhoto] = useState(null);
  const [message, setMessage] = useState(''); // Success or error messages
  const [showPopup, setShowPopup] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false); // For delete confirmation modal
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

      
      setUser(response.data); // Update the user context with new data
      setMessage('Your account has been successfully updated!');
      setShowPopup(true); // Show success message
    } catch (err) {
      setMessage(err.response?.data?.message || 'An error occurred.');
      setShowPopup(true); // Show error popup
    }
  };

  const handleDeleteAccount = async () => {
    try {
      await axios.delete(`${SERVER_BaseURL}/api/account/delete`, {
        headers: {
          authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      logout(); // Clear user session
      navigate('/'); // Redirect to home
    } catch (err) {
      setMessage(err.response?.data?.message || 'An error occurred.');
      setShowPopup(true);
    }
  };

  return (
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
        <label htmlFor="profilePhoto" className="upload-label">
          Upload New Photo
          <input
            type="file"
            id="profilePhoto"
            onChange={handleFileChange}
            accept="image/*"
            hidden
          />
        </label>
      </div>
      <form onSubmit={handleSubmit} encType="multipart/form-data" className="edit-profile-form">
        <label htmlFor="username">Username:</label>
        <input
          type="text"
          id="username"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />
        <label htmlFor="email">Email:</label>
        <input
          type="email"
          id="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <label htmlFor="password">New Password (Optional):</label>
        <input
          type="password"
          id="password"
          placeholder="New Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button type="submit" className="save-button">Save Changes</button>
      </form>
      <button className="delete-account-button" onClick={() => setShowConfirmation(true)}>
        Delete Account
      </button>
    </div>
  );
};


export default ProfileEditPage;
