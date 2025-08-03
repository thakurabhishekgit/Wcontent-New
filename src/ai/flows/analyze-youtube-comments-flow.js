'use server';
/**
 * @fileOverview An AI agent for analyzing YouTube video comments.
 *
 * - analyzeYoutubeComments - A function that takes a video URL and returns a sentiment analysis.
 * - AnalyzeYoutubeCommentsInput - The input type for the function.
 * - AnalyzeYoutubeCommentsOutput - The return type for the function.
 */

import {ai} from '@/ai/ai-instance';
import {z} from 'genkit';
import axios from 'axios';

// Helper function to extract Video ID from various YouTube URL formats
function getYouTubeVideoId(url) {
  let videoId = '';
  const patterns = [
    /(?:https?:\/\/)?(?:www\.)?youtube\.com\/watch\?v=([^&]+)/,
    /(?:https?:\/\/)?youtu\.be\/([^?]+)/,
    /(?:https?:\/\/)?(?:www\.)?youtube\.com\/embed\/([^?]+)/,
  ];

  for (const pattern of patterns) {
    const match = url.match(pattern);
    if (match && match[1]) {
      videoId = match[1];
      break;
    }
  }
  // This part handles short URLs like /shorts/VIDEO_ID
  if (!videoId && url.includes('/shorts/')) {
    const parts = url.split('/shorts/');
    if (parts.length > 1) {
        videoId = parts[1].split('?')[0];
    }
  }
  return videoId;
}


const AnalyzeYoutubeCommentsInputSchema = z.object({
  videoUrl: z.string().url().describe("The URL of the YouTube video to analyze."),
});


// SIMPLIFIED: The output is now just a single string.
const AnalyzeYoutubeCommentsOutputSchema = z.string().describe("A concise text summary of the YouTube comments.");


export async function analyzeYoutubeComments(input) {
  return analyzeYoutubeCommentsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'youtubeCommentAnalysisPrompt',
  // Using a structured object for input is more robust
  input: { schema: z.object({ comments: z.string() }) }, 
  output: { schema: AnalyzeYoutubeCommentsOutputSchema },
  // SIMPLIFIED: The prompt now asks for a simple summary.
  prompt: `You are a YouTube content strategy expert. Your task is to analyze a list of real comments from a YouTube video and provide a concise, insightful summary in 3-4 sentences.

Here are the comments:
---
{{{comments}}}
---

Based on these comments, please write a brief summary of the overall audience reaction and key discussion points.
`,
});

const analyzeYoutubeCommentsFlow = ai.defineFlow(
  {
    name: 'analyzeYoutubeCommentsFlow',
    inputSchema: AnalyzeYoutubeCommentsInputSchema,
    outputSchema: AnalyzeYoutubeCommentsOutputSchema,
  },
  async (input) => {
    const videoId = getYouTubeVideoId(input.videoUrl);

    if (!videoId) {
        throw new Error("Could not extract a valid YouTube Video ID from the URL.");
    }
    
    // Using the key you provided directly in the code.
    const YOUTUBE_API_KEY = "AIzaSyCoPHVrt3lWUR_cbbRINh91GHzBFgcKl78";
    if (!YOUTUBE_API_KEY) {
        throw new Error("YouTube API Key is not configured on the server.");
    }

    let comments = [];
    try {
        const response = await axios.get('https://www.googleapis.com/youtube/v3/commentThreads', {
            params: {
                part: 'snippet',
                videoId: videoId,
                key: YOUTUBE_API_KEY,
                maxResults: 50, // Fetch up to 50 top-level comments
                order: 'relevance', // Fetch most relevant comments
            },
        });

        if (response.data.items) {
            comments = response.data.items.map(item => 
                item.snippet.topLevelComment.snippet.textDisplay
            );
        }

    } catch (error) {
        console.error("Error fetching YouTube comments:", error.response?.data?.error || error.message);
        if (error.response && error.response.status === 403) {
             throw new Error(`Permission error fetching comments. The video may have comments disabled or your API key may have issues.`);
        }
        throw new Error(`Failed to fetch comments from YouTube. Please check the video URL and API key. Details: ${error.message}`);
    }

    if (comments.length === 0) {
        return "No comments were found for this video, or comments are disabled. Unable to generate a summary.";
    }

    const commentsText = comments.join('\n---\n');
    
    // Pass the comments as an object matching the prompt's input schema
    const { output } = await prompt({ comments: commentsText });
    
    if (!output) {
      throw new Error("AI failed to generate a valid summary from the comments. The model returned null.");
    }

    // The output is now just a string.
    return output;
  }
);
