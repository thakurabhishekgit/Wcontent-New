'use client'; // Required for hooks like useState, useEffect

import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Terminal, CheckCircle, Loader2, Eye, EyeOff } from "lucide-react"; // Import icons, added Loader2
import { Skeleton } from "@/components/ui/skeleton"; // Import Skeleton

const UpdateProfile = () => {
  const [userData, setUserData] = useState({
    username: "",
    email: "",
    userType: "",
    channelName: "",
    channelId: "",
    channelURL: "",
    password: "", // Will be initialized from fetch or kept as ""
  });
  const [currentPassword, setCurrentPassword] = useState(""); // For existing password input if changing
  const [newPassword, setNewPassword] = useState(""); // State for new password input
  const [confirmPassword, setConfirmPassword] = useState(""); // State for confirm password input
  const [error, setError] = useState(null);
  const [message, setMessage] = useState(null);
  const [isLoading, setIsLoading] = useState(true); // Loading state for fetching
  const [isSubmitting, setIsSubmitting] = useState(false); // Submitting state for form submission
  const [isClient, setIsClient] = useState(false); // State to track client-side mount
  const [showPasswordFields, setShowPasswordFields] = useState(false);
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmNewPassword, setShowConfirmNewPassword] = useState(false);


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
        `https://wcontent-app-latest.onrender.com/api/users/getUser/${userId}`,
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
        // Initialize userData with fetched data.
        // Crucially, data.password from backend is the current hashed password.
        // We store this to be sent back if the user doesn't change the password.
        setUserData({
          username: data.username || "",
          email: data.email || "",
          userType: data.userType || "",
          channelName: data.channelName || "",
          channelId: data.channelId || "",
          channelURL: data.channelURL || "",
          password: data.password || "", // Store the fetched (likely hashed) password
        });
      } else {
        const data = await response.json().catch(() => ({ message: "Failed to fetch user data." }));
        setError(data.message || "Failed to fetch user data.");
      }
    } catch (error) {
       console.error("Fetch User Data Error:", error);
       let fetchErrorMessage = "Error fetching profile data. Please check your connection.";
       if (isClient && error instanceof TypeError && error.message.includes('fetch')) {
         fetchErrorMessage = `Error fetching profile. Could not connect to the server at https://wcontent-app-latest.onrender.com. Ensure the backend is running and CORS is configured.`;
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


  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setMessage(null);
    setIsSubmitting(true);

    const token = localStorage.getItem("token");
    const userId = localStorage.getItem("id");

    if (!token || !userId) {
      setError("User not logged in. Please login again.");
      setIsSubmitting(false);
      return;
    }

    // Prepare data payload
    const updatePayload = {
      username: userData.username,
      email: userData.email,
      userType: userData.userType,
      channelName: userData.channelName,
      channelId: userData.channelId,
      channelURL: userData.channelURL,
      // Password handling:
      // If newPassword is provided, it means user wants to change it.
      // Otherwise, send the existing password (userData.password, which was fetched).
      password: userData.password, // Start with the existing (fetched) password
    };


    if (showPasswordFields) {
      // Only validate and include new password if fields are shown and newPassword has a value
      if (newPassword) {
        if (newPassword !== confirmPassword) {
          setError("New passwords do not match.");
          setIsSubmitting(false);
          return;
        }
        if (newPassword.length < 6) {
          setError("New password must be at least 6 characters long.");
          setIsSubmitting(false);
          return;
        }
        // If all checks pass for new password, include it in the payload.
        updatePayload.password = newPassword;
      } else {
        // If password fields were shown but no new password entered,
        // it implies the user might have clicked "Change Password" but then decided not to.
        // In this case, we still send the original userData.password (already set in updatePayload).
        // No action needed here as updatePayload.password already holds userData.password.
      }
    }
    // If !showPasswordFields, updatePayload.password remains as userData.password (the fetched one).

    try {
      const response = await fetch(
        `https://wcontent-app-latest.onrender.com/api/users/update/${userId}`,
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
        // If password was changed, clear the input fields for new password
        if (newPassword && showPasswordFields) {
            setNewPassword("");
            setConfirmPassword("");
        }
        setShowPasswordFields(false); // Hide password fields after successful update

         if (updatePayload.username && localStorage.getItem('username') !== updatePayload.username) {
            localStorage.setItem('username', updatePayload.username);
            window.dispatchEvent(new CustomEvent('authChange'));
         }
         // Optionally re-fetch data if backend might return further modified data
         // fetchUserData(userId, token);
      } else {
        const data = await response.json().catch(() => ({message: "Failed to update profile."}));
        setError(data.message || "Failed to update profile.");
      }
    } catch (error) {
      console.error("Update Profile Error:", error);
      let updateErrorMessage = "Error updating profile. Please try again.";
       if (isClient && error instanceof TypeError && error.message.includes('fetch')) {
         updateErrorMessage = `Error updating profile. Could not connect to the server at https://wcontent-app-latest.onrender.com. Ensure the backend is running and CORS is configured.`;
       }
      setError(updateErrorMessage);
    } finally {
       setIsSubmitting(false);
    }
  };


  // Render Loading Skeleton
   if (isLoading) {
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
                <div className="space-y-2"><Skeleton className="h-4 w-28" /><Skeleton className="h-10 w-full" /></div>
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
        <CardDescription>Manage your account settings. Your current password will be sent unless you choose to change it.</CardDescription>
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
               <CheckCircle className="h-4 w-4 text-current" />
               <AlertTitle className="text-current font-semibold">Success</AlertTitle>
              <AlertDescription className="text-current">{message}</AlertDescription>
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

          <div className="space-y-4 pt-4 border-t border-border/50">
             <h3 className="text-md font-semibold text-muted-foreground">Channel Details (Optional for Role Seekers)</h3>
            <div className="space-y-2">
              <Label htmlFor="channelName">Channel Name</Label>
              <Input
                id="channelName"
                name="channelName"
                value={userData.channelName || ''}
                onChange={handleChange}
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
                    disabled={isSubmitting}
                    placeholder="https://youtube.com/..."
                 />
               </div>
            </div>
          </div>

          <div className="space-y-4 pt-4 border-t border-border/50">
            <div className="flex justify-between items-center">
              <h3 className="text-md font-semibold text-muted-foreground">Password</h3>
              {!showPasswordFields && (
                <Button type="button" variant="link" onClick={() => setShowPasswordFields(true)} disabled={isSubmitting}>
                  Change Password
                </Button>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="currentPasswordDisplay">Current Password</Label>
              <div className="relative">
                <Input
                    type={showCurrentPassword ? "text" : "password"}
                    id="currentPasswordDisplay"
                    value={"********"} // Display masked password
                    readOnly // Make it read-only
                    className="bg-muted/50 cursor-default"
                    disabled={isSubmitting}
                />
                 {/* No toggle for the masked display as it's not the actual password */}
              </div>
              {showPasswordFields && <p className="text-xs text-muted-foreground">Your current password will be sent if you don't enter a new one below.</p>}
            </div>


            {showPasswordFields && (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="newPassword">New Password</Label>
                     <div className="relative">
                        <Input
                          type={showNewPassword ? "text" : "password"}
                          id="newPassword"
                          name="newPassword"
                          value={newPassword}
                          onChange={(e) => setNewPassword(e.target.value)}
                          placeholder="Enter new password (min. 6 chars)"
                          disabled={isSubmitting}
                          minLength={6}
                        />
                        <Button type="button" variant="ghost" size="icon" className="absolute right-1 top-1/2 -translate-y-1/2 h-7 w-7" onClick={() => setShowNewPassword(!showNewPassword)}>
                            {showNewPassword ? <EyeOff className="h-4 w-4"/> : <Eye className="h-4 w-4"/>}
                        </Button>
                     </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="confirmPassword">Confirm New Password</Label>
                     <div className="relative">
                        <Input
                          type={showConfirmNewPassword ? "text" : "password"}
                          id="confirmPassword"
                          name="confirmPassword"
                          value={confirmPassword}
                          onChange={(e) => setConfirmPassword(e.target.value)}
                          placeholder="Confirm new password"
                          disabled={isSubmitting}
                          minLength={6}
                        />
                         <Button type="button" variant="ghost" size="icon" className="absolute right-1 top-1/2 -translate-y-1/2 h-7 w-7" onClick={() => setShowConfirmNewPassword(!showConfirmNewPassword)}>
                            {showConfirmNewPassword ? <EyeOff className="h-4 w-4"/> : <Eye className="h-4 w-4"/>}
                        </Button>
                     </div>
                  </div>
                </div>
                <p className="text-xs text-muted-foreground">Leave blank if you don't want to change your password.</p>
                <Button type="button" variant="outline" size="sm" onClick={() => { setShowPasswordFields(false); setNewPassword(''); setConfirmPassword(''); setError(null); }} disabled={isSubmitting}>
                  Cancel Password Change
                </Button>
              </>
            )}
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
