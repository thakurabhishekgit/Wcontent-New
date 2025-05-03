
'use client'; // Add this directive

import React, { useState } from "react";

function Ml() {
  const [url, setUrl] = useState("");
  const [summary, setSummary] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [geminiResponse, setGeminiResponse] = useState("");

  const isValidYouTubeUrl = (url) => {
    const pattern = /^(https?:\/\/)?(www\.)?(youtube\.com|youtu\.be)\/.+/;
    return pattern.test(url);
  };

  const handleAnalyze = async () => {
    if (!isValidYouTubeUrl(url)) {
      setError("Please enter a valid YouTube URL");
      return;
    }

    setLoading(true);
    setError("");
    setSummary("");
    setGeminiResponse("");

    try {
      const response = await fetch(
        `http://127.0.0.1:5000/get_comments_summary?videoLink=${encodeURIComponent(
          url
        )}`
      );

      if (!response.ok) {
        throw new Error("Failed to analyze comments");
      }

      const data = await response.json();
      setSummary(data.summary);
    } catch (err) {
      setError(err.message || "An error occurred during analysis");
    } finally {
      setLoading(false);
    }
  };

  const handleGeminiRequest = async () => {
    if (!summary) {
      setError("Please analyze comments first.");
      return;
    }

    setLoading(true);
    setError("");
    setGeminiResponse("");

    try {
      const prompt = `How can I improve my YouTube video performance based on the following summary? Summary: ${summary}`;
      const apiKey = "AIzaSyAFXOKE8qMD6tECr9A9JT9OMPKFcrQIvp4"; // Your Gemini API key
      const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${apiKey}`;

      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                {
                  text: prompt,
                },
              ],
            },
          ],
        }),
      });

      const data = await response.json();
      const geminiText =
        data.candidates?.[0]?.content?.parts?.[0]?.text ||
        "No response from Gemini.";
      setGeminiResponse(geminiText);
    } catch (err) {
      setError("Failed to fetch suggestions from Gemini.");
    } finally {
      setLoading(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const droppedUrl = e.dataTransfer.getData("text/plain");
    if (isValidYouTubeUrl(droppedUrl)) {
      setUrl(droppedUrl);
    }
  };

  return (
    <div className="app-container">
      <style>{`
  .app-container {
    min-height: 100vh;
    display: flex;
    flex-direction: column;
    align-items: center;
    background: linear-gradient(135deg, #0f0f0f, #1a1a1a);
    padding: 2rem;
    overflow: hidden;
    color: #fff;
  }

  .content-wrapper {
    max-width: 1300px;
    background: #2a2a2a;
    border-radius: 24px;
    box-shadow: 0 12px 24px rgba(0, 0, 0, 0.3);
    padding: 2rem;
    display: flex;
    flex-direction: column;
    align-items: center;
  }

  .image-container {
    text-align: center;
    margin-bottom: 2rem;
  }

  .image-container img {
    width: 100%;
    max-width: 400px;
    border-radius: 16px;
    border: 2px solid #444;
  }

  .title {
    color: #fff;
    font-size: 2.2rem;
    margin-bottom: 1rem;
    text-align: center;
  }

  .description {
    color: #ccc;
    font-size: 1.1rem;
    line-height: 1.6;
    margin-bottom: 2rem;
    text-align: center;
  }

  .url-input-container {
    border: 2px dashed #444;
    border-radius: 10px;
    padding: 1.5rem;
    margin-bottom: 1.5rem;
    transition: all 0.3s ease;
    width: 100%;
    background-color: #333;
  }

  .url-input-container:hover {
    border-color: #3b82f6;
    background-color: #3a3a3a;
  }

  .url-input {
    width: 100%;
    border: none;
    outline: none;
    font-size: 1.1rem;
    padding: 0.5rem;
    text-align: center;
    color: #fff;
    background-color: transparent;
  }

  .url-input::placeholder {
    color: #888;
  }

  .analyze-button {
    width: 100%;
    padding: 1rem;
    background: #3b82f6;
    color: white;
    border: none;
    border-radius: 8px;
    font-size: 1.1rem;
    cursor: pointer;
    transition: transform 0.2s ease, box-shadow 0.2s ease;
  }

  .analyze-button:hover:not(:disabled) {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(59, 130, 246, 0.3);
  }

  .analyze-button:disabled {
    background: #93c5fd;
    cursor: not-allowed;
  }

  .loading-container {
    display: flex;
    justify-content: center;
    margin: 2rem 0;
  }

  .loader {
    border: 4px solid #444;
    border-top: 4px solid #3b82f6;
    border-radius: 50%;
    width: 40px;
    height: 40px;
    animation: spin 1s linear infinite;
  }

  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }

  .error-message {
    color: #ff4d4f;
    background: #2a2a2a;
    padding: 1rem;
    border-radius: 8px;
    margin: 1rem 0;
    text-align: center;
    border: 1px solid #444;
  }

  .results-container {
    margin-top: 2rem;
    padding: 1.5rem;
    background: #333;
    border-radius: 12px;
    width: 100%;
    border: 1px solid #444;
  }

  .results-container h2 {
    color: #3b82f6;
    margin-bottom: 1rem;
    font-size: 1.5rem;
  }

  .summary-text {
    color: #ccc;
    line-height: 1.6;
    white-space: pre-wrap;
  }

  .gemini-response {
    margin-top: 1rem;
    padding: 1rem;
    background: #3a3a3a;
    border-radius: 8px;
    color: #fff;
    border: 1px solid #444;
  }

  @media (max-width: 768px) {
    .app-container {
      padding: 1rem;
    }

    .content-wrapper {
      padding: 1rem;
    }

    .title {
      font-size: 1.8rem;
    }

    .description {
      font-size: 1rem;
    }
  }
`}</style>

      <div className="content-wrapper">
        {/* Image Section */}
        <div className="image-container">
          <img
            src="https://img.freepik.com/premium-photo/youtube-logo-video-player-3d-design-video-media-player-interface_41204-12379.jpg?ga=GA1.1.696049277.1738259953&semt=ais_hybrid"
            alt="YouTube Creator"
          />
        </div>

        {/* Title and Description */}
        <h1 className="title">YouTube Comment AI Analyzer</h1>
        <p className="description">
          Transform raw YouTube comments into meaningful insights with our
          AI-powered analysis. Get instant sentiment analysis, key themes, and
          comprehensive summaries of any video's comment section.
        </p>

        {/* URL Input and Analyze Button */}
        <div
          className="url-input-container"
          onDragOver={(e) => e.preventDefault()}
          onDrop={handleDrop}
        >
          <input
            type="text"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="Paste or drop YouTube URL here"
            className="url-input"
          />
        </div>
        <button
          onClick={handleAnalyze}
          className="analyze-button"
          disabled={loading}
        >
          {loading ? "Analyzing..." : "Analyze Comments"}
        </button>

        {/* Error Message */}
        {error && <div className="error-message">{error}</div>}

        {/* Loading Spinner */}
        {loading && (
          <div className="loading-container">
            <div className="loader"></div>
          </div>
        )}

        {/* Results Section */}
        {summary && (
          <div className="results-container">
            <h2>AI Analysis Results</h2>
            <div className="summary-text">{summary}</div>
            <button
              onClick={handleGeminiRequest}
              className="analyze-button"
              disabled={loading}
            >
              Get Improvement Suggestions
            </button>
            {geminiResponse && (
              <div className="gemini-response">
                <h3>Improvement Suggestions:</h3>
                <p>{geminiResponse}</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default Ml;
