jsx
"use client";

import { useState } from "react";
import Link from 'next/link';

export default function RequestOTPPage() {
  const [email, setEmail] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    // Dummy logic: In a real app, you would send the email to your backend
    // to generate and send an OTP. For now, we'll just simulate success
    // and potentially navigate to the OTP validation page.
    console.log("Requesting OTP for:", email);
    // TODO: Add navigation to OTP validation page on success
  };

  return (
    <div className="container mx-auto px-4 py-8 ">
      <h1 className="text-2xl font-bold mb-6">Request OTP</h1>
      <form onSubmit={handleSubmit} className="max-w-sm mx-auto">
        <div className="mb-4">
          <label htmlFor="email" className="block text-gray-700 text-sm font-bold mb-2">
            Email Address
          </label>
          <input
            type="email"
            id="email"
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
         <p className="text-sm mb-4">Submitting your email will send you an OTP.</p>
        <div className="flex items-center justify-between">
          <Link href="/auth/validate-otp" className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">
          Request OTP
          </Link>
        </div>
      </form>
    </div>
  );
}