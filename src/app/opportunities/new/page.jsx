'use client'; // Add 'use client' directive

import React, { useState, useEffect } from "react";
import { useRouter } from 'next/navigation';

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
  const [isClient, setIsClient] = useState(false); // State to track client-side mount
  const [isLoading, setIsLoading] = useState(false); // Loading state for form submission

   useEffect(() => {
     setIsClient(true); // Component has mounted
   }, []);

  const handleChange = (e) => {
    setOpportunityData({
      ...opportunityData,
      [e.target.name]: e.target.value,
    });
     setError(null); // Clear error/message on change
     setMessage(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setMessage(null);
    setIsLoading(true); // Start loading

    const token = localStorage.getItem("token");
    const userId = localStorage.getItem("id");

    if (!token || !userId) {
      setError("User not logged in. Please login again.");
      setIsLoading(false); // Stop loading
      return;
    }

    try {
      const response = await fetch(
        `https://wcontent-app-latest.onrender.com/api/users/opportunities/opportunity/${userId}`, // Use deployed URL
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
        // Clear form or redirect user
        setOpportunityData({
           title: "",
           description: "",
           requirements: "",
           location: "",
           type: "",
           salaryRange: "",
           isFilled: false,
           email: "",
        });
      } else {
        const data = await response.json().catch(() => ({message: "Failed to post opportunity."}));
        setError(data.message || "Failed to post opportunity.");
      }
    } catch (error) {
      console.error("Error posting opportunity:", error);
       let fetchErrorMessage = "Error posting opportunity. Please try again.";
       if (isClient && error instanceof TypeError && error.message.includes('fetch')) {
          fetchErrorMessage = `Error posting opportunity. Could not connect to the server at https://wcontent-app-latest.onrender.com. Please ensure the backend is running and CORS is configured correctly.`;
       }
      setError(fetchErrorMessage);
    } finally {
      setIsLoading(false); // Stop loading
    }
  };

   // Prevent rendering on server until client is ready
   if (!isClient) {
     return null; // Or a basic loading skeleton
   }

  return (
    <div className="new-opportunity-container max-w-3xl mx-auto p-4"> {/* Added styling */}
      {error && <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">{error}</div>} {/* Improved styling */}
      {message && <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative mb-4" role="alert">{message}</div>} {/* Improved styling */}

      <h2 className="text-2xl font-bold mb-6">Post a New Opportunity</h2> {/* Improved styling */}
      <form onSubmit={handleSubmit} className="new-opportunity-form space-y-4"> {/* Improved styling */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4"> {/* Grid layout */}
          <div className="form-group">
            <label htmlFor="title" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Title</label> {/* Improved label styling */}
            <input
              type="text"
              id="title"
              name="title"
              value={opportunityData.title}
              onChange={handleChange}
              required
              className="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm dark:bg-gray-700 dark:text-white" // Improved input styling
              disabled={isLoading} // Disable input when loading
            />
          </div>

          <div className="form-group">
            <label htmlFor="location" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Location</label>
            <input
              type="text"
              id="location"
              name="location"
              value={opportunityData.location}
              onChange={handleChange}
              required
              className="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm dark:bg-gray-700 dark:text-white"
              disabled={isLoading}
            />
          </div>
        </div>

        <div className="form-group">
          <label htmlFor="description" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Description</label>
          <textarea
            id="description"
            name="description"
            value={opportunityData.description}
            onChange={handleChange}
            required
             rows="4"
             className="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm dark:bg-gray-700 dark:text-white"
             disabled={isLoading}
          />
        </div>

         <div className="form-group">
           <label htmlFor="requirements" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Requirements</label>
           <textarea
             id="requirements"
             name="requirements"
             value={opportunityData.requirements}
             onChange={handleChange}
             required
             rows="3"
             className="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm dark:bg-gray-700 dark:text-white"
             disabled={isLoading}
           />
         </div>

         <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
           <div className="form-group">
             <label htmlFor="type" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Opportunity Type</label>
             <input
               type="text"
               id="type"
               name="type"
               value={opportunityData.type}
               onChange={handleChange}
               required
                className="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm dark:bg-gray-700 dark:text-white"
                disabled={isLoading}
                placeholder="e.g., Paid Gig, Full-Time"
             />
           </div>

            <div className="form-group">
             <label htmlFor="salaryRange" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Salary / Budget</label>
             <input
               type="text"
               id="salaryRange"
               name="salaryRange"
               value={opportunityData.salaryRange}
               onChange={handleChange}
               required
               className="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm dark:bg-gray-700 dark:text-white"
               disabled={isLoading}
               placeholder="e.g., $500, Negotiable"
             />
           </div>
         </div>

         <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-center">
             <div className="form-group">
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Contact Email</label>
              <input
                type="email"
                id="email"
                name="email"
                value={opportunityData.email}
                onChange={handleChange}
                required
                 className="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm dark:bg-gray-700 dark:text-white"
                 disabled={isLoading}
              />
            </div>

           <div className="form-group flex items-center space-x-2 mt-4 md:mt-0"> {/* Flex layout for checkbox */}
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
                className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 dark:border-gray-600 rounded dark:bg-gray-700 dark:checked:bg-indigo-500"
                 disabled={isLoading}
              />
               <label htmlFor="isFilled" className="text-sm font-medium text-gray-700 dark:text-gray-300">Mark as Filled</label>
           </div>
        </div>

        <div className="form-row">
          <button type="submit" className="w-full inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50" disabled={isLoading}> {/* Improved button styling */}
            {isLoading ? 'Posting...' : 'Post Opportunity'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default NewOpportunity;
