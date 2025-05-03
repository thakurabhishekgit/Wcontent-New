'use client'; // Add this directive

import React, { useState, useEffect } from "react";

const MyProfile = () => {
  const [userData, setUserData] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  // Fetch user data on component mount
  useEffect(() => {
    // Check if window is defined (runs only on client)
    if (typeof window !== 'undefined') {
      const userId = localStorage.getItem("id");
      const token = localStorage.getItem("token");

      if (userId && token) {
        fetchUserData(userId, token);
      } else {
        setError("User not authenticated. Please log in.");
        setLoading(false);
      }
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
    <div className="dashboard-container p-4"> {/* Added padding */}
      <h1 className="text-2xl font-bold mb-4">My Profile</h1> {/* Styled heading */}
      {error && <p className="text-red-500 mb-4">{error}</p>} {/* Styled error */}

      {loading ? (
        <div className="flex items-center justify-center space-x-2"> {/* Styled loading */}
          <div className="spinner border-t-2 border-blue-500 rounded-full w-6 h-6 animate-spin"></div>
          <p>Loading...</p>
        </div>
      ) : userData ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4"> {/* Grid layout */}
          {/* User Information */}
          <div className="p-4 border rounded bg-card text-card-foreground"> {/* Styled box */}
            <h2 className="font-semibold mb-1">Username</h2>
            <p>{userData.username}</p>
          </div>
          <div className="p-4 border rounded bg-card text-card-foreground">
            <h2 className="font-semibold mb-1">Email</h2>
            <p>{userData.email}</p>
          </div>
          <div className="p-4 border rounded bg-card text-card-foreground">
            <h2 className="font-semibold mb-1">User Type</h2>
            <p>{userData.userType}</p>
          </div>
          <div className="p-4 border rounded bg-card text-card-foreground">
            <h2 className="font-semibold mb-1">Verified</h2>
            <p>{userData.verified ? "Yes" : "No"}</p>
          </div>

          {/* Channel Information */}
          <div className="p-4 border rounded bg-card text-card-foreground">
            <h2 className="font-semibold mb-1">Channel Name</h2>
            <p>{userData.channelName || 'N/A'}</p> {/* Handle potentially missing data */}
          </div>
          <div className="p-4 border rounded bg-card text-card-foreground">
            <h2 className="font-semibold mb-1">Channel ID</h2>
            <p>{userData.channelId || 'N/A'}</p>
          </div>
          <div className="p-4 border rounded bg-card text-card-foreground">
            <h2 className="font-semibold mb-1">Channel URL</h2>
            {userData.channelURL ? (
               <a
                 href={userData.channelURL}
                 target="_blank"
                 rel="noopener noreferrer"
                 className="text-primary hover:underline break-all" /* Styled link */
               >
                 {userData.channelURL}
               </a>
             ) : <p>N/A</p>}
          </div>
        </div>
      ) : (
        <p>No data found.</p>
      )}
    </div>
  );
};

export default MyProfile;
