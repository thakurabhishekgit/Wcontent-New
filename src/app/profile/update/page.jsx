import React, { useState, useEffect } from "react";

const UpdateProfil = () => {
  const [userData, setUserData] = useState({
    username: "",
    email: "",
    userType: "",
    channelName: "",
    channelId: "",
    channelURL: "",
    password: "",
  });
  const [error, setError] = useState(null);
  const [message, setMessage] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const userId = localStorage.getItem("id");

    if (token && userId) {
      // Fetch the user data initially
      fetchUserData(userId, token);
    } else {
      setError("User not logged in. Please login again.");
    }
  }, []);

  const fetchUserData = async (userId, token) => {
    try {
      const response = await fetch(
        `http://localhost:3001/api/users/getUser/${userId}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.ok) {
        const data = await response.json();
        setUserData(data); // Set user data if request is successful
      } else {
        const data = await response.json();
        setError(data.message || "Failed to fetch user data.");
      }
    } catch (error) {
      setError("");
    }
  };

  const handleChange = (e) => {
    setUserData({
      ...userData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const token = localStorage.getItem("token");
    const userId = localStorage.getItem("id");

    if (!token || !userId) {
      setError("User not logged in. Please login again.");
      return;
    }

    try {
      const response = await fetch(
        `http://localhost:3001/api/users/update/${userId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(userData),
        }
      );

      if (response.ok) {
        setMessage("Profile updated successfully!");
      } else {
        const data = await response.json();
        setError(data.message || "Failed to update profile.");
      }
    } catch (error) {
      setError("Error updating profile. Please try again.");
    }
  };

  return (
    <div className="update-profile-container">
      {error && <div className="error">{error}</div>}
      {message && <div className="success">{message}</div>}

      <h2>Update Profile</h2>
      <form onSubmit={handleSubmit} className="update-profile-form">
        <div className="form-row">
          <div className="form-group">
            <label htmlFor="username">Username</label>
            <input
              type="text"
              id="username"
              name="username"
              value={userData.username}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              value={userData.email}
              onChange={handleChange}
            />
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label htmlFor="userType">User Type</label>
            <input
              type="text"
              id="userType"
              name="userType"
              value={userData.userType}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label htmlFor="channelName">Channel Name</label>
            <input
              type="text"
              id="channelName"
              name="channelName"
              value={userData.channelName}
              onChange={handleChange}
            />
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label htmlFor="channelURL">Channel URL</label>
            <input
              type="url"
              id="channelURL"
              name="channelURL"
              value={userData.channelURL}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              name="password"
              value={userData.password}
              onChange={handleChange}
            />
          </div>
        </div>

        <div className="form-row">
          <button type="submit" className="update-btn">
            Update Profile
          </button>
        </div>
      </form>
    </div>
  );
};

export default UpdateProfil;