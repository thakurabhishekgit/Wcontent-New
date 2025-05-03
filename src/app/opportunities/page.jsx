'use client'; // Add this directive

import React, { useState, useEffect } from "react";
import axios from "axios";
// import HowitWorks from "../components/HowItWorks"; // Assuming this component exists and is compatible

// Placeholder for HowitWorks component if it's not available yet
const HowitWorks = () => (
  <div className="p-4 my-4 bg-card rounded-lg border">
    <h2 className="text-xl font-semibold mb-2">How It Works (Placeholder)</h2>
    <p>1. Browse Opportunities.</p>
    <p>2. Click 'Apply Now' on an opportunity you like.</p>
    <p>3. Fill out the application form.</p>
  </div>
);


// Replaced inline styles with Tailwind CSS classes
const Opportunities = () => {
  const [opportunities, setOpportunities] = useState([]);
  const [selectedOpportunity, setSelectedOpportunity] = useState(null);
  const [application, setApplication] = useState({
    name: "",
    email: "",
    resumeUrl: "", // Changed from resume to resumeUrl for clarity
    applicationDate: new Date().toISOString().split("T")[0],
  });
  const [submissionStatus, setSubmissionStatus] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);


  useEffect(() => {
    fetchOpportunities();
  }, []);

  const fetchOpportunities = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await axios.get(
        "http://localhost:3001/api/users/opportunities/opportunitiesGetAll"
      );
       // Make sure the response data is an array and has the expected 'id' property
      if (Array.isArray(response.data)) {
          // Ensure each opportunity has a unique 'id'. If not, assign one (e.g., index) or fix backend.
          const opportunitiesWithId = response.data.map((opp, index) => ({
             ...opp,
             // Assuming the backend might send _id or similar, try to use it. Fallback to index if needed.
             id: opp.id || opp._id || index
          }));
         setOpportunities(opportunitiesWithId);
      } else {
         console.error("API response is not an array:", response.data);
         setError("Received invalid data format from the server.");
         setOpportunities([]); // Set to empty array to avoid map errors
      }
    } catch (error) {
      console.error("Error fetching opportunities:", error);
       setError("Failed to fetch opportunities. Please check the API endpoint and your connection.");
       setOpportunities([]); // Set to empty array on error
    } finally {
       setIsLoading(false);
    }
  };

  const handleCardClick = (opportunity) => {
    setSelectedOpportunity(opportunity);
    setSubmissionStatus(null); // Reset submission status
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setApplication({ ...application, [name]: value });
  };

  const handleApply = async (e) => {
    e.preventDefault();
    if (!selectedOpportunity) return;

    setSubmissionStatus('Submitting...'); // Indicate submission start

    try {
      // Ensure selectedOpportunity.id exists
      if (!selectedOpportunity.id && selectedOpportunity.id !== 0) {
          throw new Error("Selected opportunity is missing an ID.");
      }

      const response = await axios.post(
        `http://localhost:3001/api/users/application/opportunity/${selectedOpportunity.id}/apply`,
        application
      );
      setSubmissionStatus("Application submitted successfully!");
      setApplication({ // Reset form
        name: "",
        email: "",
        resumeUrl: "",
        applicationDate: new Date().toISOString().split("T")[0],
      });
       // Optionally close the details/form section after successful application
       // setSelectedOpportunity(null);
    } catch (error) {
      console.error("Error applying for opportunity:", error);
       const errorMessage = error.response?.data?.message || "Failed to submit application. Please try again.";
      setSubmissionStatus(errorMessage);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 space-y-8">
      {/* How It Works Section */}
      <HowitWorks />

      {/* Divider */}
      <hr className="border-border my-6" />

      {/* CTA Section */}
      <div className="bg-gradient-to-r from-primary/10 via-background to-primary/10 p-8 rounded-lg text-center border border-primary/20">
        <h2 className="text-2xl md:text-3xl font-bold mb-4 text-primary">Ready to Find Your Next Gig?</h2>
        <p className="text-lg text-foreground/80 max-w-2xl mx-auto">
          Explore exciting opportunities posted by brands and businesses, perfect for your skills and niche.
        </p>
      </div>

      {/* Loading and Error States */}
       {isLoading && <p className="text-center text-foreground/70">Loading opportunities...</p>}
       {error && <p className="text-center text-destructive bg-destructive/10 border border-destructive/50 p-3 rounded-md">{error}</p>}


      {/* Opportunities Grid */}
      {!isLoading && !error && opportunities.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {opportunities.map((opportunity) => (
            <div
              key={opportunity.id} // Use the guaranteed unique ID
              className="bg-card border border-border rounded-lg p-5 shadow hover:shadow-lg transition-shadow duration-300 cursor-pointer flex flex-col justify-between"
              onClick={() => handleCardClick(opportunity)}
            >
              <div>
                <h3 className="text-lg font-semibold text-card-foreground mb-2">{opportunity.title}</h3>
                <p className="text-sm text-muted-foreground mb-1">Location: {opportunity.location || 'N/A'}</p>
                <p className="text-sm text-muted-foreground mb-1">Type: {opportunity.type || 'N/A'}</p>
                <p className="text-sm text-muted-foreground mb-3">Salary: {opportunity.salaryRange || 'N/A'}</p>
              </div>
              <button
                 className="mt-auto w-full bg-primary text-primary-foreground px-4 py-2 rounded-md text-sm font-medium hover:bg-primary/90 transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                onClick={(e) => {
                  e.stopPropagation(); // Prevent card click when clicking button
                  handleCardClick(opportunity);
                }}
              >
                View & Apply
              </button>
            </div>
          ))}
        </div>
      )}
       {!isLoading && !error && opportunities.length === 0 && (
          <p className="text-center text-foreground/70">No opportunities found at the moment.</p>
       )}

      {/* Selected Opportunity Details and Application Form */}
      {selectedOpportunity && (
        <div className="mt-10 p-6 border border-border rounded-lg bg-card shadow-lg flex flex-col lg:flex-row gap-8">
          {/* Details Section */}
          <div className="flex-grow lg:w-2/3">
            <h2 className="text-2xl font-bold mb-3 text-primary">{selectedOpportunity.title}</h2>
            <p className="text-foreground/80 mb-4">{selectedOpportunity.description || 'No description available.'}</p>
            <p className="mb-2"><strong>Requirements:</strong> {selectedOpportunity.requirements || 'N/A'}</p>
            <p className="mb-2"><strong>Location:</strong> {selectedOpportunity.location || 'N/A'}</p>
            <p className="mb-2"><strong>Type:</strong> {selectedOpportunity.type || 'N/A'}</p>
            <p><strong>Salary Range:</strong> {selectedOpportunity.salaryRange || 'N/A'}</p>
             <button onClick={() => setSelectedOpportunity(null)} className="mt-4 text-sm text-primary hover:underline">Close Details</button>
          </div>

          {/* Application Form Section */}
          <div className="lg:w-1/3 bg-background p-6 rounded-md border border-border">
            <h3 className="text-xl font-semibold mb-4 text-center">Apply Now</h3>
             {submissionStatus && (
              <p className={`mb-4 text-sm text-center p-2 rounded ${submissionStatus.includes("success") ? "bg-green-100 text-green-800 border border-green-300" : "bg-destructive/10 text-destructive border border-destructive/50"}`}>
                {submissionStatus}
              </p>
            )}
            <form onSubmit={handleApply} className="space-y-4">
              <div>
                <label htmlFor="name" className="block text-sm font-medium mb-1 text-foreground/90">Name:</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={application.name}
                  onChange={handleInputChange}
                  required
                  className="w-full px-3 py-2 border border-input rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                />
              </div>
              <div>
                 <label htmlFor="email" className="block text-sm font-medium mb-1 text-foreground/90">Email:</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={application.email}
                  onChange={handleInputChange}
                  required
                   className="w-full px-3 py-2 border border-input rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                />
              </div>
              <div>
                <label htmlFor="resumeUrl" className="block text-sm font-medium mb-1 text-foreground/90">Portfolio/Work URL:</label>
                <input
                  type="url"
                  id="resumeUrl"
                  name="resumeUrl"
                  value={application.resumeUrl}
                  onChange={handleInputChange}
                  required
                  placeholder="https://yourportfolio.com"
                   className="w-full px-3 py-2 border border-input rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                />
              </div>
              <div>
                 <label htmlFor="applicationDate" className="block text-sm font-medium mb-1 text-foreground/90">Application Date:</label>
                <input
                  type="date"
                  id="applicationDate"
                  name="applicationDate"
                  value={application.applicationDate}
                  onChange={handleInputChange}
                  required
                   className="w-full px-3 py-2 border border-input rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                />
              </div>
              <button
                type="submit"
                 className="w-full bg-primary text-primary-foreground px-4 py-2 rounded-md font-medium hover:bg-primary/90 transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:opacity-50"
                 disabled={submissionStatus === 'Submitting...'}
              >
                {submissionStatus === 'Submitting...' ? 'Submitting...' : 'Submit Application'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Opportunities;
