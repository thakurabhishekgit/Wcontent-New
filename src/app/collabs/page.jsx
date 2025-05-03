
import React, { useState, useEffect } from "react";
import axios from "axios";

const Collaborations = () => {
  const [collaborations, setCollaborations] = useState([]);
  const [selectedCollaboration, setSelectedCollaboration] = useState(null);
  const [application, setApplication] = useState({
    requesterName: "",
    requesterEmail: "",
    message: "",
    appliedDate: new Date().toISOString().split("T")[0],
  });
  const [submissionStatus, setSubmissionStatus] = useState(null);
  const styles = {
    container: {
      padding: "20px",
      fontFamily: "Arial, sans-serif",
    },
    pageTitle: {
      textAlign: "center",
      marginBottom: "20px",
    },
    pageDescription: {
      textAlign: "center",
      marginBottom: "30px",
    },
    collaborationsList: {
      display: "grid",
      gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
      gap: "20px",
    },
    collaborationCard: {
      border: "1px solid #ccc",
      padding: "15px",
      borderRadius: "5px",
      cursor: "pointer",
    },
    cardTitle: {
      marginBottom: "10px",
    },
    cardText: {
      marginBottom: "5px",
    },
    applyButton: {
      backgroundColor: "#007bff",
      color: "white",
      border: "none",
      padding: "10px 15px",
      borderRadius: "5px",
      cursor: "pointer",
    },
    detailsContainer: {
      marginTop: "30px",
      border: "1px solid #ccc",
      borderRadius: "5px",
      padding: "20px",
    },
    detailsSection: {
      marginBottom: "20px",
    },
    detailsTitle: {
      marginBottom: "10px",
    },
    detailsText: {
      marginBottom: "5px",
    },
    applicationForm: {
      border: "1px solid #ccc",
      borderRadius: "5px",
      padding: "20px",
    },
    formTitle: {
      marginBottom: "20px",
    },
    form: {
      display: "flex",
      flexDirection: "column",
    },
    formGroup: {
      marginBottom: "15px",
    },
    label: {
      marginBottom: "5px",
    },
    input: {
      padding: "10px",
      border: "1px solid #ccc",
      borderRadius: "5px",
    },
    submitButton: {
      backgroundColor: "#007bff",
      color: "white",
      border: "none",
      padding: "10px 15px",
      borderRadius: "5px",
      cursor: "pointer",
    },
  };
  useEffect(() => {
    fetchCollaborations();
  }, []);
  const fetchCollaborations = async () => {
    try {
      const response = await axios.get(
        "http://localhost:3001/api/users/collabration/getCollabOfAllUsers"
      );
      setCollaborations(response.data);
    } catch (error) {
      console.error("Error fetching collaborations:", error);
    }
  };
  const handleCardClick = (collaboration) => {
    setSelectedCollaboration(collaboration);
    setSubmissionStatus(null); // Reset submission status when a new collaboration is selected
  };
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setApplication({ ...application, [name]: value });
  };
  const handleApply = async (e) => {
    e.preventDefault();
    if (!selectedCollaboration) return;
    try {
      const response = await axios.post(
        `http://localhost:3001/api/users/collabration/applyForCollab/${selectedCollaboration.id}`,
        application
      );
      setSubmissionStatus("Application submitted successfully!");
      setApplication({
        requesterName: "",
        requesterEmail: "",
        message: "",
        appliedDate: new Date().toISOString().split("T")[0],
      }); // Reset form
    } catch (error) {
      console.error("Error applying for collaboration:", error);
      setSubmissionStatus("Failed to submit application. Please try again.");
    }
  };
  return (
    <div style={styles.container}>
      <h1 style={styles.pageTitle}>Collaboration Opportunities</h1>
      <p style={styles.pageDescription}>
        Explore exciting collaboration opportunities and join hands with
        like-minded individuals to bring innovative ideas to life.
      </p>
      <div style={styles.collaborationsList}>
        {collaborations.map((collaboration) => (
          <div
            key={collaboration.id}
            style={styles.collaborationCard}
            onClick={() => handleCardClick(collaboration)}
          >
            <h3 style={styles.cardTitle}>{collaboration.title}</h3>
            <p style={styles.cardText}>{collaboration.description}</p>
            <p style={styles.cardText}>
              <strong>Category:</strong> {collaboration.contentCategory}
            </p>
            <p style={styles.cardText}>
              <strong>Type:</strong> {collaboration.collaborationType}
            </p>
            <p style={styles.cardText}>
              <strong>Timeline:</strong> {collaboration.timeline}
            </p>
            <button
              style={styles.applyButton}
              onClick={(e) => {
                e.stopPropagation(); // Prevent card click event
                handleCardClick(collaboration);
              }}
            >
              Apply Now
            </button>
          </div>
        ))}
      </div>
      {selectedCollaboration && (
        <div style={styles.detailsContainer}>
          <div style={styles.detailsSection}>
            <h2 style={styles.detailsTitle}>{selectedCollaboration.title}</h2>
            <p style={styles.detailsText}>
              {selectedCollaboration.description}
            </p>
            <p style={styles.detailsText}>
              <strong>Category:</strong> {selectedCollaboration.contentCategory}
            </p>
            <p style={styles.detailsText}>
              <strong>Type:</strong> {selectedCollaboration.collaborationType}
            </p>
            <p style={styles.detailsText}>
              <strong>Timeline:</strong> {selectedCollaboration.timeline}
            </p>
            <p style={styles.detailsText}>
              <strong>Status:</strong>{" "}
              {selectedCollaboration.open ? "Open" : "Closed"}
            </p>
          </div>
          <div style={styles.applicationForm}>
            <h3 style={styles.formTitle}>Apply for this Collaboration</h3>
            {submissionStatus && (
              <p
                style={{
                  color: submissionStatus.includes("success") ? "green" : "red",
                  marginBottom: "20px",
                  fontSize: "14px",
                }}
              >
                {submissionStatus}
              </p>
            )}
            <form onSubmit={handleApply} style={styles.form}>
              <div style={styles.formGroup}>
                <label style={styles.label}>
                  Your Name:
                  <input
                    type="text"
                    name="requesterName"
                    value={application.requesterName}
                    onChange={handleInputChange}
                    required
                    style={styles.input}
                  />
                </label>
              </div>
              <div style={styles.formGroup}>
                <label style={styles.label}>
                  Your Email:
                  <input
                    type="email"
                    name="requesterEmail"
                    value={application.requesterEmail}
                    onChange={handleInputChange}
                    required
                    style={styles.input}
                  />
                </label>
              </div>
              <div style={styles.formGroup}>
                <label style={styles.label}>
                  Message:
                  <textarea
                    name="message"
                    value={application.message}
                    onChange={handleInputChange}
                    required
                    style={{ ...styles.input, height: "100px" }}
                  />
                </label>
              </div>
              <div style={styles.formGroup}>
                <label style={styles.label}>
                  Application Date:
                  <input
                    type="date"
                    name="appliedDate"
                    value={application.appliedDate}
                    onChange={handleInputChange}
                    required
                    style={styles.input}
                  />
                </label>
              </div>
              <button type="submit" style={styles.submitButton}>
                Submit Application
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Collaborations;
