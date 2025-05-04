'use client';

import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"; // Import Card components
import { Skeleton } from "@/components/ui/skeleton"; // Import Skeleton
import Link from "next/link"; // Import Link for URLs
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Terminal, Link as LinkIcon, User, Mail, Type, Verified, Tv, Hash, Clapperboard, Edit } from "lucide-react"; // Import icons
import { Badge } from "@/components/ui/badge"; // Import Badge
import { Button } from "@/components/ui/button"; // Import Button
import { Separator } from "@/components/ui/separator"; // Import Separator

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
       const backendUrl = `https://wcontent-app-latest.onrender.com/api/users/getUser/${userId}`;
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
           fetchErrorMessage = `Error fetching user data. Could not connect to the server at https://wcontent-app-latest.onrender.com. Please ensure the backend is running and CORS is configured correctly.`;
       }
      setError(fetchErrorMessage);
    } finally {
      setLoading(false); // Stop loading after the request is complete
    }
  };

  // Render loading state
  if (loading) {
    return (
      <Card>
         <CardHeader>
            <Skeleton className="h-8 w-1/3 mb-2"/>
            <Skeleton className="h-4 w-2/3"/>
         </CardHeader>
         <CardContent className="space-y-6">
            <div className="space-y-3">
               <Skeleton className="h-4 w-1/4" />
               <Skeleton className="h-4 w-3/4" />
            </div>
             <Separator />
            <div className="space-y-3">
               <Skeleton className="h-4 w-1/4" />
               <Skeleton className="h-4 w-3/4" />
            </div>
            <Separator />
            <div className="space-y-3">
               <Skeleton className="h-4 w-1/4" />
               <Skeleton className="h-4 w-3/4" />
            </div>
             {/* Skeleton for potential channel info */}
             <Separator />
             <Skeleton className="h-5 w-1/3 mb-3" />
             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-3"><Skeleton className="h-4 w-1/4" /><Skeleton className="h-4 w-3/4" /></div>
                <div className="space-y-3"><Skeleton className="h-4 w-1/4" /><Skeleton className="h-4 w-3/4" /></div>
                <div className="space-y-3 md:col-span-2"><Skeleton className="h-4 w-1/4" /><Skeleton className="h-4 w-3/4" /></div>
             </div>
         </CardContent>
      </Card>
    );
  }

  // Render error state
  if (error) {
     return (
        <Alert variant="destructive">
           <Terminal className="h-4 w-4" />
           <AlertTitle>Error Loading Profile</AlertTitle>
           <AlertDescription>{error}</AlertDescription>
        </Alert>
     );
  }

  // Helper to display profile data
  const ProfileField = ({ icon: Icon, label, value, isLink = false, href = "#", breakWord = false }) => (
    <div className="flex flex-col sm:flex-row sm:items-center space-y-1 sm:space-y-0 sm:space-x-4">
      <dt className="text-sm font-medium text-muted-foreground flex items-center w-full sm:w-1/4 shrink-0">
        <Icon className="h-4 w-4 mr-2 shrink-0" />
        {label}
      </dt>
      <dd className={`text-sm text-foreground sm:w-3/4 ${breakWord ? 'break-all' : ''}`}>
        {isLink && value ? (
          <Link href={href} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline flex items-center gap-1">
            {value} <LinkIcon className="h-3 w-3" />
          </Link>
        ) : (
          value || <span className="text-muted-foreground italic">N/A</span>
        )}
      </dd>
    </div>
  );


  // Render the profile data
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
         <div>
           <CardTitle className="text-2xl font-bold">My Profile</CardTitle>
           <CardDescription>View your account details.</CardDescription>
         </div>
         <Button variant="outline" size="sm" asChild>
             <Link href="/dashboard/update">
                <Edit className="mr-2 h-4 w-4"/> Edit Profile
             </Link>
         </Button>
      </CardHeader>
      <CardContent>
         {userData ? (
            <dl className="space-y-6">
               {/* Basic Information Section */}
               <div>
                 <h3 className="text-lg font-semibold mb-4 text-primary">Basic Information</h3>
                 <div className="space-y-4">
                    <ProfileField icon={User} label="Username" value={userData.username} />
                    <ProfileField icon={Mail} label="Email" value={userData.email} breakWord={true} />
                    <ProfileField icon={Type} label="User Type" value={userData.userType?.replace(/([A-Z])/g, ' $1').trim()} />
                    <div> {/* Custom layout for Verified Status */}
                        <div className="flex flex-col sm:flex-row sm:items-center space-y-1 sm:space-y-0 sm:space-x-4">
                            <dt className="text-sm font-medium text-muted-foreground flex items-center w-full sm:w-1/4 shrink-0">
                                <Verified className="h-4 w-4 mr-2 shrink-0" />
                                Status
                            </dt>
                            <dd className="text-sm text-foreground sm:w-3/4">
                                <Badge variant={userData.verified ? "default" : "destructive"} className={userData.verified ? "bg-green-600 dark:bg-green-700 hover:bg-green-700" : ""}>
                                    {userData.verified ? "Verified" : "Not Verified"}
                                </Badge>
                            </dd>
                        </div>
                    </div>
                 </div>
               </div>

               {/* Channel Information Section (conditional) */}
               {userData.userType?.toLowerCase() === 'channelowner' && (
                 <div>
                   <Separator className="my-6" />
                   <h3 className="text-lg font-semibold mb-4 text-primary">Channel Details</h3>
                   <div className="space-y-4">
                      <ProfileField icon={Clapperboard} label="Channel Name" value={userData.channelName} />
                      <ProfileField icon={Hash} label="Channel ID" value={userData.channelId} breakWord={true} />
                      <ProfileField icon={Tv} label="Channel URL" value={userData.channelURL || 'Visit Channel'} href={userData.channelURL} isLink={!!userData.channelURL} breakWord={true}/>
                   </div>
                 </div>
               )}

            </dl>
         ) : (
             !loading && <p className="text-muted-foreground">No user data found. There might be an issue retrieving your profile.</p>
         )}
      </CardContent>
    </Card>
  );
};


export default function DashboardPage() {
  // Render the MyProfile component content directly
  return <MyProfile />;
}
