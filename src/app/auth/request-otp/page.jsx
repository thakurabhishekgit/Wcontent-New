'use client'; // Moved to the top

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function LoginRegisterPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLogin, setIsLogin] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    setError(null);
  }, [email, password, isLogin]);

  const handleLogin = async () => {
    try {
      const response = await fetch(
        "http://localhost:3001/api/v1/auth/login",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email, password }),
        }
      );
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Login failed");
      }

      const data = await response.json();
      const token = data.data.token;
      localStorage.setItem("token", token);
      console.log(data);
      router.push("/dashboard");
    } catch (err) {
      console.error("Login error:", err.message);
      setError(err.message);
    }
  };

  const handleRegister = async () => {
    try {
      const response = await fetch(
        "http://localhost:3001/api/v1/auth/register",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email, password }),
        }
        
      );
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Registration failed");
      }
      const data = await response.json();
      const token = data.data.token;
      localStorage.setItem("token", token);
      console.log(data);

      router.push("/dashboard");
    } catch (err) {
      console.error("Registration error:", err.message);
      setError(err.message);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">
        {isLogin ? "Login" : "Register"}
      </h1>
      {error && <div className="text-red-500 mb-4">{error}</div>}
      <div className="max-w-md mx-auto">
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full mb-4 px-3 py-2 border rounded-md"
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full mb-4 px-3 py-2 border rounded-md"
        />
        <button
          onClick={isLogin ? handleLogin : handleRegister}
          className="w-full bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-700"
        >
          {isLogin ? "Login" : "Register"}
        </button>
        <p className="mt-4 text-center">
          {isLogin ? "Don't have an account?" : "Already have an account?"}
          <button
            onClick={() => setIsLogin(!isLogin)}
            className="text-blue-500 hover:underline ml-2"
          >
            {isLogin ? "Register" : "Login"}
          </button>
        </p>
        {!isLogin && (
          <p className="mt-4 text-center">
          or <Link href="/auth/request-otp" className="text-blue-500 hover:underline ml-2">Register with OTP</Link>
          </p>
        )}
      </div>
    </div>
  );
}
