
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
import { Loader2 } from 'lucide-react';
import { useGoogleLogin } from '@react-oauth/google';
import axios from 'axios';


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

  // Loading states
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [isSendingOtp, setIsSendingOtp] = useState(false);
  const [isVerifyingOtp, setIsVerifyingOtp] = useState(false);
  const [isRegisteringSubmit, setIsRegisteringSubmit] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);

  const router = useRouter();

   useEffect(() => {
    setIsClient(true);
   }, []);
   
   const handleGoogleAuthBackend = async (googleUser) => {
    setIsGoogleLoading(true);
    setError('');
    try {
        const response = await fetch('https://wcontent-app-latest.onrender.com/api/users/google-auth', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email: googleUser.email, username: googleUser.name })
        });

        const data = await response.json();

        if (response.ok) {
            if (data.action === 'register') {
                // Start registration flow, skipping OTP steps
                setIsRegistering(true);
                setEmail(data.email);
                setUsername(data.username);
                setIsOtpSent(true);
                setIsOtpVerified(true);
            } else {
                // Login successful
                if (typeof window !== 'undefined') {
                    localStorage.setItem("token", data.token);
                    localStorage.setItem("id", data.user.id);
                    localStorage.setItem("username", data.user.username);
                    window.dispatchEvent(new CustomEvent('authChange'));
                }
                router.push("/");
            }
        } else {
            setError(data.message || "Google authentication failed on the server.");
        }
    } catch (error) {
        console.error("Google Auth Backend Error:", error);
        setError("Error communicating with server during Google authentication.");
    } finally {
        setIsGoogleLoading(false);
    }
};

const googleLogin = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
        setIsGoogleLoading(true);
        setError('');
        try {
            const userInfoResponse = await axios.get('https://www.googleapis.com/oauth2/v3/userinfo', {
                headers: { Authorization: `Bearer ${tokenResponse.access_token}` },
            });
            await handleGoogleAuthBackend(userInfoResponse.data);
        } catch (err) {
            console.error("Google user info fetch error:", err);
            setError("Failed to fetch user information from Google.");
            setIsGoogleLoading(false);
        }
    },
    onError: () => {
        setError("Google login failed. Please try again.");
        setIsGoogleLoading(false);
    }
});


  // Handle Login
  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setIsLoggingIn(true);

    try {
      const backendUrl = "https://wcontent-app-latest.onrender.com/api/users/login";
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
          localStorage.setItem("token", data.token);
          localStorage.setItem("id", data.user.id);
          localStorage.setItem("username", data.user.username);
          window.dispatchEvent(new CustomEvent('authChange'));
        }
        router.push("/");
      } else {
        let errorMessage = "Login failed. Please check credentials and try again.";
        try {
            const data = await response.json().catch(() => null);
            errorMessage = data?.message || errorMessage;

             if (response.status === 500 && data?.message?.includes('Cannot invoke "String.equals(Object)"')) {
                 errorMessage = "Login failed: Account data issue. Please try resetting your password or contact support.";
             }

        } catch (jsonError) {
            console.error("Could not parse error response:", jsonError);
             const text = await response.text().catch(() => '');
             console.error("Login error response text:", text);
              if (response.status === 500 && text.includes('Cannot invoke "String.equals(Object)"')) {
                  errorMessage = "Login failed: Account data issue. Please try resetting your password or contact support.";
              } else {
                 errorMessage = `Login failed with status: ${response.status} ${response.statusText}. Check server logs for details.`;
              }
        }
         setError(errorMessage);
      }
    } catch (error) {
       console.error("Login network error:", error);
       let networkErrorMessage = "Error logging in. Please check your connection and try again.";
       if (isClient && error instanceof TypeError && error.message.includes('fetch')) {
          networkErrorMessage = `Error logging in. Could not connect to the server at https://wcontent-app-latest.onrender.com. Please ensure the backend is running and that CORS is configured correctly on the server to allow requests from your frontend origin (${window.location.origin}).`;
       }
       setError(networkErrorMessage);
    } finally {
      setIsLoggingIn(false);
    }
  };


  // Handle Send OTP
  const handleEmailSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setIsSendingOtp(true);

    try {
      const backendUrl = `https://wcontent-app-latest.onrender.com/api/users/request-otp?email=${encodeURIComponent(email)}`;
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
          networkErrorMessage = `Error sending OTP. Could not connect to the server at https://wcontent-app-latest.onrender.com. Check backend status and CORS configuration.`;
       }
       setError(networkErrorMessage);
    } finally {
      setIsSendingOtp(false);
    }
  };

  // Handle Verify OTP
  const handleOtpSubmit = async (e) => {
    e.preventDefault();
     setError("");
     setIsVerifyingOtp(true);

    try {
      const backendUrl = `https://wcontent-app-latest.onrender.com/api/users/verify-otp?email=${encodeURIComponent(email)}&otp=${encodeURIComponent(otp)}`;
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
         networkErrorMessage = `Error verifying OTP. Could not connect to the server at https://wcontent-app-latest.onrender.com. Check backend status and CORS configuration.`;
       }
      setError(networkErrorMessage);
    } finally {
       setIsVerifyingOtp(false);
    }
  };

  // Handle Registration
  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
     setError("");
     setIsRegisteringSubmit(true);

    if (!userType) {
      setError("Please select a user type.");
      setIsRegisteringSubmit(false);
      return;
    }
     if (password.length < 6) {
        setError("Password must be at least 6 characters long.");
         setIsRegisteringSubmit(false);
        return;
     }

     const payload = {
       username,
       email,
       password,
       userType,
       channelName,
       channelId,
       channelURL,
     };

    try {
      const backendUrl = "https://wcontent-app-latest.onrender.com/api/users/register";
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
         networkErrorMessage = `Error registering. Could not connect to the server at https://wcontent-app-latest.onrender.com. Check backend status and CORS configuration.`;
       }
       setError(networkErrorMessage);
    } finally {
       setIsRegisteringSubmit(false);
    }
  };

  const toggleMode = () => {
    setIsRegistering(!isRegistering);
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
    setIsLoggingIn(false);
    setIsSendingOtp(false);
    setIsVerifyingOtp(false);
    setIsRegisteringSubmit(false);
    setIsGoogleLoading(false);
  };


  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background to-primary/10 p-4">
      <div className="w-full max-w-4xl grid md:grid-cols-2 gap-0 bg-card text-card-foreground rounded-xl shadow-2xl overflow-hidden border border-border">

        <div className="hidden md:flex flex-col justify-center items-center p-8 lg:p-12 bg-gradient-to-br from-primary/50 via-primary/30 to-primary/50 text-primary-foreground">
          <h1 className="text-3xl font-bold mb-4 text-center">Welcome to Wcontent</h1>
          <p className="text-center mb-8 text-primary-foreground/80">
            Join the ultimate platform for creators today to explore amazing features and take your career to
            the next level. Whether you're a content creator or a role seeker,
            we've got you covered.
          </p>
          <Image
            src="https://placehold.co/400x300.png"
            alt="Abstract background for content creation platform"
            data-ai-hint="abstract dark texture"
            width={400}
            height={300}
            className="rounded-lg object-cover shadow-lg"
          />
        </div>

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
                      disabled={isLoggingIn || isGoogleLoading}
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
                      disabled={isLoggingIn || isGoogleLoading}
                    />
                  </div>
                  <Button type="submit" className="w-full" disabled={isLoggingIn || isGoogleLoading}>
                    {isLoggingIn ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Logging In...
                      </>
                    ) : (
                      'Login'
                    )}
                  </Button>
                </form>
              )}

              {isRegistering && (
                <>
                  {!isOtpSent && (
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
                          disabled={isSendingOtp || isGoogleLoading}
                        />
                         <p className="text-xs text-muted-foreground mt-1">We'll send an OTP to verify your email.</p>
                      </div>
                      <Button type="submit" className="w-full" disabled={isSendingOtp || isGoogleLoading}>
                        {isSendingOtp ? (
                           <>
                             <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Sending OTP...
                           </>
                         ) : (
                           'Send OTP'
                         )}
                      </Button>
                    </form>
                  )}

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
                          disabled={isVerifyingOtp || isGoogleLoading}
                        />
                         <p className="text-xs text-muted-foreground mt-1">Check your email for the verification code.</p>
                      </div>
                      <Button type="submit" className="w-full" disabled={isVerifyingOtp || isGoogleLoading}>
                        {isVerifyingOtp ? (
                           <>
                             <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Verifying...
                           </>
                         ) : (
                           'Verify OTP'
                         )}
                      </Button>
                    </form>
                  )}

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
                          disabled={isRegisteringSubmit || isGoogleLoading}
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
                           minLength={6}
                           disabled={isRegisteringSubmit || isGoogleLoading}
                        />
                      </div>
                      <div>
                        <Label htmlFor="userType">User Type</Label>
                         <Select onValueChange={setUserType} value={userType} required disabled={isRegisteringSubmit || isGoogleLoading}>
                            <SelectTrigger id="userType">
                              <SelectValue placeholder="Select your role" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="ChannelOwner">Channel Owner</SelectItem>
                              <SelectItem value="RoleSeeker">Role Seeker</SelectItem>
                           </SelectContent>
                          </Select>
                      </div>
                       <>
                           <div>
                              <Label htmlFor="channelName">Channel Name</Label>
                              <Input
                                 id="channelName"
                                 type="text"
                                 value={channelName}
                                 onChange={(e) => setChannelName(e.target.value)}
                                 placeholder="Your YouTube Channel Name"
                                 disabled={isRegisteringSubmit || isGoogleLoading}
                               />
                                <p className="text-xs text-muted-foreground mt-1">Required for Channel Owners.</p>
                           </div>
                           <div>
                              <Label htmlFor="channelId">Channel ID</Label>
                              <Input
                                 id="channelId"
                                 type="text"
                                 value={channelId}
                                 onChange={(e) => setChannelId(e.target.value)}
                                  placeholder="Your YouTube Channel ID"
                                  disabled={isRegisteringSubmit || isGoogleLoading}
                               />
                                <p className="text-xs text-muted-foreground mt-1">Required for Channel Owners.</p>
                           </div>
                           <div>
                             <Label htmlFor="channelURL">Channel URL</Label>
                              <Input
                                 id="channelURL"
                                 type="url"
                                 value={channelURL}
                                 onChange={(e) => setChannelURL(e.target.value)}
                                 placeholder="https://youtube.com/..."
                                 disabled={isRegisteringSubmit || isGoogleLoading}
                              />
                               <p className="text-xs text-muted-foreground mt-1">Required for Channel Owners.</p>
                           </div>
                       </>
                      <Button type="submit" className="w-full" disabled={isRegisteringSubmit || isGoogleLoading}>
                        {isRegisteringSubmit ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Signing Up...
                          </>
                        ) : (
                          'Sign Up'
                        )}
                      </Button>
                    </form>
                  )}
                </>
              )}
               <div className="relative my-4">
                    <div className="absolute inset-0 flex items-center">
                        <span className="w-full border-t" />
                    </div>
                    <div className="relative flex justify-center text-xs uppercase">
                        <span className="bg-card px-2 text-muted-foreground">Or</span>
                    </div>
                </div>
                <Button variant="outline" className="w-full" type="button" onClick={() => googleLogin()} disabled={isLoggingIn || isSendingOtp || isVerifyingOtp || isRegisteringSubmit || isGoogleLoading}>
                    {isGoogleLoading ? (
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    ) : (
                        <svg className="mr-2 h-4 w-4" aria-hidden="true" focusable="false" data-prefix="fab" data-icon="google" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 488 512"><path fill="currentColor" d="M488 261.8C488 403.3 391.1 504 248 504 110.8 504 0 393.2 0 256S110.8 8 248 8c66.8 0 126 21.2 172.9 56.6l-69.7 69.7C324.9 100.6 289.1 84 248 84c-80.9 0-146.4 65.5-146.4 146.4s65.5 146.4 146.4 146.4c97.4 0 130.3-72.2 134.8-109.8H248v-85.3h236.1c2.3 12.7 3.9 24.9 3.9 41.4z"></path></svg>
                    )}
                    Continue with Google
                </Button>
            </CardContent>
            <CardFooter className="flex justify-center">
               <p className="text-sm text-muted-foreground">
                {isRegistering ? "Already have an account?" : "No account?"}{" "}
                <Button variant="link" className="p-0 h-auto text-primary" onClick={toggleMode} disabled={isLoggingIn || isSendingOtp || isVerifyingOtp || isRegisteringSubmit || isGoogleLoading}>
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
