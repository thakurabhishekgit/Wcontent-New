
'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { generateContentIdeas } from '@/ai/flows/generate-content-ideas'; // Import the Genkit flow
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Terminal } from "lucide-react";

const formSchema = z.object({
  prompt: z.string().min(10, { message: 'Prompt must be at least 10 characters long.' }).max(500, { message: 'Prompt cannot exceed 500 characters.' }),
});

export default function GeneratePage() {
  const [generatedIdeas, setGeneratedIdeas] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      prompt: '',
    },
  });

  const onSubmit = async (data) => {
    setIsLoading(true);
    setError(null);
    setGeneratedIdeas([]); // Clear previous ideas

    try {
      const result = await generateContentIdeas({ prompt: data.prompt });
      if (result && result.ideas) {
        setGeneratedIdeas(result.ideas);
      } else {
         setError('Failed to generate ideas. The AI returned an unexpected response.');
      }
    } catch (err) {
      console.error('Error generating content ideas:', err);
       setError(`An error occurred: ${err instanceof Error ? err.message : 'Unknown error'}. Please try again.`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-8">
      <h1 className="text-3xl md:text-4xl font-bold">Generate Content Ideas</h1>
      <p className="text-lg text-foreground/80">
        Stuck in a creative rut? Enter a topic or keyword, and let our AI brainstorm content ideas for you.
      </p>

      <Card>
        <CardHeader>
          <CardTitle>Idea Generator</CardTitle>
          <CardDescription>Describe your topic or desired content angle below.</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="prompt"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Your Prompt</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="e.g., 'sustainable living tips for beginners', 'unique video ideas for a cooking channel', 'blog post topics about AI in marketing'"
                        className="resize-none"
                        rows={4}
                        {...field}
                        disabled={isLoading}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" disabled={isLoading}>
                {isLoading ? 'Generating...' : 'Generate Ideas'}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>

      {error && (
         <Alert variant="destructive">
           <Terminal className="h-4 w-4" />
           <AlertTitle>Error</AlertTitle>
           <AlertDescription>{error}</AlertDescription>
         </Alert>
       )}

      {(isLoading || generatedIdeas.length > 0) && (
        <Card>
          <CardHeader>
            <CardTitle>Generated Ideas</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="space-y-4">
                <Skeleton className="h-6 w-3/4" />
                <Skeleton className="h-6 w-full" />
                <Skeleton className="h-6 w-5/6" />
                 <Skeleton className="h-6 w-4/5" />
              </div>
            ) : (
               generatedIdeas.length > 0 ? (
                <ul className="list-disc space-y-2 pl-5 text-foreground/90">
                  {generatedIdeas.map((idea, index) => (
                    <li key={index}>{idea}</li>
                  ))}
                </ul>
               ) : (
                 !error && <p className="text-foreground/60">No ideas generated. Try refining your prompt.</p>
               )
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
