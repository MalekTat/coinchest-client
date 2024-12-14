import React, { useState, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import axios from "axios";

const ProfileEdit = () => {
  const { user, login } = useContext(AuthContext);
  const [username, setUsername] = useState(user?.username || "");
  const [email, setEmail] = useState(user?.email || "");

  const handleSave = async () => {
    try {
      const response = await axios.put("/api/account", { username, email }, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      login(localStorage.getItem("token"), response.data); // Update context
    } catch (error) {
      console.error("Error updating profile:", error.response?.data || error.message);
    }
  };

  return (
    <div>
      <h1>Edit Profile</h1>
      <input value={username} onChange={(e) => setUsername(e.target.value)} />
      <input value={email} onChange={(e) => setEmail(e.target.value)} />
      <button onClick={handleSave}>Save</button>
    </div>
  );
};

export default ProfileEdit;
