'use client';

import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"; // Import Card components
import { Skeleton } from "@/components/ui/skeleton"; // Import Skeleton
import Link from "next/link"; // Import Link for URLs

// Moved MyProfile component logic directly into the dashboard page
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
    } else {
       // Handle server-side rendering or situations where localStorage is not available
       setLoading(false);
       setError("Cannot fetch user data outside of a browser environment.");
    }
  }, []);

  // Fetch user data from the backend
  const fetchUserData = async (userId, token) => {
    setLoading(true);
    setError("");
    try {
       // Ensure the backend URL is correct and accessible
       const backendUrl = `http://localhost:3001/api/users/getUser/${userId}`;
       console.log(`Fetching user data from: ${backendUrl}`);

      const response = await fetch(backendUrl, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`, // Send the token in the Authorization header
          },
        }
      );

      console.log(`Response status: ${response.status}`);

      if (response.ok) {
        const data = await response.json();
        console.log("User data received:", data);
        setUserData(data); // Set user data if request is successful
      } else {
        const data = await response.json().catch(() => ({ message: `Failed to fetch user data. Status: ${response.status} ${response.statusText}` }));
         console.error("Error fetching user data:", data);
        setError(data.message || `Failed to fetch user data. Status: ${response.status}`);
      }
    } catch (error) {
      console.error("Network or other error fetching user data:", error);
       let fetchErrorMessage = "Error fetching user data. Please check your connection and ensure the backend is running.";
       if (error instanceof TypeError && error.message === 'Failed to fetch') {
           fetchErrorMessage = `Error fetching user data. Could not connect to the server at http://localhost:3001. Please ensure the backend is running and CORS is configured correctly.`;
       }
      setError(fetchErrorMessage);
    } finally {
      setLoading(false); // Stop loading after the request is complete
    }
  };

  // Render loading state
  if (loading) {
    return (
      <div>
        <h1 className="text-2xl font-bold mb-4">My Profile</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card><CardHeader><Skeleton className="h-5 w-24 mb-1" /></CardHeader><CardContent><Skeleton className="h-4 w-full" /></CardContent></Card>
          <Card><CardHeader><Skeleton className="h-5 w-24 mb-1" /></CardHeader><CardContent><Skeleton className="h-4 w-full" /></CardContent></Card>
          <Card><CardHeader><Skeleton className="h-5 w-24 mb-1" /></CardHeader><CardContent><Skeleton className="h-4 w-1/2" /></CardContent></Card>
          <Card><CardHeader><Skeleton className="h-5 w-24 mb-1" /></CardHeader><CardContent><Skeleton className="h-4 w-1/4" /></CardContent></Card>
          <Card><CardHeader><Skeleton className="h-5 w-32 mb-1" /></CardHeader><CardContent><Skeleton className="h-4 w-3/4" /></CardContent></Card>
          <Card><CardHeader><Skeleton className="h-5 w-28 mb-1" /></CardHeader><CardContent><Skeleton className="h-4 w-full" /></CardContent></Card>
           <Card className="md:col-span-2"><CardHeader><Skeleton className="h-5 w-32 mb-1" /></CardHeader><CardContent><Skeleton className="h-4 w-5/6" /></CardContent></Card>
        </div>
      </div>
    );
  }

  // Render error state
  if (error) {
     return (
        <div>
           <h1 className="text-2xl font-bold mb-4">My Profile</h1>
           <p className="text-destructive bg-destructive/10 border border-destructive/50 p-3 rounded-md">{error}</p>
        </div>
     );
  }

  // Render the profile data
  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">My Profile</h1>
      {userData ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-base font-semibold text-muted-foreground">Username</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-lg">{userData.username}</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
               <CardTitle className="text-base font-semibold text-muted-foreground">Email</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-lg">{userData.email}</p>
            </CardContent>
          </Card>
          <Card>
             <CardHeader>
               <CardTitle className="text-base font-semibold text-muted-foreground">User Type</CardTitle>
             </CardHeader>
            <CardContent>
               <p className="text-lg capitalize">{userData.userType || 'N/A'}</p> {/* Added capitalize */}
            </CardContent>
          </Card>
          <Card>
             <CardHeader>
               <CardTitle className="text-base font-semibold text-muted-foreground">Verified</CardTitle>
             </CardHeader>
            <CardContent>
              <p className={`text-lg ${userData.verified ? 'text-green-500' : 'text-destructive'}`}>{userData.verified ? "Yes" : "No"}</p>
            </CardContent>
          </Card>

          {/* Channel Information (conditionally rendered if user is ChannelOwner) */}
          {userData.userType?.toLowerCase() === 'channelowner' && (
             <>
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base font-semibold text-muted-foreground">Channel Name</CardTitle>
                  </CardHeader>
                  <CardContent>
                     <p className="text-lg">{userData.channelName || 'N/A'}</p>
                  </CardContent>
                 </Card>
                 <Card>
                   <CardHeader>
                      <CardTitle className="text-base font-semibold text-muted-foreground">Channel ID</CardTitle>
                   </CardHeader>
                   <CardContent>
                      <p className="text-lg">{userData.channelId || 'N/A'}</p>
                   </CardContent>
                 </Card>
                 <Card className="md:col-span-2">
                   <CardHeader>
                     <CardTitle className="text-base font-semibold text-muted-foreground">Channel URL</CardTitle>
                   </CardHeader>
                   <CardContent>
                     {userData.channelURL ? (
                       <Link
                         href={userData.channelURL}
                         target="_blank"
                         rel="noopener noreferrer"
                         className="text-lg text-primary hover:underline break-all"
                       >
                         {userData.channelURL}
                       </Link>
                     ) : <p className="text-lg text-muted-foreground">N/A</p>}
                   </CardContent>
                 </Card>
             </>
          )}
        </div>
      ) : (
        <p className="text-muted-foreground">No user data found. There might be an issue retrieving your profile.</p>
      )}
    </div>
  );
};


export default function DashboardPage() {
  // Render the MyProfile component content directly
  return <MyProfile />;
}
