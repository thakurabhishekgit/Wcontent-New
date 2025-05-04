import React, { useState } from "react";

const NewOpportunity = () => {
  const [opportunityData, setOpportunityData] = useState({
    title: "",
    description: "",
    requirements: "",
    location: "",
    type: "",
    salaryRange: "",
    isFilled: false,
    email: "",
  });

  const [error, setError] = useState(null);
  const [message, setMessage] = useState(null);

  const handleChange = (e) => {
    setOpportunityData({
      ...opportunityData,
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
        `https://wcontent-app-latest.onrender.com/api/users/opportunities/opportunity/${userId}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(opportunityData),
        }
      );

      if (response.ok) {
        setMessage("Opportunity posted successfully!");
      } else {
        const data = await response.json();
        setError(data.message || "Failed to post opportunity.");
      }
    } catch (error) {
      setError("Error posting opportunity. Please try again.");
    }
  };

  return (
    <div className="new-opportunity-container">
      {error && <div className="error">{error}</div>}
      {message && <div className="success">{message}</div>}

      <h2>Post a New Opportunity</h2>
      <form onSubmit={handleSubmit} className="new-opportunity-form">
        <div className="form-row">
          <div className="form-group">
            <label htmlFor="title">Title</label>
            <input
              type="text"
              id="title"
              name="title"
              value={opportunityData.title}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="location">Location</label>
            <input
              type="text"
              id="location"
              name="location"
              value={opportunityData.location}
              onChange={handleChange}
              required
            />
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label htmlFor="description">Description</label>
            <textarea
              id="description"
              name="description"
              value={opportunityData.description}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="salaryRange">Salary Range</label>
            <input
              type="text"
              id="salaryRange"
              name="salaryRange"
              value={opportunityData.salaryRange}
              onChange={handleChange}
              required
            />
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label htmlFor="requirements">Requirements</label>
            <textarea
              id="requirements"
              name="requirements"
              value={opportunityData.requirements}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="type">Job Type</label>
            <input
              type="text"
              id="type"
              name="type"
              value={opportunityData.type}
              onChange={handleChange}
              required
            />
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label htmlFor="email">Contact Email</label>
            <input
              type="email"
              id="email"
              name="email"
              value={opportunityData.email}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="isFilled">Is Filled?</label>
            <input
              type="checkbox"
              id="isFilled"
              name="isFilled"
              checked={opportunityData.isFilled}
              onChange={() =>
                setOpportunityData({
                  ...opportunityData,
                  isFilled: !opportunityData.isFilled,
                })
              }
            />
          </div>
        </div>

        <div className="form-row">
          <button type="submit" className="submit-btn">
            Post Opportunity
          </button>
        </div>
      </form>
    </div>
  );
};

export default NewOpportunity;