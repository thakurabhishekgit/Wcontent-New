
'use server';
/**
 * @fileOverview An AI agent for generating content ideas, headlines, and outlines.
 *
 * - generateContentIdeas - A function that handles the content generation process based on mode.
 * - GenerateContentIdeasInput - The input type for the generateContentIdeas function.
 * - GenerateContentIdeasOutput - The return type for the generateContentIdeas function.
 */

import {ai} from '@/ai/ai-instance'; // Keeping import as .js
import {z} from 'genkit';

// Updated Input Schema
const GenerateContentIdeasInputSchema = z.object({
  prompt: z.string().describe('A core topic or prompt to generate content from.'),
  tone: z.string().optional().describe('The desired tone for the generated content (e.g., Formal, Casual, Humorous).'),
  format: z.string().optional().describe('The desired format for the generated content (e.g., Blog Post, Video Script, Tweet).'),
  generationMode: z.string().default('ideas').describe('The type of content to generate: "ideas", "headlines", or "outline".'), // Added 'outline'
});


// Updated Output Schema - now includes outlines
const GenerateContentIdeasOutputSchema = z.object({
  ideas: z.array(z.string()).optional().describe('A list of content ideas.'),
  headlines: z.array(z.string()).optional().describe('A list of suggested headlines.'),
  outline: z.array(z.string()).optional().describe('A list of main points for a content outline.'), // Added outline field
});


export async function generateContentIdeas(input) { // Input type matches schema implicitly in JS
  return generateContentIdeasFlow(input);
}

// Updated Prompt Definition - Removed 'eq' helper, uses direct instructions.
const prompt = ai.definePrompt({
  name: 'generateContentIdeasPrompt',
  input: { // Input schema matches the updated schema
    schema: GenerateContentIdeasInputSchema,
  },
  output: { // Output schema matches the updated schema
    schema: GenerateContentIdeasOutputSchema,
  },
  // Use direct instructions based on generationMode variable
  prompt: `You are a creative content expert specializing in brainstorming and refining content.
The user wants to generate "{{generationMode}}" based on the core topic below.
{{#if tone}}Your response should adopt a {{tone}} tone.{{/if}}
{{#if format}}The content should be suitable for the {{format}} format.{{/if}}

Core Topic:
"{{{prompt}}}"

Instructions based on requested mode "{{generationMode}}":
- If mode is "ideas", generate a list of 5-10 engaging and unique content ideas. Focus on creativity and audience appeal. Put these in the "ideas" field of the JSON output.
- If mode is "headlines", generate 5-7 compelling headlines that would capture attention for content based on the topic. Consider SEO and clickability. Put these in the "headlines" field of the JSON output.
- If mode is "outline", generate a brief outline with 3-5 main points for a piece of content (like a blog post or video script) based on the topic. Present each main point as a string in the output array. Put these in the "outline" field of the JSON output.

Return the result ONLY in the specified JSON format, populating ONLY the correct field ('ideas', 'headlines', or 'outline') based on the requested generation mode. Ensure other fields are omitted or null in the JSON output.
`,
});


const generateContentIdeasFlow = ai.defineFlow(
  {
    name: 'generateContentIdeasFlow',
    inputSchema: GenerateContentIdeasInputSchema,
    outputSchema: GenerateContentIdeasOutputSchema,
  },
  async input => {
     // The prompt now handles the logic based on generationMode internally via instructions
    const {output} = await prompt(input);
    // The output should conform to the output schema, containing the relevant generated list (ideas, headlines, outline, etc.)
    if (!output) {
        // Handle the case where the prompt call returns null or undefined output
        throw new Error("AI failed to generate a valid response.");
     }
    return output; // Ensure output is not null
  }
);
