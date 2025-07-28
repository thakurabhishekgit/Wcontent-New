'use client'; // Moved to the top and removed 'jsx'

import React, { useState, useEffect } from "react"; // Import React and useEffect
import { Button } from "@/components/ui/button"; // Import Button
import { Input } from "@/components/ui/input"; // Import Input
import { Label } from "@/components/ui/label"; // Import Label
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"; // Import Card components
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"; // Import Alert
import { Terminal, CheckCircle, Loader2 } from "lucide-react"; // Import icons
import { useRouter } from 'next/navigation'; // Import useRouter for navigation

export default function ValidateOtpPage() {
  const [otp, setOtp] = useState("");
  const [email, setEmail] = useState(""); // Need email to validate
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  // Get email from query params on component mount
  React.useEffect(() => {
    const queryParams = new URLSearchParams(window.location.search);
    const emailFromQuery = queryParams.get('email');
    if (emailFromQuery) {
      setEmail(emailFromQuery);
    } else {
       setError("Email not found. Cannot validate OTP.");
       // Optionally redirect back or show a persistent error
       // router.push('/auth'); // Example redirect
    }
  }, [router]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setError("");
    setIsLoading(true);

    if (!email) {
       setError("Email is missing. Cannot validate OTP.");
       setIsLoading(false);
       return;
    }
    if (!otp || otp.length !== 6) {
       setError("Please enter a valid 6-digit OTP.");
       setIsLoading(false);
       return;
    }


    try {
       // Updated endpoint
       const backendUrl = `http://localhost:3001/api/users/verify-otp?email=${encodeURIComponent(email)}&otp=${encodeURIComponent(otp)}`;
      const response = await fetch(backendUrl, {
          method: "POST", // Method should match backend expectation (likely POST)
          headers: {
            "Content-Type": "application/json",
          },
          // Body might not be needed if using query params, depends on backend implementation
          // body: JSON.stringify({ email, otp }) // Example if backend expects body
        }
      );

      setIsLoading(false); // Stop loading regardless of outcome

      if (response.ok) {
        setMessage("OTP Verified Successfully! Redirecting to registration details...");
        // Redirect to the next step of registration, passing the verified email
        // For example, redirect back to the main auth page but signal OTP is verified
        // Or redirect to a dedicated registration details page
        router.push(`/auth?email=${encodeURIComponent(email)}&otpVerified=true`); // Example redirect back to auth page
      } else {
        const errorData = await response.json().catch(() => ({ message: `OTP validation failed. Status: ${response.status}` }));
        setError(errorData.message || `OTP validation failed. Status: ${response.status}`);
      }
    } catch (err) {
      setIsLoading(false);
       console.error("OTP Validation Error:", err);
       let networkErrorMessage = "Error validating OTP. Please check your connection.";
       if (err instanceof TypeError && err.message.includes('fetch')) {
          networkErrorMessage = `Error validating OTP. Could not connect to the server at http://localhost:3001. Check backend status and CORS configuration.`;
       }
       setError(networkErrorMessage);
    }
  };


  return (
     <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background to-primary/10 p-4">
       <Card className="w-full max-w-md">
         <CardHeader className="text-center">
           <CardTitle className="text-2xl font-bold">Validate OTP</CardTitle>
           <CardDescription>Enter the 6-digit code sent to {email || 'your email'}.</CardDescription>
         </CardHeader>
         <CardContent>
           {error && (
             <Alert variant="destructive" className="mb-4">
               <Terminal className="h-4 w-4" />
               <AlertTitle>Error</AlertTitle>
               <AlertDescription>{error}</AlertDescription>
             </Alert>
           )}
           {message && (
             <Alert variant="default" className="mb-4 bg-green-100 dark:bg-green-900/30 border-green-300 dark:border-green-700 text-green-700 dark:text-green-300">
                <CheckCircle className="h-4 w-4 text-current" />
                <AlertTitle className="text-current font-semibold">Success</AlertTitle>
               <AlertDescription className="text-current">{message}</AlertDescription>
             </Alert>
           )}
           <form onSubmit={handleSubmit} className="space-y-4">
             <div className="space-y-2">
               <Label htmlFor="otp">One-Time Password (OTP)</Label>
               <Input
                 id="otp"
                 type="text" // Keep as text to allow leading zeros if any, though OTPs are usually numbers
                 inputMode="numeric" // Hint for numeric keyboard on mobile
                 placeholder="Enter 6-digit OTP"
                 value={otp}
                 onChange={(e) => setOtp(e.target.value)}
                 required
                 maxLength={6}
                 disabled={isLoading || !email} // Disable if loading or no email
               />
             </div>
             <Button type="submit" className="w-full" disabled={isLoading || !email}>
               {isLoading ? (
                 <>
                   <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Validating...
                 </>
               ) : (
                 'Validate OTP'
               )}
             </Button>
           </form>
         </CardContent>
          <CardFooter className="text-center text-sm text-muted-foreground">
             Didn't receive an OTP? Check your spam folder or <a href="/auth" className="text-primary hover:underline">go back to request again</a>.
          </CardFooter>
       </Card>
     </div>
  );
}