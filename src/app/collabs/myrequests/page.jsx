import React, { useState, useEffect } from "react";

const ApplcationOfCollab = () => {
  const [collaborations, setCollaborations] = useState([]);
  const [selectedCollaboration, setSelectedCollaboration] = useState(null);
  const [collabRequests, setCollabRequests] = useState([]);
  const [error, setError] = useState(null);

  const userId = localStorage.getItem("id");
  const token = localStorage.getItem("token");

  // Fetch all collaborations posted by the user
  useEffect(() => {
    if (!userId || !token) {
      setError("User not logged in. Please login again.");
      return;
    }

    const fetchCollaborations = async () => {
      try {
        const response = await fetch(
          `http://localhost:3001/api/users/collabration/getCollabOfUser/${userId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (response.ok) {
          const data = await response.json();
          setCollaborations(data);
        } else {
          setError("Failed to fetch collaborations.");
        }
      } catch (error) {
        setError("Error fetching collaborations. Please try again.");
      }
    };

    fetchCollaborations();
  }, [userId, token]);

  // Fetch collaboration requests for a specific collaboration
  const fetchCollabRequests = async (collabId) => {
    try {
      const response = await fetch(
        `http://localhost:3001/api/users/collabration/getCollabRequests/${collabId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.ok) {
        const data = await response.json();
        setCollabRequests(data);
      } else {
        setError("Failed to fetch collaboration requests.");
      }
    } catch (error) {
      setError("Error fetching collaboration requests. Please try again.");
    }
  };

  // Handle clicking on a collaboration card
  const handleCollaborationClick = (collab) => {
    setSelectedCollaboration(collab);
    setCollabRequests([]); // Reset requests
    fetchCollabRequests(collab._id); // Use the _id field from MongoDB
  };

  return (
    <div className="my-collaborations-container">
      {error && <div className="error">{error}</div>}

      <h2>My Collaborations</h2>
      <div className="collaborations-list">
        {collaborations.map((collab) => (
          <div
            key={collab._id} // Use MongoDB _id as the key
            className="collaboration-card"
            onClick={() => handleCollaborationClick(collab)}
          >
            <h3>{collab.title}</h3>
            <p>{collab.description}</p>
            <div className="collaboration-meta">
              <p>
                <strong>Category:</strong> {collab.contentCategory}
              </p>
              <p>
                <strong>Type:</strong> {collab.collaborationType}
              </p>
              <p>
                <strong>Timeline:</strong> {collab.timeline}
              </p>
            </div>
            <button className="view-details-btn">View Details</button>
          </div>
        ))}
      </div>

      {selectedCollaboration && (
        <div className="collaboration-details">
          <h2>{selectedCollaboration.title}</h2>
          <p>{selectedCollaboration.description}</p>
          <div className="details-meta">
            <p>
              <strong>Category:</strong> {selectedCollaboration.contentCategory}
            </p>
            <p>
              <strong>Type:</strong> {selectedCollaboration.collaborationType}
            </p>
            <p>
              <strong>Timeline:</strong> {selectedCollaboration.timeline}
            </p>
            <p>
              <strong>Email:</strong> {selectedCollaboration.email}
            </p>
            <p>
              <strong>Status:</strong>{" "}
              {selectedCollaboration.open ? "Open" : "Closed"}
            </p>
          </div>

          <h3>Collaboration Requests</h3>
          <div className="requests-list">
            {collabRequests.map((request) => (
              <div key={request.requesterId} className="request-card">
                <h4>{request.requesterName}</h4>
                <p>
                  <strong>Email:</strong> {request.requesterEmail}
                </p>
                <p>
                  <strong>Message:</strong> {request.message}
                </p>
                <p>
                  <strong>Applied on:</strong> {request.appliedDate}
                </p>
                <p>
                  <strong>Status:</strong> {request.status}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ApplcationOfCollab;