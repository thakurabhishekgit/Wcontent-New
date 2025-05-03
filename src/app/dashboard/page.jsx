'use client';

import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"; // Import Card components
import { Skeleton } from "@/components/ui/skeleton"; // Import Skeleton
import Link from "next/link"; // Import Link for URLs
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Terminal, Link as LinkIcon, CheckCircle, User, Mail, Type, Verified, Tv, Hash, Clapperboard } from "lucide-react"; // Import icons

// Moved MyProfile component logic directly into the dashboard page
const MyProfile = () => {
  const [userData, setUserData] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [isClient, setIsClient] = useState(false); // State to track client-side mount

  // Ensure code runs only on the client
  useEffect(() => {
    setIsClient(true);
  }, []);

  // Fetch user data on component mount (client-side only)
  useEffect(() => {
    if (isClient) {
      const userId = localStorage.getItem("id");
      const token = localStorage.getItem("token");

      if (userId && token) {
        fetchUserData(userId, token);
      } else {
        setError("User not authenticated. Please log in.");
        setLoading(false);
      }
    }
  }, [isClient]); // Depend on isClient

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
        <h1 className="text-2xl font-bold mb-6">My Profile</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, index) => ( // Skeleton for 6 cards
            <Card key={index}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                 <Skeleton className="h-5 w-24" />
                 <Skeleton className="h-4 w-4 rounded-full" />
              </CardHeader>
              <CardContent>
                 <Skeleton className="h-6 w-1/2 mb-1" />
                 <Skeleton className="h-4 w-full" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  // Render error state
  if (error) {
     return (
        <div>
           <h1 className="text-2xl font-bold mb-4">My Profile</h1>
           <Alert variant="destructive">
              <Terminal className="h-4 w-4" />
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
           </Alert>
        </div>
     );
  }

  // Render the profile data
  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">My Profile</h1>
      {userData ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Username */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Username</CardTitle>
              <User className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-xl font-bold">{userData.username}</div>
              <p className="text-xs text-muted-foreground">Your public display name</p>
            </CardContent>
          </Card>

          {/* Email */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Email</CardTitle>
              <Mail className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-xl font-bold break-all">{userData.email}</div>
              <p className="text-xs text-muted-foreground">Your login email address</p>
            </CardContent>
          </Card>

          {/* User Type */}
          <Card>
             <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
               <CardTitle className="text-sm font-medium">User Type</CardTitle>
               <Type className="h-4 w-4 text-muted-foreground" />
             </CardHeader>
            <CardContent>
               <div className="text-xl font-bold capitalize">{userData.userType?.replace(/([A-Z])/g, ' $1').trim() || 'N/A'}</div>
               <p className="text-xs text-muted-foreground">Your role on the platform</p>
            </CardContent>
          </Card>

           {/* Verified Status */}
           <Card>
             <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
               <CardTitle className="text-sm font-medium">Verified Status</CardTitle>
                <Verified className={`h-4 w-4 ${userData.verified ? 'text-green-500' : 'text-muted-foreground'}`} />
             </CardHeader>
            <CardContent>
              <div className={`text-xl font-bold ${userData.verified ? 'text-green-600 dark:text-green-400' : 'text-destructive'}`}>
                {userData.verified ? "Verified" : "Not Verified"}
              </div>
              <p className="text-xs text-muted-foreground">Email verification status</p>
            </CardContent>
          </Card>

          {/* Channel Information (conditionally rendered) */}
          {userData.userType?.toLowerCase() === 'channelowner' && (
             <>
                {/* Channel Name */}
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Channel Name</CardTitle>
                     <Clapperboard className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                     <div className="text-xl font-bold">{userData.channelName || 'N/A'}</div>
                     <p className="text-xs text-muted-foreground">Your channel's name</p>
                  </CardContent>
                 </Card>

                 {/* Channel ID */}
                 <Card>
                   <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">Channel ID</CardTitle>
                      <Hash className="h-4 w-4 text-muted-foreground" />
                   </CardHeader>
                   <CardContent>
                      <div className="text-xl font-bold break-all">{userData.channelId || 'N/A'}</div>
                       <p className="text-xs text-muted-foreground">Your unique channel identifier</p>
                   </CardContent>
                 </Card>

                 {/* Channel URL */}
                 <Card className="md:col-span-2 lg:col-span-1"> {/* Adjust span */}
                   <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                     <CardTitle className="text-sm font-medium">Channel URL</CardTitle>
                     <Tv className="h-4 w-4 text-muted-foreground" />
                   </CardHeader>
                   <CardContent>
                     {userData.channelURL ? (
                       <>
                         <div className="text-xl font-bold break-all">
                           <Link
                             href={userData.channelURL}
                             target="_blank"
                             rel="noopener noreferrer"
                             className="text-primary hover:underline flex items-center gap-1"
                           >
                             <span>Visit Channel</span> <LinkIcon className="h-4 w-4" />
                           </Link>
                         </div>
                         <p className="text-xs text-muted-foreground">{userData.channelURL}</p>
                       </>
                     ) : (
                       <>
                         <div className="text-xl font-bold text-muted-foreground">N/A</div>
                         <p className="text-xs text-muted-foreground">No URL provided</p>
                       </>
                     )}
                   </CardContent>
                 </Card>
             </>
          )}
        </div>
      ) : (
        !loading && <p className="text-muted-foreground">No user data found. There might be an issue retrieving your profile.</p>
      )}
    </div>
  );
};


export default function DashboardPage() {
  // Render the MyProfile component content directly
  return <MyProfile />;
}
