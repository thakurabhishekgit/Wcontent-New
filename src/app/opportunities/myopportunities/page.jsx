'use client'; // Add 'use client' directive

import React, { useState, useEffect } from "react";

const MyOpportunities = () => {
  const [opportunities, setOpportunities] = useState([]);
  const [selectedOpportunity, setSelectedOpportunity] = useState(null);
  const [applications, setApplications] = useState([]);
  const [selectedApplication, setSelectedApplication] = useState(null);
  const [error, setError] = useState(null);
  const [message, setMessage] = useState(null);

  const [userId, setUserId] = useState(null); // State for userId
  const [token, setToken] = useState(null); // State for token

  // Get userId and token from localStorage on client-side mount
  useEffect(() => {
     setUserId(localStorage.getItem("id"));
     setToken(localStorage.getItem("token"));
   }, []);


  // Fetch all opportunities posted by the user
  useEffect(() => {
    if (!userId || !token) {
       if (userId !== null && token !== null) { // Only set error if states are initialized but null/empty
         setError("User not logged in. Please login again.");
       }
      return;
    }

    const fetchOpportunities = async () => {
      try {
        const response = await fetch(
          `https://wcontent-app-latest.onrender.com/api/users/opportunities/getMyOpportunities/${userId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (response.ok) {
          const data = await response.json();
          setOpportunities(data);
        } else {
          const errorData = await response.json().catch(() => ({ message: "Failed to fetch opportunities." }));
          setError(errorData.message || "Failed to fetch opportunities.");
        }
      } catch (error) {
         console.error("Fetch Opportunities Error:", error);
        setError("Error fetching opportunities. Please try again.");
      }
    };

    fetchOpportunities();
  }, [userId, token]); // Depend on userId and token

  // Fetch applications for a specific opportunity
  const fetchApplications = async (oppId) => {
     if (!token) {
       setError("User not logged in. Cannot fetch applications.");
       return;
     }
    try {
      const response = await fetch(
        `https://wcontent-app-latest.onrender.com/api/users/application/opportunity/${oppId}/applicants`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.ok) {
        const data = await response.json();
        setApplications(data);
      } else {
         const errorData = await response.json().catch(() => ({ message: "Failed to fetch applications." }));
        setError(errorData.message || "Failed to fetch applications.");
      }
    } catch (error) {
       console.error("Fetch Applications Error:", error);
      setError("Error fetching applications. Please try again.");
    }
  };

  // Handle clicking on an opportunity card
  const handleOpportunityClick = (opportunity) => {
    setSelectedOpportunity(opportunity);
    setSelectedApplication(null); // Reset selected application
    fetchApplications(opportunity.id); // Assuming opportunity object has 'id'
  };

  // Handle clicking on an application card
  const handleApplicationClick = (application) => {
    setSelectedApplication(application);
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
     // Use Tailwind CSS for styling
     <div className="container mx-auto p-4 space-y-6">
      {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">
              <strong className="font-bold">Error:</strong>
              <span className="block sm:inline"> {error}</span>
          </div>
       )}
      {message && (
          <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative mb-4" role="alert">
              <strong className="font-bold">Success:</strong>
              <span className="block sm:inline"> {message}</span>
          </div>
       )}

      <h2 className="text-2xl font-bold text-foreground">My Posted Opportunities</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
         {opportunities.length === 0 && !error && <p className="text-muted-foreground col-span-full text-center">No opportunities posted yet.</p>}
        {opportunities.map((opportunity) => (
          <div
            key={opportunity.id} // Make sure opportunity has a unique id
            className="bg-card border border-border rounded-lg shadow p-4 cursor-pointer hover:shadow-md transition-shadow"
            onClick={() => handleOpportunityClick(opportunity)}
          >
            <h3 className="text-lg font-semibold mb-2 text-card-foreground">{opportunity.title}</h3>
            <p className="text-sm text-muted-foreground mb-3 line-clamp-2">{opportunity.description}</p>
            <div className="flex flex-wrap gap-2 text-xs mb-3">
              <span className="bg-secondary text-secondary-foreground px-2 py-0.5 rounded-full">
                {opportunity.location || 'N/A'}
              </span>
              <span className="border border-border px-2 py-0.5 rounded-full">
                {opportunity.type || 'N/A'}
              </span>
               <span className="border border-primary/50 text-primary px-2 py-0.5 rounded-full">
                 {opportunity.salaryRange || 'N/A'}
               </span>
            </div>
            {/* <button className="mt-2 text-sm text-primary hover:underline">View Details & Applications</button> */}
          </div>
        ))}
      </div>

      {selectedOpportunity && (
        <div className="mt-8 p-6 bg-card border border-border rounded-lg shadow-lg">
          <h2 className="text-xl font-bold mb-2 text-card-foreground">{selectedOpportunity.title}</h2>
          <p className="text-muted-foreground mb-4">{selectedOpportunity.description}</p>
          <div className="grid grid-cols-2 gap-4 mb-4 text-sm">
            <p><strong className="text-foreground/80">Requirements:</strong> {selectedOpportunity.requirements}</p>
            <p><strong className="text-foreground/80">Location:</strong> {selectedOpportunity.location}</p>
            <p><strong className="text-foreground/80">Type:</strong> {selectedOpportunity.type}</p>
            <p><strong className="text-foreground/80">Salary/Budget:</strong> {selectedOpportunity.salaryRange}</p>
             {/* Add email if available */}
             {selectedOpportunity.email && <p><strong className="text-foreground/80">Contact:</strong> {selectedOpportunity.email}</p>}
          </div>

          <h3 className="text-lg font-semibold mt-6 mb-3 text-card-foreground">Applications Received</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
             {applications.length === 0 && <p className="text-muted-foreground col-span-full">No applications received yet.</p>}
            {applications.map((application) => (
              <div
                key={application._id || application.email} // Use unique ID, fallback to email
                className="border border-border rounded-md p-4 bg-background/50 cursor-pointer hover:bg-muted/50 transition-colors"
                onClick={() => handleApplicationClick(application)}
              >
                <h4 className="font-semibold text-foreground">{application.name}</h4>
                <p className="text-sm text-muted-foreground">
                  {application.email}
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  Applied on: {formatDate(application.applicationDate)}
                </p>
                {/* <button className="text-xs text-primary hover:underline mt-2">View Application</button> */}
              </div>
            ))}
          </div>
        </div>
      )}

      {selectedApplication && (
        <div className="mt-8 p-6 bg-muted border border-border rounded-lg shadow-inner">
          <h3 className="text-lg font-semibold mb-4 text-foreground">Application Details</h3>
          <p className="text-sm mb-1"><strong className="text-foreground/80">Name:</strong> {selectedApplication.name}</p>
          <p className="text-sm mb-1"><strong className="text-foreground/80">Email:</strong> {selectedApplication.email}</p>
          <p className="text-sm mb-1">
            <strong className="text-foreground/80">Portfolio/Resume:</strong>{" "}
            {selectedApplication.resumeUrl ? (
               <a
                 href={selectedApplication.resumeUrl}
                 target="_blank"
                 rel="noopener noreferrer"
                 className="text-primary hover:underline"
               >
                 View Link
               </a>
            ) : (
               <span className="text-muted-foreground italic">Not Provided</span>
            )}
          </p>
          <p className="text-sm"><strong className="text-foreground/80">Application Date:</strong>{" "}
            {formatDate(selectedApplication.applicationDate)}
          </p>
           <button onClick={() => setSelectedApplication(null)} className="mt-4 text-sm text-primary hover:underline">Close Details</button>
        </div>
      )}
    </div>
  );
};

export default MyOpportunities;
