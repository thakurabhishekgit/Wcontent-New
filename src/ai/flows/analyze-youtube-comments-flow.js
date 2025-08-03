
'use server';
/**
 * @fileOverview An AI agent for analyzing YouTube video comments by fetching them directly from the YouTube API.
 *
 * - analyzeYoutubeComments - A function that takes a video URL, fetches its comments, and returns an AI-generated summary.
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
    /(?:https?:\/\/)?(?:www\.)?youtube\.com\/shorts\/([^?]+)/,
  ];

  for (const pattern of patterns) {
    const match = url.match(pattern);
    if (match && match[1]) {
      videoId = match[1];
      break;
    }
  }
  return videoId;
}


const AnalyzeYoutubeCommentsInputSchema = z.object({
  videoUrl: z.string().url().describe("The URL of the YouTube video to analyze."),
});

// The output is now just a single string.
const AnalyzeYoutubeCommentsOutputSchema = z.string().describe("A concise text summary of the YouTube comments.");

export async function analyzeYoutubeComments(input) {
  return analyzeYoutubeCommentsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'youtubeCommentAnalysisPrompt',
  input: { schema: z.object({ comments: z.string() }) }, 
  output: { schema: AnalyzeYoutubeCommentsOutputSchema },
  // The prompt is simplified to just ask for a direct summary, as per the Python example.
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
    
    // Using the valid key you provided directly in the code.
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
                maxResults: 100, // Fetch up to 100 top-level comments
                order: 'relevance', // Fetch most relevant comments
            },
        });

        // **FIXED**: Correctly parse the nested JSON from the YouTube API response
        if (response.data.items) {
            comments = response.data.items.map(item => 
                item.snippet.topLevelComment.snippet.textDisplay
            );
        }

    } catch (error) {
        // Handle specific API errors, like when comments are disabled
        console.error("Error fetching YouTube comments:", error.response?.data?.error || error.message);
        if (error.response?.data?.error?.errors?.[0]?.reason === 'commentsDisabled') {
             throw new Error(`Comments are disabled for this video. Unable to generate a summary.`);
        }
        if (error.response && error.response.status === 403) {
             throw new Error(`Permission error fetching comments. The video may be private or your API key may have issues.`);
        }
        throw new Error(`Failed to fetch comments from YouTube. Please check the video URL and API key. Details: ${error.message}`);
    }

    if (comments.length === 0) {
        return "No comments were found for this video. Unable to generate a summary.";
    }

    // Join the array of comments into a single string for the AI
    const commentsText = comments.join('\n---\n');
    
    // Pass the comments as an object matching the prompt's input schema
    const { output } = await prompt({ comments: commentsText });
    
    if (!output) {
      throw new Error("AI failed to generate a valid summary from the comments. The model returned null.");
    }

    return output;
  }
);
