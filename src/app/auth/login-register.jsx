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
  const [channelName, setChannelName] = useState(""); // Added channel name state
  const [channelId, setChannelId] = useState(""); // Added channel ID state
  const [channelURL, setChannelURL] = useState(""); // Added channel URL state
  const [isClient, setIsClient] = useState(false);

  const router = useRouter();

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
          // Dispatch custom event to notify navbar
          window.dispatchEvent(new CustomEvent('authChange'));
        }
        router.push("/");
      } else {
        let errorMessage = "Login failed. Please check credentials and try again.";
        try {
            const data = await response.json();
            errorMessage = data.message || errorMessage;
        } catch (jsonError) {
            console.error("Could not parse error response:", jsonError);
             // Check if response text gives a clue
             const text = await response.text().catch(() => '');
             console.error("Login error response text:", text);
             if (response.status === 500 && text.includes('String.equals(Object)') && text.includes('User.getPassword()')) {
                errorMessage = "Login failed: There seems to be an issue with your account data on the server (password might be null). Please contact support or try resetting your password if possible.";
             } else {
                errorMessage = `Login failed with status: ${response.status} ${response.statusText}. Check server logs for details.`;
             }
        }
         setError(errorMessage);
      }
    } catch (error) {
       console.error("Login network error:", error);
       let networkErrorMessage = "Error logging in. Please check your connection and try again.";
       if (isClient && error instanceof TypeError && error.message.includes('fetch')) { // More robust check
          networkErrorMessage = `Error logging in. Could not connect to the server at http://localhost:3001. Please ensure the backend is running and that CORS is configured correctly on the server to allow requests from your frontend origin (${window.location.origin}).`;
       }
       setError(networkErrorMessage);
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
             const text = await response.text().catch(() => '');
             console.error("OTP Send error response text:", text);
            errorMessage = `Error sending OTP: ${response.status} ${response.statusText}. Check server logs.`;
         }
        setError(errorMessage);
      }
    } catch (error) {
       console.error("OTP Send network error:", error);
       let networkErrorMessage = "Error sending OTP. Please check your connection.";
       if (isClient && error instanceof TypeError && error.message.includes('fetch')) {
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
             const text = await response.text().catch(() => '');
             console.error("OTP Verify error response text:", text);
             errorMessage = `Error verifying OTP: ${response.status} ${response.statusText}. Check server logs.`;
         }
        setError(errorMessage);
      }
    } catch (error) {
      console.error("OTP Verify network error:", error);
      let networkErrorMessage = "Error verifying OTP. Please check your connection.";
       if (isClient && error instanceof TypeError && error.message.includes('fetch')) {
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
     // Basic password confirmation validation
     if (password.length < 6) {
        setError("Password must be at least 6 characters long.");
        return;
     }

    // Prepare payload
     const payload = {
       username,
       email,
       password,
       userType,
       channelName, // Always include channel fields
       channelId,   // Backend should handle if they are optional for RoleSeeker
       channelURL,
     };

    try {
      const backendUrl = "http://localhost:3001/api/users/register";
      const response = await fetch(backendUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        const data = await response.json();
         if (typeof window !== 'undefined') {
            localStorage.setItem("token", data.token);
            localStorage.setItem("id", data.user.id);
            localStorage.setItem("username", data.user.username);
             // Dispatch custom event to notify navbar
            window.dispatchEvent(new CustomEvent('authChange'));
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
            const text = await response.text().catch(() => '');
            console.error("Registration error response text:", text);
            errorMessage = `Registration failed: ${response.status} ${response.statusText}. Check server logs.`;
         }
        setError(errorMessage);
      }
    } catch (error) {
      console.error("Registration network error:", error);
      let networkErrorMessage = "Error registering. Please check your connection.";
       if (isClient && error instanceof TypeError && error.message.includes('fetch')) {
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
          <h1 className="text-3xl font-bold mb-4 text-center">Welcome to Wcontent</h1> {/* Updated name */}
          <p className="text-center mb-8 text-primary-foreground/80">
            Join the ultimate platform for creators today to explore amazing features and take your career to
            the next level. Whether you're a content creator or a role seeker,
            we've got you covered. {/* Updated description */}
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
                           placeholder="Choose a strong password (min. 6 chars)"
                           minLength={6} // Add hint for minimum length
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
                       {/* Always show Channel fields, remove conditional rendering */}
                       <>
                           <div>
                              <Label htmlFor="channelName">Channel Name (Optional)</Label>
                              <Input
                                 id="channelName"
                                 type="text"
                                 value={channelName}
                                 onChange={(e) => setChannelName(e.target.value)}
                                 // required={userType === 'ChannelOwner'} // Remove requirement here, let backend validate if needed
                                 placeholder="Your YouTube Channel Name"
                               />
                           </div>
                           <div>
                              <Label htmlFor="channelId">Channel ID (Optional)</Label>
                              <Input
                                 id="channelId"
                                 type="text"
                                 value={channelId}
                                 onChange={(e) => setChannelId(e.target.value)}
                                 // required={userType === 'ChannelOwner'}
                                  placeholder="Your YouTube Channel ID"
                               />
                           </div>
                           <div>
                             <Label htmlFor="channelURL">Channel URL (Optional)</Label>
                              <Input
                                 id="channelURL"
                                 type="url"
                                 value={channelURL}
                                 onChange={(e) => setChannelURL(e.target.value)}
                                 // required={userType === 'ChannelOwner'}
                                 placeholder="https://youtube.com/..."
                              />
                           </div>
                       </>
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
