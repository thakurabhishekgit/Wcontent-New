'use client'; // Required for hooks like useState, useEffect

import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Terminal, CheckCircle, Loader2 } from "lucide-react"; // Import icons, added Loader2
import { Skeleton } from "@/components/ui/skeleton"; // Import Skeleton

const UpdateProfile = () => {
  const [userData, setUserData] = useState({
    username: "",
    email: "",
    userType: "",
    channelName: "",
    channelId: "",
    channelURL: "",
    // password: "", // Remove initial password state
  });
  const [newPassword, setNewPassword] = useState(""); // State for new password input
  const [confirmPassword, setConfirmPassword] = useState(""); // State for confirm password input
  const [error, setError] = useState(null);
  const [message, setMessage] = useState(null);
  const [isLoading, setIsLoading] = useState(true); // Loading state for fetching
  const [isSubmitting, setIsSubmitting] = useState(false); // Submitting state for form submission
  const [isClient, setIsClient] = useState(false); // State to track client-side mount

  // Ensure code runs only on the client
  useEffect(() => {
    setIsClient(true);
  }, []);


  // Fetch user data on component mount (client-side only)
  useEffect(() => {
     if(isClient) {
        const token = localStorage.getItem("token");
        const userId = localStorage.getItem("id");

        if (token && userId) {
          fetchUserData(userId, token);
        } else {
          setError("User not logged in. Please login again.");
          setIsLoading(false); // Stop loading if not logged in
        }
     }
  }, [isClient]); // Depend on isClient

  const fetchUserData = async (userId, token) => {
    setIsLoading(true);
    setError(null);
    setMessage(null);
    try {
      const response = await fetch(
        `http://localhost:3001/api/users/getUser/${userId}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.ok) {
        const data = await response.json();
        // Don't pre-fill password fields for security
        setUserData({ ...data, password: "" }); // Initialize with fetched data, ensure password field is empty
      } else {
        const data = await response.json().catch(() => ({ message: "Failed to fetch user data." }));
        setError(data.message || "Failed to fetch user data.");
      }
    } catch (error) {
       console.error("Fetch User Data Error:", error);
       let fetchErrorMessage = "Error fetching profile data. Please check your connection.";
       if (error instanceof TypeError && error.message === 'Failed to fetch') {
         fetchErrorMessage = `Error fetching profile. Could not connect to the server at http://localhost:3001. Ensure the backend is running and CORS is configured.`;
       }
      setError(fetchErrorMessage);
    } finally {
       setIsLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUserData({
      ...userData,
      [name]: value,
    });
     // Clear error/message when user starts typing
     setError(null);
     setMessage(null);
  };

   // Handle Select component change
   const handleSelectChange = (value) => {
     setUserData({ ...userData, userType: value });
     setError(null);
     setMessage(null);
   };

  const handlePasswordChange = (e) => {
     setNewPassword(e.target.value);
     setError(null);
     setMessage(null);
   };

   const handleConfirmPasswordChange = (e) => {
     setConfirmPassword(e.target.value);
     setError(null);
     setMessage(null);
   };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setMessage(null);
    setIsSubmitting(true); // Indicate submission start

    const token = localStorage.getItem("token");
    const userId = localStorage.getItem("id");

    if (!token || !userId) {
      setError("User not logged in. Please login again.");
       setIsSubmitting(false);
      return;
    }

    // Basic password confirmation validation
     if (newPassword && newPassword !== confirmPassword) {
       setError("New passwords do not match.");
       setIsSubmitting(false);
       return;
     }
     // Password strength (example: min 6 chars)
     if (newPassword && newPassword.length < 6) {
        setError("New password must be at least 6 characters long.");
        setIsSubmitting(false);
        return;
     }


     // Prepare data payload, including new password only if provided and valid
     const updatePayload = { ...userData };
     // Ensure channel fields are only sent if userType is ChannelOwner
     if (userData.userType?.toLowerCase() !== 'channelowner') {
         delete updatePayload.channelName;
         delete updatePayload.channelId;
         delete updatePayload.channelURL;
     }

     if (newPassword) {
       updatePayload.password = newPassword;
     } else {
       // If no new password, remove password field from payload
       delete updatePayload.password;
     }


    try {
      const response = await fetch(
        `http://localhost:3001/api/users/update/${userId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(updatePayload),
        }
      );

      if (response.ok) {
        setMessage("Profile updated successfully!");
         setNewPassword(""); // Clear password fields on success
         setConfirmPassword("");
         // Optionally re-fetch user data to show updated info, or update state directly
         // fetchUserData(userId, token); // Re-fetch data after update (already done in effect)
         // Update username in localStorage if changed
         if (updatePayload.username && localStorage.getItem('username') !== updatePayload.username) {
            localStorage.setItem('username', updatePayload.username);
            // Optionally trigger a refresh or state update in a higher component if username is displayed elsewhere
         }
      } else {
        const data = await response.json().catch(() => ({message: "Failed to update profile."}));
        setError(data.message || "Failed to update profile.");
      }
    } catch (error) {
      console.error("Update Profile Error:", error);
      let updateErrorMessage = "Error updating profile. Please try again.";
       if (error instanceof TypeError && error.message === 'Failed to fetch') {
         updateErrorMessage = `Error updating profile. Could not connect to the server at http://localhost:3001. Ensure the backend is running and CORS is configured.`;
       }
      setError(updateErrorMessage);
    } finally {
       setIsSubmitting(false); // Stop submitting state
    }
  };


  // Render Loading Skeleton
   if (isLoading) { // Show skeleton only on initial load
     return (
       <Card>
         <CardHeader>
           <CardTitle>Update Profile</CardTitle>
           <CardDescription>Manage your account settings.</CardDescription>
         </CardHeader>
         <CardContent className="space-y-6">
           <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
             <div className="space-y-2"><Skeleton className="h-4 w-20" /><Skeleton className="h-10 w-full" /></div>
             <div className="space-y-2"><Skeleton className="h-4 w-20" /><Skeleton className="h-10 w-full" /></div>
           </div>
           <div className="space-y-2"><Skeleton className="h-4 w-24" /><Skeleton className="h-10 w-full" /></div>
            {/* Conditional Skeleton based on potential user type */}
            <div className="space-y-4 pt-4 border-t">
               <Skeleton className="h-5 w-32 mb-2" />
              <div className="space-y-2"><Skeleton className="h-4 w-28" /><Skeleton className="h-10 w-full" /></div>
               <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2"><Skeleton className="h-4 w-24" /><Skeleton className="h-10 w-full" /></div>
                  <div className="space-y-2"><Skeleton className="h-4 w-24" /><Skeleton className="h-10 w-full" /></div>
               </div>
            </div>
             <div className="space-y-4 pt-4 border-t">
                <Skeleton className="h-5 w-48 mb-2" />
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2"><Skeleton className="h-4 w-28" /><Skeleton className="h-10 w-full" /></div>
                  <div className="space-y-2"><Skeleton className="h-4 w-36" /><Skeleton className="h-10 w-full" /></div>
                </div>
             </div>
         </CardContent>
         <CardFooter>
           <Skeleton className="h-10 w-32" />
         </CardFooter>
       </Card>
     );
   }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Update Profile</CardTitle>
        <CardDescription>Manage your account settings. Leave password fields blank to keep your current password.</CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-6">
          {error && (
            <Alert variant="destructive">
              <Terminal className="h-4 w-4" />
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          {message && (
            <Alert variant="default" className="bg-green-100 dark:bg-green-900/30 border-green-300 dark:border-green-700 text-green-700 dark:text-green-300">
               <CheckCircle className="h-4 w-4 text-current" /> {/* Use text-current */}
               <AlertTitle className="text-current font-semibold">Success</AlertTitle> {/* Use text-current */}
              <AlertDescription className="text-current">{message}</AlertDescription> {/* Use text-current */}
            </Alert>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="username">Username</Label>
              <Input
                id="username"
                name="username"
                value={userData.username || ''}
                onChange={handleChange}
                required
                disabled={isSubmitting}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                type="email"
                id="email"
                name="email"
                value={userData.email || ''}
                onChange={handleChange}
                required
                disabled={isSubmitting}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="userType">User Type</Label>
             <Select
                 name="userType"
                 value={userData.userType || ''}
                 onValueChange={handleSelectChange}
                 required
                 disabled={isSubmitting}
               >
                 <SelectTrigger id="userType">
                   <SelectValue placeholder="Select your role" />
                 </SelectTrigger>
                 <SelectContent>
                   <SelectItem value="ChannelOwner">Channel Owner</SelectItem>
                   <SelectItem value="RoleSeeker">Role Seeker</SelectItem>
                 </SelectContent>
               </Select>
          </div>

          {/* Conditionally render channel fields */}
          {userData.userType?.toLowerCase() === 'channelowner' && (
            <div className="space-y-4 pt-4 border-t border-border/50"> {/* Added border */}
               <h3 className="text-md font-semibold text-muted-foreground">Channel Details</h3>
              <div className="space-y-2">
                <Label htmlFor="channelName">Channel Name</Label>
                <Input
                  id="channelName"
                  name="channelName"
                  value={userData.channelName || ''}
                  onChange={handleChange}
                   required={userData.userType === 'ChannelOwner'}
                   disabled={isSubmitting}
                   placeholder="Your YouTube Channel Name"
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                 <div className="space-y-2">
                   <Label htmlFor="channelId">Channel ID</Label>
                   <Input
                     id="channelId"
                     name="channelId"
                     value={userData.channelId || ''}
                     onChange={handleChange}
                     required={userData.userType === 'ChannelOwner'}
                     disabled={isSubmitting}
                     placeholder="Your YouTube Channel ID"
                   />
                 </div>
                 <div className="space-y-2">
                   <Label htmlFor="channelURL">Channel URL</Label>
                   <Input
                     type="url"
                     id="channelURL"
                     name="channelURL"
                     value={userData.channelURL || ''}
                     onChange={handleChange}
                      required={userData.userType === 'ChannelOwner'}
                      disabled={isSubmitting}
                      placeholder="https://youtube.com/..."
                   />
                 </div>
              </div>
            </div>
          )}

          <div className="space-y-4 pt-4 border-t border-border/50"> {/* Added border */}
             <h3 className="text-md font-semibold text-muted-foreground">Update Password (Optional)</h3>
             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="newPassword">New Password</Label>
                  <Input
                    type="password"
                    id="newPassword"
                    name="newPassword"
                    value={newPassword}
                    onChange={handlePasswordChange}
                    placeholder="Enter new password (min. 6 chars)"
                    disabled={isSubmitting}
                    minLength={6} // Added minLength for basic validation hint
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">Confirm New Password</Label>
                  <Input
                    type="password"
                    id="confirmPassword"
                    name="confirmPassword"
                    value={confirmPassword}
                    onChange={handleConfirmPasswordChange}
                     placeholder="Confirm new password"
                     disabled={isSubmitting}
                     minLength={6}
                  />
                </div>
              </div>
              <p className="text-xs text-muted-foreground">Leave blank to keep your current password.</p>
          </div>

        </CardContent>
        <CardFooter>
          <Button type="submit" disabled={isSubmitting || isLoading}>
             {isSubmitting ? (
               <>
                 <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                 Updating...
               </>
             ) : (
               "Update Profile"
             )}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
};

export default UpdateProfile;
