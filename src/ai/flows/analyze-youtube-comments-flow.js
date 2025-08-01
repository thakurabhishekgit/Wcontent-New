
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


const AnalyzeYoutubeCommentsOutputSchema = z.object({
  overallSentiment: z.string().describe("A single word describing the overall sentiment (e.g., Positive, Mixed, Negative)."),
  positivePoints: z.array(z.string()).describe("A list of key positive points or compliments from the comments."),
  negativePoints: z.array(z.string()).describe("A list of key negative points, critiques, or questions from the comments."),
  suggestions: z.array(z.string()).describe("A list of actionable suggestions for the creator based on the comment analysis."),
});


export async function analyzeYoutubeComments(input) {
  return analyzeYoutubeCommentsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'youtubeCommentAnalysisPrompt',
  // The prompt now takes a string of concatenated comments
  input: { schema: z.string() }, 
  output: { schema: AnalyzeYoutubeCommentsOutputSchema },
  prompt: `You are a YouTube content strategy expert. Your task is to analyze a list of real comments from a YouTube video and provide a concise, insightful summary.

Here are the comments:
---
{{{input}}}
---

Based on these comments, perform the following actions:

1.  **Determine the overallSentiment**: Characterize the general feeling from the comments in a single word (e.g., 'Positive', 'Mostly Positive', 'Mixed', 'Negative').
2.  **Identify positivePoints**: Extract 2-3 key positive themes or specific compliments from the comments.
3.  **Identify negativePoints**: Extract 2-3 key negative points, constructive critiques, or common questions from the comments.
4.  **Provide actionable suggestions**: Based on the identified points, create a list of 2-3 concrete, actionable recommendations for the creator's future content.

Return your response ONLY in the specified JSON format. The analysis should be based *only* on the provided comments.
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
        // Return a specific structure if no comments are found, so the UI can handle it
        return {
            overallSentiment: "N/A",
            positivePoints: ["No comments found or comments are disabled for this video."],
            negativePoints: [],
            suggestions: ["Enable comments or promote engagement to get feedback."],
        };
    }

    // Join comments into a single string for the AI prompt
    const commentsText = comments.join('\n---\n');
    
    // Pass the real comments to the AI for analysis
    const { output } = await prompt(commentsText);
    
    if (!output) {
      throw new Error("AI failed to generate a valid analysis from the comments.");
    }

    return output;
  }
);
