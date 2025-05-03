
import {genkit} from 'genkit';
import {googleAI} from '@genkit-ai/googleai';

// Note: Keeping AI logic in TypeScript as requested by user preference/Genkit standards.
// If migration to JS is strictly needed, this needs to be converted.
export const ai = genkit({
  promptDir: './prompts',
  plugins: [
    googleAI({
      apiKey: process.env.GOOGLE_GENAI_API_KEY,
    }),
  ],
  model: 'googleai/gemini-2.0-flash',
});
