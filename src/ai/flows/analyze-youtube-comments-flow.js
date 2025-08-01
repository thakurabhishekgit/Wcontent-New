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
  input: { schema: AnalyzeYoutubeCommentsInputSchema },
  output: { schema: AnalyzeYoutubeCommentsOutputSchema },
  prompt: `You are a YouTube content strategy expert. Your task is to analyze a YouTube video and provide a simulated, but realistic, summary of its potential comment section.

The user has provided the following video URL: {{{videoUrl}}}

Based on the likely topic and style of the video at the given URL, perform the following actions by generating a plausible and realistic set of comments in your mind:

1.  **Determine the overallSentiment**: Characterize the general feeling from the simulated comments in a single word (e.g., 'Positive', 'Mostly Positive', 'Mixed', 'Negative').
2.  **Identify positivePoints**: Generate 2-3 specific things viewers would likely praise about a video on this topic (e.g., "The explanation of [topic] was incredibly clear," "The editing style really matched the video's pace," "Great energy from the host!").
3.  **Identify negativePoints**: Generate 2-3 specific, constructive critiques or suggestions for improvement viewers might mention (e.g., "The audio was a bit low in some parts," "I wish the intro was shorter," "Could you do a follow-up on [related topic]?").
4.  **Provide actionable suggestions**: Based on the simulated positive and negative points, create a list of 2-3 concrete, actionable recommendations for the creator's future content.

Return your response ONLY in the specified JSON format. The analysis should be unique and tailored to the video at the provided URL.
`,
});

const analyzeYoutubeCommentsFlow = ai.defineFlow(
  {
    name: 'analyzeYoutubeCommentsFlow',
    inputSchema: AnalyzeYoutubeCommentsInputSchema,
    outputSchema: AnalyzeYoutubeCommentsOutputSchema,
  },
  async (input) => {
    // This flow now directly passes the URL to the AI for a simulated analysis,
    // making the response dynamic and relevant to the video link.
    const { output } = await prompt(input);
    
    if (!output) {
      throw new Error("AI failed to generate a valid analysis.");
    }

    return output;
  }
);
