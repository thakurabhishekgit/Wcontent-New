jsx
"use client";

import { useState } from "react";

export default function ValidateOtpPage() {
  const [otp, setOtp] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    // Dummy validation logic - for now, just navigate or show a message
    console.log("Validating OTP:", otp);
    // In a real app, you'd send the OTP to your backend for verification
    // For this dummy implementation, we navigate to registration on submit
    
  };
  
  


  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-2">
      <main className="flex flex-col items-center justify-center w-full flex-1 px-20 text-center">
        <h1 className="text-4xl font-bold mb-8">Validate OTP</h1>
        <form onSubmit={handleSubmit} className="flex flex-col items-center">
          <div className="mb-4">
            <label htmlFor="otp" className="sr-only">
              OTP
            </label>
            <input
              id="otp"
              type="text"
              placeholder="Enter OTP"
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              required
            />
          </div>
           <p className="mb-4">Submitting the OTP will validate it.</p>
           <a
            href='/auth/register'
            type="submit"
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
          >
            Validate
          </a>
         
        </form>
      </main>
    </div>
  );
}