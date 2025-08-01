'use client'; // Add 'use client' directive

import React, { useState, useEffect } from "react";

const ApplcationOfCollab = () => {
  const [collaborations, setCollaborations] = useState([]);
  const [selectedCollaboration, setSelectedCollaboration] = useState(null);
  const [collabRequests, setCollabRequests] = useState([]);
  const [error, setError] = useState(null);

  const [userId, setUserId] = useState(null); // State for userId
  const [token, setToken] = useState(null); // State for token

   // Get userId and token from localStorage on client-side mount
  useEffect(() => {
    setUserId(localStorage.getItem("id"));
    setToken(localStorage.getItem("token"));
  }, []);

  // Fetch all collaborations posted by the user
  useEffect(() => {
    if (!userId || !token) {
      if (userId !== null && token !== null) { // Only set error if states are initialized but null/empty
         setError("User not logged in. Please login again.");
      }
      return;
    }

    const fetchCollaborations = async () => {
      try {
        const response = await fetch(
          `https://wcontent-app-latest.onrender.com/api/users/collabration/getCollabOfUser/${userId}`,
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
           const errorData = await response.json().catch(() => ({ message: "Failed to fetch collaborations." }));
           setError(errorData.message || "Failed to fetch collaborations.");
        }
      } catch (error) {
        console.error("Fetch Collaborations Error:", error);
        setError("Error fetching collaborations. Please try again.");
      }
    };

    fetchCollaborations();
  }, [userId, token]); // Depend on userId and token

  // Fetch collaboration requests for a specific collaboration
  const fetchCollabRequests = async (collabId) => {
    if (!token) {
      setError("User not logged in. Cannot fetch requests.");
      return;
    }
    try {
      const response = await fetch(
        `https://wcontent-app-latest.onrender.com/api/users/collabration/getCollabRequests/${collabId}`, // Added api/users path based on previous patterns
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
         const errorData = await response.json().catch(() => ({ message: "Failed to fetch collaboration requests." }));
        setError(errorData.message || "Failed to fetch collaboration requests.");
      }
    } catch (error) {
       console.error("Fetch Collab Requests Error:", error);
      setError("Error fetching collaboration requests. Please try again.");
    }
  };

  // Handle clicking on a collaboration card
  const handleCollaborationClick = (collab) => {
    setSelectedCollaboration(collab);
    setCollabRequests([]); // Reset requests
    fetchCollabRequests(collab._id); // Use the _id field from MongoDB
  };

  // Format date utility function
   const formatDate = (dateString) => {
     if (!dateString) return 'N/A';
     try {
       return new Date(dateString).toLocaleDateString('en-US', {
         year: 'numeric', month: 'short', day: 'numeric'
       });
     } catch (e) {
       console.error("Error formatting date:", e);
       return 'Invalid Date';
     }
   };


  return (
    // Use Tailwind CSS for styling instead of inline styles or external CSS file
    <div className="container mx-auto p-4 space-y-6">
      {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">
              <strong className="font-bold">Error:</strong>
              <span className="block sm:inline"> {error}</span>
          </div>
       )}

      <h2 className="text-2xl font-bold text-foreground">My Collaborations</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {collaborations.length === 0 && !error && <p className="text-muted-foreground col-span-full text-center">No collaborations found.</p>}
        {collaborations.map((collab) => (
          <div
            key={collab._id} // Use MongoDB _id as the key
            className="bg-card border border-border rounded-lg shadow p-4 cursor-pointer hover:shadow-md transition-shadow"
            onClick={() => handleCollaborationClick(collab)}
          >
            <h3 className="text-lg font-semibold mb-2 text-card-foreground">{collab.title}</h3>
            <p className="text-sm text-muted-foreground mb-3 line-clamp-2">{collab.description}</p>
            <div className="flex flex-wrap gap-2 text-xs mb-3">
              <span className="bg-secondary text-secondary-foreground px-2 py-0.5 rounded-full">
                {collab.contentCategory || 'N/A'}
              </span>
              <span className="border border-border px-2 py-0.5 rounded-full">
                {collab.collaborationType || 'N/A'}
              </span>
            </div>
             <p className="text-xs text-muted-foreground">Timeline: {collab.timeline || 'N/A'}</p>
             {/* Remove the button, the card is clickable */}
             {/* <button className="mt-2 text-sm text-primary hover:underline">View Details</button> */}
          </div>
        ))}
      </div>

      {selectedCollaboration && (
        <div className="mt-8 p-6 bg-card border border-border rounded-lg shadow-lg">
          <h2 className="text-xl font-bold mb-2 text-card-foreground">{selectedCollaboration.title}</h2>
          <p className="text-muted-foreground mb-4">{selectedCollaboration.description}</p>
          <div className="grid grid-cols-2 gap-4 mb-4 text-sm">
            <p><strong className="text-foreground/80">Category:</strong> {selectedCollaboration.contentCategory}</p>
            <p><strong className="text-foreground/80">Type:</strong> {selectedCollaboration.collaborationType}</p>
            <p><strong className="text-foreground/80">Timeline:</strong> {selectedCollaboration.timeline}</p>
            <p><strong className="text-foreground/80">Email:</strong> {selectedCollaboration.email}</p>
             <p><strong className="text-foreground/80">Status:</strong>{" "}
                 <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${selectedCollaboration.open ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                   {selectedCollaboration.open ? "Open" : "Closed"}
                 </span>
             </p>
          </div>

          <h3 className="text-lg font-semibold mt-6 mb-3 text-card-foreground">Collaboration Requests</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
             {collabRequests.length === 0 && <p className="text-muted-foreground col-span-full">No requests received for this collaboration yet.</p>}
            {collabRequests.map((request) => (
              <div key={request._id || request.requesterId} className="border border-border rounded-md p-4 bg-background/50"> {/* Use unique request ID if available */}
                <h4 className="font-semibold text-foreground">{request.requesterName}</h4>
                <p className="text-sm text-muted-foreground">
                  {request.requesterEmail}
                </p>
                <p className="text-sm mt-2 text-foreground/90">
                  {request.message}
                </p>
                <p className="text-xs text-muted-foreground mt-2">
                  Applied on: {formatDate(request.appliedDate)}
                </p>
                <p className="text-xs mt-1">
                   Status: <span className={`font-medium ${
                     request.status === 'Approved' ? 'text-green-600' :
                     request.status === 'Rejected' ? 'text-red-600' :
                     'text-yellow-600' // Default to pending color
                   }`}>
                     {request.status || 'Pending'}
                   </span>
                 </p>
                  {/* Placeholder for action buttons */}
                  <div className="mt-3 space-x-2">
                    <button className="text-xs bg-green-500 hover:bg-green-600 text-white py-1 px-2 rounded disabled:opacity-50" disabled>Approve (TBD)</button>
                    <button className="text-xs bg-red-500 hover:bg-red-600 text-white py-1 px-2 rounded disabled:opacity-50" disabled>Reject (TBD)</button>
                  </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ApplcationOfCollab;
