import React, { useState, useEffect } from "react";

const MyOpportunities = () => {
  const [opportunities, setOpportunities] = useState([]);
  const [selectedOpportunity, setSelectedOpportunity] = useState(null);
  const [applications, setApplications] = useState([]);
  const [selectedApplication, setSelectedApplication] = useState(null);
  const [error, setError] = useState(null);
  const [message, setMessage] = useState(null);

  const userId = localStorage.getItem("id");
  const token = localStorage.getItem("token");

  // Fetch all opportunities posted by the user
  useEffect(() => {
    if (!userId || !token) {
      setError("User not logged in. Please login again.");
      return;
    }

    const fetchOpportunities = async () => {
      try {
        const response = await fetch(
          `http://localhost:3001/api/users/opportunities/getMyOpportunities/${userId}`,
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
          setError("Failed to fetch opportunities.");
        }
      } catch (error) {
        setError("Error fetching opportunities. Please try again.");
      }
    };

    fetchOpportunities();
  }, [userId, token]);

  // Fetch applications for a specific opportunity
  const fetchApplications = async (oppId) => {
    try {
      const response = await fetch(
        `http://localhost:3001/api/users/application/opportunity/${oppId}/applicants`,
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
        setError("Failed to fetch applications.");
      }
    } catch (error) {
      setError("Error fetching applications. Please try again.");
    }
  };

  // Handle clicking on an opportunity card
  const handleOpportunityClick = (opportunity) => {
    setSelectedOpportunity(opportunity);
    setSelectedApplication(null); // Reset selected application
    fetchApplications(opportunity.id);
  };

  // Handle clicking on an application card
  const handleApplicationClick = (application) => {
    setSelectedApplication(application);
  };

  return (
    <div className="my-opportunities-container">
      {error && <div className="error">{error}</div>}
      {message && <div className="success">{message}</div>}

      <h2>My Posted Opportunities</h2>
      <div className="opportunities-list">
        {opportunities.map((opportunity) => (
          <div
            key={opportunity.id}
            className="opportunity-card"
            onClick={() => handleOpportunityClick(opportunity)}
          >
            <h3>{opportunity.title}</h3>
            <p>{opportunity.description}</p>
            <div className="opportunity-meta">
              <p>
                <strong>Location:</strong> {opportunity.location}
              </p>
              <p>
                <strong>Type:</strong> {opportunity.type}
              </p>
              <p>
                <strong>Salary:</strong> {opportunity.salaryRange}
              </p>
            </div>
            <button className="view-details-btn">View Details</button>
          </div>
        ))}
      </div>

      {selectedOpportunity && (
        <div className="opportunity-details">
          <h2>{selectedOpportunity.title}</h2>
          <p>{selectedOpportunity.description}</p>
          <div className="details-meta">
            <p>
              <strong>Requirements:</strong> {selectedOpportunity.requirements}
            </p>
            <p>
              <strong>Location:</strong> {selectedOpportunity.location}
            </p>
            <p>
              <strong>Type:</strong> {selectedOpportunity.type}
            </p>
            <p>
              <strong>Salary Range:</strong> {selectedOpportunity.salaryRange}
            </p>
          </div>

          <h3>Applications Received</h3>
          <div className="applications-list">
            {applications.map((application) => (
              <div
                key={application.email}
                className="application-card"
                onClick={() => handleApplicationClick(application)}
              >
                <h4>{application.name}</h4>
                <p>
                  <strong>Email:</strong> {application.email}
                </p>
                <p>
                  <strong>Applied on:</strong> {application.applicationDate}
                </p>
                <button className="view-application-btn">
                  View Application
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {selectedApplication && (
        <div className="application-details">
          <h3>Application Details</h3>
          <p>
            <strong>Name:</strong> {selectedApplication.name}
          </p>
          <p>
            <strong>Email:</strong> {selectedApplication.email}
          </p>
          <p>
            <strong>Resume:</strong>{" "}
            <a
              href={selectedApplication.resumeUrl}
              target="_blank"
              rel="noopener noreferrer"
            >
              View Resume
            </a>
          </p>
          <p>
            <strong>Application Date:</strong>{" "}
            {selectedApplication.applicationDate}
          </p>
        </div>
      )}
    </div>
  );
};

export default MyOpportunities;