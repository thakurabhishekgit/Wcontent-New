
import React, { useState, useEffect } from "react";
import axios from "axios";
import HowitWorks from "../components/HowItWorks";

const styles = {
  container: {
    fontFamily: "Arial, sans-serif",
    padding: "20px",
    maxWidth: "1200px",
    margin: "0 auto",
  },
  divider: {
    borderTop: "2px solid #ddd",
    margin: "20px 0",
  },
  ctaSection: {
    backgroundColor: "#f8f8f8",
    padding: "30px",
    borderRadius: "8px",
    textAlign: "center",
    marginBottom: "30px",
  },
  ctaTitle: {
    color: "#333",
    marginBottom: "15px",
    fontSize: "24px",
  },
  ctaText: {
    color: "#555",
    lineHeight: "1.6",
  },
  opportunitiesList: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
    gap: "20px",
    marginBottom: "30px",
  },
  opportunityCard: {
    backgroundColor: "#fff",
    border: "1px solid #eee",
    borderRadius: "8px",
    padding: "20px",
    boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
    cursor: "pointer",
    transition: "all 0.3s ease",
    "&:hover": {
      boxShadow: "0 4px 8px rgba(0, 0, 0, 0.15)",
      transform: "translateY(-2px)",
    },
  },
  cardTitle: {
    color: "#333",
    marginBottom: "10px",
    fontSize: "18px",
  },
  cardText: {
    color: "#666",
    marginBottom: "5px",
  },
  applyButton: {
    backgroundColor: "#007bff",
    color: "#fff",
    padding: "10px 15px",
    borderRadius: "5px",
    border: "none",
    cursor: "pointer",
    marginTop: "15px",
    "&:hover": {
      backgroundColor: "#0056b3",
    },
  },
  detailsContainer: {
    display: "flex",
    gap: "20px",
    marginBottom: "30px",
  },
  detailsSection: {
    flex: "2",
    backgroundColor: "#fff",
    border: "1px solid #eee",
    borderRadius: "8px",
    padding: "20px",
    boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
  },
  detailsTitle: {
    color: "#333",
    marginBottom: "10px",
    fontSize: "20px",
  },
  detailsText: {
    color: "#555",
    marginBottom: "10px",
    lineHeight: "1.6",
  },
  applicationFormCard: {
    flex: "1",
    backgroundColor: "#fff",
    border: "1px solid #eee",
    borderRadius: "8px",
    padding: "20px",
    boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
  },
  formTitle: {
    color: "#333",
    marginBottom: "20px",
    fontSize: "18px",
    textAlign: "center",
  },
  form: {
    display: "flex",
    flexDirection: "column",
  },
  formGroup: {
    marginBottom: "20px",
    display: "flex",
    flexDirection: "column",
  },
  label: {
    marginBottom: "5px",
    color: "#333",
  },
  input: {
    padding: "10px",
    border: "1px solid #ddd",
    borderRadius: "5px",
    marginBottom: "5px",
  },
  submitButton: {
    backgroundColor: "#007bff",
    color: "#fff",
    padding: "10px 15px",
    borderRadius: "5px",
    border: "none",
    cursor: "pointer",
    "&:hover": {
      backgroundColor: "#0056b3",
    },
  },
};

const Opportunities = () => {
  const [opportunities, setOpportunities] = useState([]);
  const [selectedOpportunity, setSelectedOpportunity] = useState(null);
  const [application, setApplication] = useState({
    name: "",
    email: "",
    resumeUrl: "",
    applicationDate: new Date().toISOString().split("T")[0],
  });
  const [submissionStatus, setSubmissionStatus] = useState(null);

  useEffect(() => {
    fetchOpportunities();
  }, []);

  const fetchOpportunities = async () => {
    try {
      const response = await axios.get(
        "http://localhost:3001/api/users/opportunities/opportunitiesGetAll"
      );
      setOpportunities(response.data);
    } catch (error) {
      console.error("Error fetching opportunities:", error);
    }
  };

  const handleCardClick = (opportunity) => {
    setSelectedOpportunity(opportunity);
    setSubmissionStatus(null); // Reset submission status when a new opportunity is selected
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setApplication({ ...application, [name]: value });
  };

  const handleApply = async (e) => {
    e.preventDefault();
    if (!selectedOpportunity) return;

    try {
      const response = await axios.post(
        `http://localhost:3001/api/users/application/opportunity/${selectedOpportunity.id}/apply`,
        application
      );
      setSubmissionStatus("Application submitted successfully!");
      setApplication({
        name: "",
        email: "",
        resumeUrl: "",
        applicationDate: new Date().toISOString().split("T")[0],
      }); // Reset form
    } catch (error) {
      console.error("Error applying for opportunity:", error);
      setSubmissionStatus("Failed to submit application. Please try again.");
    }
  };

  return (
    <div style={styles.container}>
      {/* How It Works Section */}
      <HowitWorks />

      {/* Divider and CTA Section */}
      <div style={styles.divider}></div>
      <div style={styles.ctaSection}>
        <h2 style={styles.ctaTitle}>Ready to Collaborate?</h2>
        <p style={styles.ctaText}>
          Join our community of innovators and creators. Explore exciting
          collaboration opportunities and bring your ideas to life with
          like-minded individuals.
        </p>
      </div>

      {/* Collaboration Opportunities Section */}

      <div style={styles.opportunitiesList}>
        {opportunities.map((opportunity) => (
          <div
            key={opportunity.id}
            style={styles.opportunityCard}
            onClick={() => handleCardClick(opportunity)}
          >
            <h3 style={styles.cardTitle}>{opportunity.title}</h3>
            <p style={styles.cardText}>{opportunity.location}</p>
            <p style={styles.cardText}>{opportunity.type}</p>
            <p style={styles.cardText}>{opportunity.salaryRange}</p>
            <button
              style={styles.applyButton}
              onClick={(e) => {
                e.stopPropagation(); // Prevent card click event
                handleCardClick(opportunity);
              }}
            >
              Apply Now
            </button>
          </div>
        ))}
      </div>

      {selectedOpportunity && (
        <div style={styles.detailsContainer}>
          <div style={styles.detailsSection}>
            <h2 style={styles.detailsTitle}>{selectedOpportunity.title}</h2>
            <p style={styles.detailsText}>{selectedOpportunity.description}</p>
            <p style={styles.detailsText}>
              <strong>Requirements:</strong> {selectedOpportunity.requirements}
            </p>
            <p style={styles.detailsText}>
              <strong>Location:</strong> {selectedOpportunity.location}
            </p>
            <p style={styles.detailsText}>
              <strong>Type:</strong> {selectedOpportunity.type}
            </p>
            <p style={styles.detailsText}>
              <strong>Salary Range:</strong> {selectedOpportunity.salaryRange}
            </p>
          </div>

          <div style={styles.applicationFormCard}>
            <h3 style={styles.formTitle}>Apply for this Opportunity</h3>
            {submissionStatus && (
              <p
                style={{
                  color: submissionStatus.includes("success") ? "green" : "red",
                  marginBottom: "20px",
                  fontSize: "14px",
                  textAlign: "center",
                }}
              >
                {submissionStatus}
              </p>
            )}
            <form onSubmit={handleApply} style={styles.form}>
              <div style={styles.formGroup}>
                <label style={styles.label}>
                  Name:
                  <input
                    type="text"
                    name="name"
                    value={application.name}
                    onChange={handleInputChange}
                    required
                    style={styles.input}
                  />
                </label>
              </div>
              <div style={styles.formGroup}>
                <label style={styles.label}>
                  Email:
                  <input
                    type="email"
                    name="email"
                    value={application.email}
                    onChange={handleInputChange}
                    required
                    style={styles.input}
                  />
                </label>
              </div>
              <div style={styles.formGroup}>
                <label style={styles.label}>
                  work URL:
                  <input
                    type="url"
                    name="resumeUrl"
                    value={application.resumeUrl}
                    onChange={handleInputChange}
                    required
                    style={styles.input}
                  />
                </label>
              </div>
              <div style={styles.formGroup}>
                <label style={styles.label}>
                  Application Date:
                  <input
                    type="date"
                    name="applicationDate"
                    value={application.applicationDate}
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

export default Opportunities;
