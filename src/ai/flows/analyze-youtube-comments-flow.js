
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

const sampleComments = [
    "This was the best explanation I've seen on this topic! The editing is so clean too.",
    "Great video, but the intro was way too long. I almost clicked away.",
    "Can you do a follow-up video on how to apply this to older models?",
    "I'm a new subscriber because of this video. So helpful!",
    "The audio is a bit low in some parts, had to turn my volume way up.",
    "Finally, someone who explains it simply. Thank you!",
    "I disagree with your point about the software's limitation. It's actually a feature if you use it this way...",
    "Loved the background music! What's the name of the track?",
    "Your energy is amazing, keep it up!",
    "A little too fast for beginners. Maybe slow it down next time?",
];

const prompt = ai.definePrompt({
  name: 'youtubeCommentAnalysisPrompt',
  input: { schema: AnalyzeYoutubeCommentsInputSchema },
  output: { schema: AnalyzeYoutubeCommentsOutputSchema },
  prompt: `You are a YouTube content strategy expert. Your task is to analyze a list of comments from a video and provide a concise, structured analysis for the creator.

The creator's video URL is: {{{videoUrl}}}

Here is a representative sample of comments from the video:
---
{{#each comments}}
- "{{this}}"
{{/each}}
---

Based ONLY on the comments provided, perform the following actions:

1.  Determine the **overallSentiment**: Characterize the general feeling from the comments in a single word (e.g., 'Positive', 'Mostly Positive', 'Mixed', 'Negative').
2.  Identify **positivePoints**: List 2-3 key things viewers liked (e.g., specific explanations, editing style, on-screen presence). Be specific.
3.  Identify **negativePoints**: List 2-3 key critiques or suggestions for improvement mentioned by viewers (e.g., audio issues, video length, confusing sections). Be specific.
4.  Provide actionable **suggestions**: Based on the positive and negative points, create a list of 2-3 concrete, actionable recommendations for the creator's future content.

Return your response ONLY in the specified JSON format.
`,
});

const analyzeYoutubeCommentsFlow = ai.defineFlow(
  {
    name: 'analyzeYoutubeCommentsFlow',
    inputSchema: AnalyzeYoutubeCommentsInputSchema,
    outputSchema: AnalyzeYoutubeCommentsOutputSchema,
  },
  async (input) => {
    // In a real application, you would use the YouTube Data API to fetch comments for the input.videoUrl.
    // For this demonstration, we are using a hardcoded list of sample comments.
    const commentsToAnalyze = sampleComments;

    const { output } = await prompt({
        videoUrl: input.videoUrl,
        comments: commentsToAnalyze,
    });
    
    if (!output) {
      throw new Error("AI failed to generate a valid analysis.");
    }

    return output;
  }
);
