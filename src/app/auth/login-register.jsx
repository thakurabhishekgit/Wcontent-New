import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

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

  const navigate = useNavigate();

  // Handle Login
  const handleLoginSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch("http://localhost:3001/api/users/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      if (response.ok) {
        const data = await response.json();
        localStorage.setItem("token", data.token);
        localStorage.setItem("id", data.user.id);
        localStorage.setItem("username", data.user.username);
        navigate("/");
        window.location.reload();
      } else {
        const data = await response.json();
        setError(data.message || "Login failed. Please try again.");
      }
    } catch (error) {
      setError("Error logging in. Please try again.");
    }
  };

  // Handle Send OTP
  const handleEmailSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch(
        `http://localhost:3001/api/users/request-otp?email=${encodeURIComponent(
          email
        )}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (response.ok) {
        setIsOtpSent(true);
      } else {
        const data = await response.json();
        setError(data.message || "Error sending OTP. Please try again.");
      }
    } catch (error) {
      setError("Error sending OTP. Please try again.");
    }
  };

  // Handle Verify OTP
  const handleOtpSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch(
        `http://localhost:3001/api/users/verify-otp?email=${encodeURIComponent(
          email
        )}&otp=${encodeURIComponent(otp)}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (response.ok) {
        setIsOtpVerified(true);
      } else {
        const data = await response.json();
        setError(data.message || "Invalid OTP. Please try again.");
      }
    } catch (error) {
      setError("Error verifying OTP. Please try again.");
    }
  };

  // Handle Registration
  const handleRegisterSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch("http://localhost:3001/api/users/register", {
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
        localStorage.setItem("token", data.token);
        localStorage.setItem("id", data.user.id);
        localStorage.setItem("username", data.user.username);
        setIsRegistering(false);
        navigate("/");
        window.location.reload();
      } else {
        const data = await response.json();
        setError(data.message || "Registration failed. Please try again.");
      }
    } catch (error) {
      setError("Error registering. Please try again.");
    }
  };

  return (
    <div className="login-container">
      {/* Left Side */}
      <div className="left-side">
        <div className="content">
          <h1>Welcome to Our Platform</h1>
          <p>
            Join us today to explore amazing features and take your career to
            the next level. Whether you're a content creator or a role seeker,
            we've got you covered.
          </p>
          <img
            src="https://png.pngtree.com/png-vector/20220525/ourmid/pngtree-content-creator-background-vector-illustration-of-freelancer-blogger-and-video-vlogger-png-image_4726845.png"
            alt="Illustration"
          />
        </div>
      </div>

      {/* Right Side */}
      <div className="right-side">
        <div className="form-container">
          <h2>{isRegistering ? "Sign Up" : "Login"}</h2>
          {error && <p className="error-message">{error}</p>}

          {/* Conditional Rendering for Login */}
          {!isRegistering && !isOtpSent && (
            <form onSubmit={handleLoginSubmit}>
              <div className="input-container">
                <label>Email</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="input"
                />
              </div>
              <div className="input-container">
                <label>Password</label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="input"
                />
              </div>
              <button type="submit" className="submit-button">
                Login
              </button>
            </form>
          )}

          {/* Conditional Rendering for Email */}
          {isRegistering && !isOtpSent && (
            <form onSubmit={handleEmailSubmit}>
              <div className="input-container">
                <label>Email</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="input"
                />
              </div>
              <button type="submit" className="submit-button">
                Send OTP
              </button>
            </form>
          )}

          {/* Conditional Rendering for OTP Verification */}
          {isOtpSent && !isOtpVerified && (
            <form onSubmit={handleOtpSubmit}>
              <div className="input-container">
                <label>Enter OTP</label>
                <input
                  type="text"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  required
                  className="input"
                />
              </div>
              <button type="submit" className="submit-button">
                Verify OTP
              </button>
            </form>
          )}

          {/* Conditional Rendering for Register Form */}
          {isOtpVerified && isRegistering && (
            <form onSubmit={handleRegisterSubmit}>
              <div className="input-container">
                <label>Username</label>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                  className="input"
                />
              </div>
              <div className="input-container">
                <label>Password</label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="input"
                />
              </div>
              <div className="input-container">
                <label>User Type</label>
                <select
                  value={userType}
                  onChange={(e) => setUserType(e.target.value)}
                  required
                  className="input"
                >
                  <option value="ChannelOwner">Channel Owner</option>
                  <option value="RoleSeeker">Role Seeker</option>
                </select>
              </div>
              <div className="input-container">
                <label>Channel Name</label>
                <input
                  type="text"
                  value={channelName}
                  onChange={(e) => setChannelName(e.target.value)}
                  required
                  className="input"
                />
              </div>
              <div className="input-container">
                <label>Channel ID</label>
                <input
                  type="text"
                  value={channelId}
                  onChange={(e) => setChannelId(e.target.value)}
                  required
                  className="input"
                />
              </div>
              <div className="input-container">
                <label>Channel URL</label>
                <input
                  type="url"
                  value={channelURL}
                  onChange={(e) => setChannelURL(e.target.value)}
                  required
                  className="input"
                />
              </div>
              <button type="submit" className="submit-button">
                Sign Up
              </button>
            </form>
          )}

          <div className="toggle-link">
            <p>
              {isRegistering ? "Already have an account?" : "No account? "}
              <span
                onClick={() => setIsRegistering(!isRegistering)}
                className="link"
              >
                {isRegistering ? "Login" : "Sign Up"}
              </span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;