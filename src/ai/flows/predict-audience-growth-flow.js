'use server';
/**
 * @fileOverview An AI agent for predicting audience growth and retention based on channel stats and a new content idea.
 *
 * - predictAudienceGrowth - A function that takes a channel handle and content idea, and returns a detailed forecast.
 * - PredictAudienceGrowthInput - The input type for the function.
 * - PredictAudienceGrowthOutput - The return type for the function.
 */

import { ai } from '@/ai/ai-instance';
import { z } from 'genkit';
import axios from 'axios';

// Helper to fetch channel statistics from YouTube Data API
async function getChannelStats(channelIdOrHandle) {
  const YOUTUBE_API_KEY = "AIzaSyCoPHVrt3lWUR_cbbRINh91GHzBFgcKl78";
  if (!YOUTUBE_API_KEY) {
    throw new Error("YouTube API Key is not configured on the server.");
  }

  let params = {
    part: 'snippet,statistics,topicDetails',
    key: YOUTUBE_API_KEY,
  };

  if (channelIdOrHandle.startsWith('UC')) {
    params.id = channelIdOrHandle;
  } else {
    // Note: forHandle is deprecated but still works for some cases. A more robust solution might involve the Search API.
    params.forUsername = channelIdOrHandle.startsWith('@') ? channelIdOrHandle.substring(1) : channelIdOrHandle;
  }
  
  try {
    const response = await axios.get('https://www.googleapis.com/youtube/v3/channels', { params });
    if (!response.data.items || response.data.items.length === 0) {
      throw new Error(`Channel not found for handle/ID: ${channelIdOrHandle}`);
    }
    const channel = response.data.items[0];
    const topics = channel.topicDetails?.topicCategories
        ?.map(tc => tc.split('/').pop().replace(/_/g, ' ')) || [];

    return {
      title: channel.snippet.title,
      subscribers: parseInt(channel.statistics.subscriberCount, 10),
      views: parseInt(channel.statistics.viewCount, 10),
      videos: parseInt(channel.statistics.videoCount, 10),
      topics: topics,
    };
  } catch (error) {
    console.error("Error fetching YouTube channel stats:", error.response?.data?.error || error.message);
    throw new Error(`Failed to fetch channel statistics. Please check the channel handle/ID. Details: ${error.message}`);
  }
}

// Zod Schemas for the flow
const PredictAudienceGrowthInputSchema = z.object({
  channelHandle: z.string().describe("The user's YouTube channel handle (e.g., @YourHandle) or ID (e.g., UC...)."),
  contentType: z.string().describe("The genre or type of the planned new content."),
  ideaDescription: z.string().describe("A brief description of the new content idea."),
});

const PredictAudienceGrowthOutputSchema = z.object({
  currentStats: z.object({
    subscribers: z.string().describe("Current subscriber count as a formatted string (e.g., '1,234,567')."),
    videos: z.string().describe("Current total video count as a formatted string."),
    views: z.string().describe("Current total view count as a formatted string."),
    topics: z.array(z.string()).describe("List of existing primary topics for the channel."),
  }),
  predictedGrowth: z.object({
    nextMonth: z.string().describe("Predicted subscriber count after one month as a formatted string."),
    threeMonths: z.string().describe("Predicted subscriber count after three months as a formatted string."),
  }),
  predictedRetention: z.object({
    outlook: z.enum(['High', 'Medium', 'Low']).describe("The qualitative forecast for audience retention (High, Medium, or Low)."),
    summary: z.string().describe("A 1-2 sentence summary explaining the retention outlook."),
    keyFactors: z.array(z.string()).describe("A list of key factors influencing this retention prediction."),
  }),
  improvementTips: z.array(z.string()).length(3).describe("An array of exactly 3 actionable tips to maximize success for this content idea."),
});

// Exported async function to be called by the frontend
export async function predictAudienceGrowth(input) {
  return predictAudienceGrowthFlow(input);
}


// The main Genkit flow
const predictAudienceGrowthFlow = ai.defineFlow(
  {
    name: 'predictAudienceGrowthFlow',
    inputSchema: PredictAudienceGrowthInputSchema,
    outputSchema: PredictAudienceGrowthOutputSchema,
  },
  async (input) => {
    // Step 1: Fetch real-time channel statistics
    const stats = await getChannelStats(input.channelHandle);

    // Step 2: Use the AI to generate the prediction
    const llmResponse = await ai.generate({
      prompt: `You are a YouTube growth strategy expert. Analyze the provided channel data and the creator's new content idea to generate a forecast.

      **Current Channel Data:**
      - Title: ${stats.title}
      - Subscribers: ${stats.subscribers.toLocaleString()}
      - Total Views: ${stats.views.toLocaleString()}
      - Total Videos: ${stats.videos.toLocaleString()}
      - Existing Topics: ${stats.topics.join(', ') || 'General'}

      **Creator's New Content Idea:**
      - Planned Content Type: ${input.contentType}
      - Description: ${input.ideaDescription}

      **Your Task:**
      Based on all the information above, perform a detailed analysis and provide a structured forecast. Consider the alignment of the new content with existing topics, market trends for the proposed content type, and the channel's current size.

      **Instructions for JSON Output:**
      1.  **currentStats**: Summarize the provided current stats. Format all numbers with commas.
      2.  **predictedGrowth**: Simulate subscriber growth. Provide estimated total subscriber counts for one month and three months from now. Base your prediction on the new content idea's potential impact. For example, if the idea is a good fit, growth should be higher than a simple projection. Format numbers with commas.
      3.  **predictedRetention**: Analyze audience retention. State if the outlook is 'High', 'Medium', or 'Low'. Provide a summary and list the key factors for your decision (e.g., "Alignment with existing content", "Potential to attract new viewers").
      4.  **improvementTips**: Provide exactly 3 concise, actionable tips to help the creator maximize the success of this new content idea.
      `,
      output: { schema: PredictAudienceGrowthOutputSchema },
    });

    const prediction = llmResponse.output;

    if (!prediction) {
      throw new Error("AI failed to generate a valid prediction. The model returned an empty response.");
    }

    return prediction;
  }
);
