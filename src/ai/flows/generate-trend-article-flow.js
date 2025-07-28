
'use server';
/**
 * @fileOverview An AI agent for generating a detailed article about a content trend.
 *
 * - generateTrendArticle - A function that takes a video title and snippet to generate an article.
 * - GenerateTrendArticleInput - The input type for the function.
 * - GenerateTrendArticleOutput - The return type for the function.
 */

import {ai} from '@/ai/ai-instance';
import {z} from 'genkit';

const GenerateTrendArticleInputSchema = z.object({
  title: z.string().describe("The title of the example trend video."),
  snippet: z.string().describe("The description or snippet of the example trend video."),
});

const AiStepSchema = z.object({
    title: z.string().describe("The title of the creation step, e.g., 'Step 1: AI-Powered Script & Outline'."),
    content: z.string().describe("The detailed content for that creation step."),
});

const GenerateTrendArticleOutputSchema = z.object({
  fullArticle: z.string().describe("A detailed article (3-4 paragraphs) explaining why this is a trend, who it's for, and key elements for success. Use Markdown for formatting."),
  aiSteps: z.array(AiStepSchema).length(3).describe("An array of exactly 3 actionable, step-by-step instructions for a creator to make a similar video."),
});

export async function generateTrendArticle(input) {
  return generateTrendArticleFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateTrendArticlePrompt',
  input: { schema: GenerateTrendArticleInputSchema },
  output: { schema: GenerateTrendArticleOutputSchema },
  prompt: `You are an expert content strategist and YouTube trend analyst.
Your task is to analyze a video and create a detailed guide for other creators.

Based on the video title and snippet provided below, do the following:

1.  **Write a 'fullArticle':** Craft a detailed article (3-4 paragraphs) that explains this content trend. Cover these points:
    - What is the trend?
    - Why is it popular right now?
    - What kind of audience does it appeal to?
    - What are the key elements needed to make a successful video in this style?
    - Format your response using Markdown for headers and lists if needed.

2.  **Create 'aiSteps':** Provide exactly three (3) actionable, step-by-step instructions for a creator to replicate this trend. Each step should have a clear title and detailed content. Frame these as if an 'AI Assistant' is guiding the user. For example: 'Step 1: AI-Powered Script & Outline', 'Step 2: Visuals & Audio', 'Step 3: AI-Generated Titles & Tags'.

Video Title: "{{{title}}}"
Video Snippet: "{{{snippet}}}"

Return your response ONLY in the specified JSON format.
`,
});

const generateTrendArticleFlow = ai.defineFlow(
  {
    name: 'generateTrendArticleFlow',
    inputSchema: GenerateTrendArticleInputSchema,
    outputSchema: GenerateTrendArticleOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    if (!output) {
      throw new Error("AI failed to generate a valid trend article.");
    }
    return output;
  }
);
