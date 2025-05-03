'use server';
/**
 * @fileOverview A content idea generation AI agent.
 *
 * - generateContentIdeas - A function that handles the content idea generation process.
 * - GenerateContentIdeasInput - The input type for the generateContentIdeas function.
 * - GenerateContentIdeasOutput - The return type for the generateContentIdeas function.
 */

import {ai} from '@/ai/ai-instance';
import {z} from 'genkit';

const GenerateContentIdeasInputSchema = z.object({
  prompt: z.string().describe('A prompt to generate content ideas from.'),
});
export type GenerateContentIdeasInput = z.infer<typeof GenerateContentIdeasInputSchema>;

const GenerateContentIdeasOutputSchema = z.object({
  ideas: z.array(z.string()).describe('A list of content ideas.'),
});
export type GenerateContentIdeasOutput = z.infer<typeof GenerateContentIdeasOutputSchema>;

export async function generateContentIdeas(input: GenerateContentIdeasInput): Promise<GenerateContentIdeasOutput> {
  return generateContentIdeasFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateContentIdeasPrompt',
  input: {
    schema: z.object({
      prompt: z.string().describe('A prompt to generate content ideas from.'),
    }),
  },
  output: {
    schema: z.object({
      ideas: z.array(z.string()).describe('A list of content ideas.'),
    }),
  },
  prompt: `You are a content creation expert, skilled at brainstorming creative ideas. Please generate a list of content ideas based on the following prompt: {{{prompt}}}`,
});

const generateContentIdeasFlow = ai.defineFlow<
  typeof GenerateContentIdeasInputSchema,
  typeof GenerateContentIdeasOutputSchema
>(
  {
    name: 'generateContentIdeasFlow',
    inputSchema: GenerateContentIdeasInputSchema,
    outputSchema: GenerateContentIdeasOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
