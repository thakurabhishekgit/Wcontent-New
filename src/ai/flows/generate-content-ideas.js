'use server';
/**
 * @fileOverview An AI agent for generating content ideas, headlines, and potentially other formats.
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
  generationMode: z.string().default('ideas').describe('The type of content to generate: "ideas", "headlines", etc.'),
});
// No explicit type export needed in JS: export type GenerateContentIdeasInput = z.infer<typeof GenerateContentIdeasInputSchema>;

// Updated Output Schema - potentially includes different types of content
const GenerateContentIdeasOutputSchema = z.object({
  ideas: z.array(z.string()).optional().describe('A list of content ideas.'),
  headlines: z.array(z.string()).optional().describe('A list of suggested headlines.'),
  // Add other potential outputs here, e.g., outlines: z.array(...)
});
// No explicit type export needed in JS: export type GenerateContentIdeasOutput = z.infer<typeof GenerateContentIdeasOutputSchema>;

export async function generateContentIdeas(input) { // Input type matches schema implicitly in JS
  return generateContentIdeasFlow(input);
}

// Updated Prompt Definition - uses Handlebars for conditional logic
const prompt = ai.definePrompt({
  name: 'generateContentIdeasPrompt',
  input: { // Input schema matches the updated schema
    schema: GenerateContentIdeasInputSchema,
  },
  output: { // Output schema matches the updated schema
    schema: GenerateContentIdeasOutputSchema,
  },
  // Use Handlebars for conditional prompting based on generationMode
  prompt: `You are a creative content expert specializing in brainstorming and refining content.
{{#if tone}}Your response should adopt a {{tone}} tone.{{/if}}
{{#if format}}The content should be suitable for the {{format}} format.{{/if}}

Based on the following core topic:
"{{{prompt}}}"

{{#eq generationMode "ideas"}}
Please generate a list of 5-10 engaging and unique content ideas. Focus on creativity and audience appeal.
{{/eq}}

{{#eq generationMode "headlines"}}
Please generate 5-7 compelling headlines that would capture attention for content based on the topic. Consider SEO and clickability.
{{/eq}}

{{#eq generationMode "outline"}}
Please generate a brief outline with 3-5 main points for a piece of content (like a blog post or video script) based on the topic.
{{/eq}}

{{!-- Add more modes here as needed --}}

Return the result in the specified JSON format, populating the correct field ('ideas', 'headlines', 'outline', etc.) based on the request.
`,
});


const generateContentIdeasFlow = ai.defineFlow(
  {
    name: 'generateContentIdeasFlow',
    inputSchema: GenerateContentIdeasInputSchema,
    outputSchema: GenerateContentIdeasOutputSchema,
  },
  async input => {
     // The prompt now handles the logic based on generationMode internally via Handlebars
    const {output} = await prompt(input);
    // The output should conform to the output schema, containing the relevant generated list (ideas, headlines, etc.)
    return output; // Ensure output is not null
  }
);
