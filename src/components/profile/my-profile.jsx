import React, { useState, useEffect } from "react";

const MyProfile = () => {
  const [userData, setUserData] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  // Fetch user data on component mount
  useEffect(() => {
    const userId = localStorage.getItem("id");
    const token = localStorage.getItem("token");

    if (userId && token) {
      fetchUserData(userId, token);
    } else {
      setError("User not authenticated. Please log in.");
      setLoading(false);
    }
  }, []);

  // Fetch user data from the backend
  const fetchUserData = async (userId, token) => {
    try {
      const response = await fetch(
        `http://localhost:3001/api/users/getUser/${userId}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`, // Send the token in the Authorization header
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
      setError("Error fetching user data. Please try again.");
    } finally {
      setLoading(false); // Stop loading after the request is complete
    }
  };

  // Render the dashboard
  return (
    <div className="dashboard-container">
      <h1>My Profile</h1>
      {error && <p className="error-message">{error}</p>}

      {loading ? (
        <div className="loading-spinner">
          <div className="spinner"></div>
          <p>Loading...</p>
        </div>
      ) : userData ? (
        <div className="profile-grid">
          {/* User Information */}
          <div className="profile-box">
            <h2>Username</h2>
            <p>{userData.username}</p>
          </div>
          <div className="profile-box">
            <h2>Email</h2>
            <p>{userData.email}</p>
          </div>
          <div className="profile-box">
            <h2>User Type</h2>
            <p>{userData.userType}</p>
          </div>
          <div className="profile-box">
            <h2>Verified</h2>
            <p>{userData.verified ? "Yes" : "No"}</p>
          </div>

          {/* Channel Information */}
          <div className="profile-box">
            <h2>Channel Name</h2>
            <p>{userData.channelName}</p>
          </div>
          <div className="profile-box">
            <h2>Channel ID</h2>
            <p>{userData.channelId}</p>
          </div>
          <div className="profile-box">
            <h2>Channel URL</h2>
            <a
              href={userData.channelURL}
              target="_blank"
              rel="noopener noreferrer"
            >
              {userData.channelURL}
            </a>
          </div>
        </div>
      ) : (
        <p>No data found.</p>
      )}
    </div>
  );
};

export default MyProfile;