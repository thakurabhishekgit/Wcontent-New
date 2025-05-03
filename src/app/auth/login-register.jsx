'use client';

import React, { useState, useEffect } from "react";
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import Image from 'next/image';
import Link from 'next/link';
import { getAuth, GoogleAuthProvider, signInWithPopup } from "firebase/auth"; // Import Firebase Auth
import { app } from "@/lib/firebase/config"; // Import Firebase app instance

// SVG for Google icon
const GoogleIcon = () => (
  <svg className="mr-2 -ml-1 w-4 h-4" aria-hidden="true" focusable="false" data-prefix="fab" data-icon="google" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 488 512">
    <path fill="currentColor" d="M488 261.8C488 403.3 381.5 512 244 512 110.3 512 0 401.7 0 261.8S110.3 11.6 244 11.6c70.3 0 129.5 27.8 174.2 71.9l-63.9 61.3c-24.5-23.1-58.1-37.3-99.8-37.3-86.1 0-156.1 69.1-156.1 154.1s69.9 154.1 156.1 154.1c99.8 0 133-60.9 138.4-93.2H244v-76.5h239.8c4.7 25.4 7.2 51.9 7.2 79.7z"></path>
  </svg>
);


const Login = ({ handleLogin }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [otp, setOtp] = useState("");
  const [isOtpSent, setIsOtpSent] = useState(false);
  const [isOtpVerified, setIsOtpVerified] = useState(false);
  const [error, setError] = useState("");
  const [isRegistering, setIsRegistering] = useState(false);
  const [username, setUsername] = useState("");
  const [userType, setUserType] = useState("");
  const [channelName, setChannelName] = useState("");
  const [channelId, setChannelId] = useState("");
  const [channelURL, setChannelURL] = useState("");
  const [isClient, setIsClient] = useState(false);

  const router = useRouter();
  const auth = getAuth(app); // Get Firebase Auth instance

   useEffect(() => {
    setIsClient(true); // Indicate component has mounted
   }, []);

  // Handle Login
  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const backendUrl = "http://localhost:3001/api/users/login";
      const response = await fetch(backendUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      if (response.ok) {
        const data = await response.json();
        if (typeof window !== 'undefined') {
          localStorage.setItem("token", data.token); // Store backend token
          localStorage.setItem("id", data.user.id);
          localStorage.setItem("username", data.user.username);
        }
        router.push("/");
      } else {
        let errorMessage = "Login failed. Please check credentials and try again.";
        try {
            const data = await response.json();
            errorMessage = data.message || errorMessage;
        } catch (jsonError) {
            console.error("Could not parse error response:", jsonError);
             errorMessage = `Login failed with status: ${response.status} ${response.statusText}`;
        }
         setError(errorMessage);
      }
    } catch (error) {
       console.error("Login network error:", error);
       let networkErrorMessage = "Error logging in. Please check your connection and try again.";
       if (isClient && error instanceof TypeError && error.message === 'Failed to fetch') {
          networkErrorMessage = `Error logging in. Could not connect to the server at http://localhost:3001. Please ensure the backend is running and that CORS is configured correctly on the server to allow requests from your frontend origin (${window.location.origin}).`;
       }
       setError(networkErrorMessage);
    }
  };

   // Handle Google Sign-In
   const handleGoogleSignIn = async () => {
     setError("");
     const provider = new GoogleAuthProvider();
     try {
       const result = await signInWithPopup(auth, provider);
       const user = result.user;
       const idToken = await user.getIdToken();

       // **Crucial Backend Interaction (Placeholder)**
       // Send the idToken to your backend (e.g., http://localhost:3001/api/users/google-login)
       // Your backend should:
       // 1. Verify the Firebase ID token using the Firebase Admin SDK.
       // 2. Check if a user exists with this Google UID or email.
       // 3. If exists, log them in and return your backend's session token/user info.
       // 4. If not exists, create a new user in your database using info from the token (name, email, etc.) and return the session token/user info.
       // 5. Handle potential errors (invalid token, backend issues).

       // Example Placeholder Backend Call:
       const backendResponse = await fetch("http://localhost:3001/api/users/google-login", { // Adjust endpoint as needed
         method: "POST",
         headers: {
           "Content-Type": "application/json",
           "Authorization": `Bearer ${idToken}` // Send Firebase token to backend
         },
         // Optionally send user details if needed for registration on backend
         // body: JSON.stringify({ email: user.email, name: user.displayName })
       });

       if (backendResponse.ok) {
         const backendData = await backendResponse.json();
         // Assuming backend returns { token: 'yourBackendToken', user: { id: '...', username: '...' } }
         if (typeof window !== 'undefined') {
           localStorage.setItem("token", backendData.token); // Store YOUR backend token
           localStorage.setItem("id", backendData.user.id);
           localStorage.setItem("username", backendData.user.username);
         }
         router.push("/"); // Navigate on successful backend login/registration
       } else {
         // Handle error from *your* backend during Google login/registration
         const errorData = await backendResponse.json().catch(() => ({ message: "Google Sign-In failed on backend." }));
         setError(errorData.message || "Google Sign-In failed during backend processing.");
       }

     } catch (error) {
       console.error("Google Sign-In Error:", error);
       let firebaseErrorMessage = "Google Sign-In failed. Please try again.";
       if (error.code === 'auth/popup-closed-by-user') {
         firebaseErrorMessage = "Google Sign-In cancelled.";
       } else if (error.code === 'auth/network-request-failed') {
          firebaseErrorMessage = "Google Sign-In failed. Check your network connection.";
       } else if (error instanceof TypeError && error.message === 'Failed to fetch'){
          firebaseErrorMessage = `Google Sign-In failed. Could not connect to backend at http://localhost:3001 for validation.`;
       }
       setError(firebaseErrorMessage);
     }
   };


  // Handle Send OTP
  const handleEmailSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const backendUrl = `http://localhost:3001/api/users/request-otp?email=${encodeURIComponent(email)}`;
      const response = await fetch(backendUrl, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (response.ok) {
        setIsOtpSent(true);
      } else {
         let errorMessage = "Error sending OTP. Please try again.";
         try {
            const data = await response.json();
            errorMessage = data.message || errorMessage;
         } catch (jsonError) {
            console.error("Could not parse OTP send error response:", jsonError);
            errorMessage = `Error sending OTP: ${response.status} ${response.statusText}`;
         }
        setError(errorMessage);
      }
    } catch (error) {
       console.error("OTP Send network error:", error);
       let networkErrorMessage = "Error sending OTP. Please check your connection.";
       if (isClient && error instanceof TypeError && error.message === 'Failed to fetch') {
          networkErrorMessage = `Error sending OTP. Could not connect to the server at http://localhost:3001. Check backend status and CORS configuration.`;
       }
       setError(networkErrorMessage);
    }
  };

  // Handle Verify OTP
  const handleOtpSubmit = async (e) => {
    e.preventDefault();
     setError("");

    try {
      const backendUrl = `http://localhost:3001/api/users/verify-otp?email=${encodeURIComponent(email)}&otp=${encodeURIComponent(otp)}`;
      const response = await fetch(backendUrl, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (response.ok) {
        setIsOtpVerified(true);
      } else {
        let errorMessage = "Invalid OTP. Please try again.";
         try {
            const data = await response.json();
            errorMessage = data.message || errorMessage;
         } catch (jsonError) {
             console.error("Could not parse OTP verify error response:", jsonError);
             errorMessage = `Error verifying OTP: ${response.status} ${response.statusText}`;
         }
        setError(errorMessage);
      }
    } catch (error) {
      console.error("OTP Verify network error:", error);
      let networkErrorMessage = "Error verifying OTP. Please check your connection.";
       if (isClient && error instanceof TypeError && error.message === 'Failed to fetch') {
         networkErrorMessage = `Error verifying OTP. Could not connect to the server at http://localhost:3001. Check backend status and CORS configuration.`;
       }
      setError(networkErrorMessage);
    }
  };

  // Handle Registration
  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
     setError("");

    if (!userType) {
      setError("Please select a user type.");
      return;
    }

    try {
      const backendUrl = "http://localhost:3001/api/users/register";
      const response = await fetch(backendUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username,
          email,
          password,
          userType,
          channelName,
          channelId,
          channelURL,
        }),
      });

      if (response.ok) {
        const data = await response.json();
         if (typeof window !== 'undefined') {
            localStorage.setItem("token", data.token);
            localStorage.setItem("id", data.user.id);
            localStorage.setItem("username", data.user.username);
         }
        setIsRegistering(false);
        router.push("/");
      } else {
        let errorMessage = "Registration failed. Please try again.";
         try {
            const data = await response.json();
            errorMessage = data.message || errorMessage;
         } catch (jsonError) {
            console.error("Could not parse registration error response:", jsonError);
            errorMessage = `Registration failed: ${response.status} ${response.statusText}`;
         }
        setError(errorMessage);
      }
    } catch (error) {
      console.error("Registration network error:", error);
      let networkErrorMessage = "Error registering. Please check your connection.";
       if (isClient && error instanceof TypeError && error.message === 'Failed to fetch') {
         networkErrorMessage = `Error registering. Could not connect to the server at http://localhost:3001. Check backend status and CORS configuration.`;
       }
       setError(networkErrorMessage);
    }
  };

  const toggleMode = () => {
    setIsRegistering(!isRegistering);
    // Reset state when toggling modes
    setEmail("");
    setPassword("");
    setOtp("");
    setIsOtpSent(false);
    setIsOtpVerified(false);
    setUsername("");
    setUserType("");
    setChannelName("");
    setChannelId("");
    setChannelURL("");
    setError("");
  };


  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background to-primary/10 p-4">
      <div className="w-full max-w-4xl grid md:grid-cols-2 gap-0 bg-card text-card-foreground rounded-xl shadow-2xl overflow-hidden border border-border">

        {/* Left Side - Illustration and Welcome */}
        <div className="hidden md:flex flex-col justify-center items-center p-8 lg:p-12 bg-gradient-to-br from-primary/50 via-primary/30 to-primary/50 text-primary-foreground">
          <h1 className="text-3xl font-bold mb-4 text-center">Welcome to WContent Lite</h1>
          <p className="text-center mb-8 text-primary-foreground/80">
            Join us today to explore amazing features and take your career to
            the next level. Whether you're a content creator or a role seeker,
            we've got you covered.
          </p>
          <Image
            src="https://picsum.photos/400/300?random=auth" // Use picsum for placeholder
            alt="Content Creation Illustration"
            data-ai-hint="team collaboration digital content"
            width={400}
            height={300}
            className="rounded-lg object-cover shadow-lg"
          />
        </div>

        {/* Right Side - Form */}
        <div className="p-8 lg:p-12 flex flex-col justify-center">
          <Card className="w-full border-0 shadow-none bg-transparent">
            <CardHeader className="text-center">
              <CardTitle className="text-2xl font-bold">{isRegistering ? "Sign Up" : "Login"}</CardTitle>
              <CardDescription>
                {isRegistering ? "Create your account" : "Access your dashboard"}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {error && <p className="text-destructive text-sm mb-4 text-center bg-destructive/10 p-2 rounded-md border border-destructive/50">{error}</p>}

              {/* Login Form */}
              {!isRegistering && (
                <form onSubmit={handleLoginSubmit} className="space-y-4">
                  <div>
                    <Label htmlFor="login-email">Email</Label>
                    <Input
                      id="login-email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      placeholder="you@example.com"
                    />
                  </div>
                  <div>
                    <Label htmlFor="login-password">Password</Label>
                    <Input
                      id="login-password"
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      placeholder="••••••••"
                    />
                  </div>
                  <Button type="submit" className="w-full">
                    Login
                  </Button>
                    {/* Divider */}
                    <div className="relative my-4">
                       <div className="absolute inset-0 flex items-center">
                           <span className="w-full border-t border-border"></span>
                       </div>
                       <div className="relative flex justify-center text-xs uppercase">
                           <span className="bg-card px-2 text-muted-foreground">Or continue with</span>
                       </div>
                    </div>
                    {/* Google Sign-In Button */}
                     <Button variant="outline" className="w-full" type="button" onClick={handleGoogleSignIn}>
                       <GoogleIcon /> Google
                     </Button>
                </form>
              )}

              {/* Registration Flow */}
              {isRegistering && (
                <>
                  {/* Step 1: Email Input */}
                  {!isOtpSent && (
                     <>
                    <form onSubmit={handleEmailSubmit} className="space-y-4">
                      <div>
                        <Label htmlFor="register-email">Email</Label>
                        <Input
                          id="register-email"
                          type="email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          required
                          placeholder="you@example.com"
                        />
                         <p className="text-xs text-muted-foreground mt-1">We'll send an OTP to verify your email.</p>
                      </div>
                      <Button type="submit" className="w-full">
                        Send OTP
                      </Button>
                    </form>
                     {/* Divider */}
                     <div className="relative my-4">
                        <div className="absolute inset-0 flex items-center">
                            <span className="w-full border-t border-border"></span>
                        </div>
                        <div className="relative flex justify-center text-xs uppercase">
                            <span className="bg-card px-2 text-muted-foreground">Or sign up with</span>
                        </div>
                     </div>
                      {/* Google Sign-Up Button */}
                      <Button variant="outline" className="w-full mt-4" type="button" onClick={handleGoogleSignIn}>
                        <GoogleIcon /> Google
                      </Button>
                     </>
                  )}

                  {/* Step 2: OTP Verification */}
                  {isOtpSent && !isOtpVerified && (
                    <form onSubmit={handleOtpSubmit} className="space-y-4">
                      <div>
                        <Label htmlFor="otp">Enter OTP</Label>
                        <Input
                          id="otp"
                          type="text"
                          value={otp}
                          onChange={(e) => setOtp(e.target.value)}
                          required
                          placeholder="Enter the 6-digit code"
                          maxLength={6}
                        />
                         <p className="text-xs text-muted-foreground mt-1">Check your email for the verification code.</p>
                      </div>
                      <Button type="submit" className="w-full">
                        Verify OTP
                      </Button>
                    </form>
                  )}

                  {/* Step 3: Registration Details */}
                  {isOtpVerified && (
                    <form onSubmit={handleRegisterSubmit} className="space-y-4">
                      <div>
                        <Label htmlFor="username">Username</Label>
                        <Input
                          id="username"
                          type="text"
                          value={username}
                          onChange={(e) => setUsername(e.target.value)}
                          required
                          placeholder="Choose a username"
                        />
                      </div>
                      <div>
                        <Label htmlFor="register-password">Password</Label>
                        <Input
                          id="register-password"
                          type="password"
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          required
                           placeholder="Choose a strong password"
                        />
                      </div>
                      <div>
                        <Label htmlFor="userType">User Type</Label>
                         <Select onValueChange={setUserType} value={userType} required>
                            <SelectTrigger id="userType">
                              <SelectValue placeholder="Select your role" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="ChannelOwner">Channel Owner</SelectItem>
                              <SelectItem value="RoleSeeker">Role Seeker</SelectItem>
                           </SelectContent>
                          </Select>
                      </div>
                       {/* Conditionally show Channel fields only if ChannelOwner is selected */}
                        {userType === 'ChannelOwner' && (
                           <>
                               <div>
                                  <Label htmlFor="channelName">Channel Name</Label>
                                  <Input
                                     id="channelName"
                                     type="text"
                                     value={channelName}
                                     onChange={(e) => setChannelName(e.target.value)}
                                     required={userType === 'ChannelOwner'}
                                     placeholder="Your YouTube Channel Name"
                                   />
                               </div>
                               <div>
                                  <Label htmlFor="channelId">Channel ID</Label>
                                  <Input
                                     id="channelId"
                                     type="text"
                                     value={channelId}
                                     onChange={(e) => setChannelId(e.target.value)}
                                     required={userType === 'ChannelOwner'}
                                      placeholder="Your YouTube Channel ID"
                                   />
                               </div>
                               <div>
                                 <Label htmlFor="channelURL">Channel URL</Label>
                                  <Input
                                     id="channelURL"
                                     type="url"
                                     value={channelURL}
                                     onChange={(e) => setChannelURL(e.target.value)}
                                     required={userType === 'ChannelOwner'}
                                     placeholder="https://youtube.com/..."
                                  />
                               </div>
                           </>
                        )}
                      <Button type="submit" className="w-full">
                        Sign Up
                      </Button>
                    </form>
                  )}
                </>
              )}
            </CardContent>
            <CardFooter className="flex justify-center">
               <p className="text-sm text-muted-foreground">
                {isRegistering ? "Already have an account?" : "No account?"}{" "}
                <Button variant="link" className="p-0 h-auto text-primary" onClick={toggleMode}>
                  {isRegistering ? "Login" : "Sign Up"}
                </Button>
              </p>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Login;
