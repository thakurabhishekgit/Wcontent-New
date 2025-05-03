
'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { generateContentIdeas } from '@/ai/flows/generate-content-ideas'; // Import the Genkit flow
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Terminal, LogIn, Lightbulb, Sparkles, Bot, Loader2, FileText } from "lucide-react"; // Added Loader2, FileText
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"; // Import AlertDialog components
import { useRouter } from 'next/navigation';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"; // Import Tabs


// Schema now includes tone and format, defaulting to optional strings
const formSchema = z.object({
  prompt: z.string().min(10, { message: 'Prompt must be at least 10 characters long.' }).max(500, { message: 'Prompt cannot exceed 500 characters.' }),
  tone: z.string().optional(),
  format: z.string().optional(),
  generationMode: z.string().default('ideas'), // Added generationMode
});

export default function GeneratePage() {
  const [generationResult, setGenerationResult] = useState(null); // Can store string array or other structures
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isClient, setIsClient] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [generationCount, setGenerationCount] = useState(0);
  const [showLoginAlert, setShowLoginAlert] = useState(false);
  const [activeTab, setActiveTab] = useState('ideas'); // State for active tab
  const router = useRouter();

  useEffect(() => {
    setIsClient(true);
    const token = localStorage.getItem('token');
    setIsLoggedIn(!!token);
    // Load generation count from localStorage if available
    const storedCount = localStorage.getItem('generationCount');
    if (storedCount) {
      setGenerationCount(parseInt(storedCount, 10));
    }
  }, []);


  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      prompt: '',
      tone: 'default', // Use 'default' value for SelectItems
      format: 'default', // Use 'default' value for SelectItems
      generationMode: 'ideas',
    },
  });

  // Update generationMode when tab changes
  useEffect(() => {
    form.setValue('generationMode', activeTab);
  }, [activeTab, form]);

  const onSubmit = async (formData) => {
    // Check login status and generation count
    if (!isLoggedIn && generationCount >= 1) {
      setShowLoginAlert(true);
      return; // Stop submission
    }

    setIsLoading(true);
    setError(null);
    setGenerationResult(null); // Clear previous result

     // Prepare data for the flow, converting "default" value back to undefined for optional fields
     const flowInput = {
        ...formData,
        tone: formData.tone === 'default' || formData.tone === '' ? undefined : formData.tone,
        format: formData.format === 'default' || formData.format === '' ? undefined : formData.format,
      };

    try {
      // Pass the modified flowInput to the Genkit flow
      const result = await generateContentIdeas(flowInput);

      // Check the structure of the result based on generationMode
       if (result) {
          setGenerationResult(result); // Store the entire result object
          // Increment generation count only on successful generation
          const newCount = generationCount + 1;
          setGenerationCount(newCount);
          if (typeof window !== 'undefined') {
              localStorage.setItem('generationCount', newCount.toString());
          }
       } else {
           setError('Failed to generate content. The AI returned an unexpected response.');
       }
    } catch (err) {
      console.error(`Error generating ${flowInput.generationMode}:`, err);
       setError(`An error occurred: ${err instanceof Error ? err.message : 'Unknown error'}. Please try again.`);
    } finally {
      setIsLoading(false);
    }
  };

   if (!isClient) {
     // Render skeleton or null during SSR/hydration
     return null; // Or a loading skeleton component
   }


  return (
    <div className="space-y-8">
      <section className="text-center pt-8 pb-4">
         <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-4 bg-gradient-to-r from-primary via-teal-400 to-teal-600 bg-clip-text text-transparent">
           AI Content Generation Suite
         </h1>
         <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto">
           Fuel your creativity! Generate content ideas, headlines, outlines, and more with the power of AI.
           {!isLoggedIn && <span className="text-sm block text-primary mt-1">(First generation is free! Login for unlimited access.)</span>}
         </p>
      </section>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-3 md:max-w-lg mx-auto"> {/* Changed to grid-cols-3 */}
          <TabsTrigger value="ideas"> <Lightbulb className="mr-2 h-4 w-4" /> Ideas</TabsTrigger>
          <TabsTrigger value="headlines"> <Sparkles className="mr-2 h-4 w-4" /> Headlines</TabsTrigger>
          <TabsTrigger value="outline"> <FileText className="mr-2 h-4 w-4" /> Outlines</TabsTrigger> {/* Added Outlines tab */}
        </TabsList>

        {/* Shared Form Card */}
         <Card className="mt-6">
            <CardHeader>
              <CardTitle className="flex items-center gap-2"> <Bot className="h-6 w-6 text-primary"/> Content Generator</CardTitle>
              <CardDescription>Describe your topic and select desired options below.</CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                  <FormField
                    control={form.control}
                    name="prompt"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Your Core Topic / Prompt</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="e.g., 'sustainable living tips for beginners', 'unique video ideas for a cooking channel', 'benefits of AI in marketing'"
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

                  {/* Optional Inputs: Tone and Format */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                     <FormField
                       control={form.control}
                       name="tone"
                       render={({ field }) => (
                         <FormItem>
                           <FormLabel>Desired Tone (Optional)</FormLabel>
                           <Select onValueChange={field.onChange} value={field.value || 'default'} disabled={isLoading}>
                             <FormControl>
                               <SelectTrigger>
                                 <SelectValue placeholder="Select a tone" />
                               </SelectTrigger>
                             </FormControl>
                             <SelectContent>
                                <SelectItem value="default">Any / Default</SelectItem> {/* Ensure value is not empty */}
                                <SelectItem value="Formal">Formal</SelectItem>
                                <SelectItem value="Casual">Casual</SelectItem>
                                <SelectItem value="Humorous">Humorous</SelectItem>
                                <SelectItem value="Professional">Professional</SelectItem>
                                <SelectItem value="Enthusiastic">Enthusiastic</SelectItem>
                                <SelectItem value="Informative">Informative</SelectItem>
                             </SelectContent>
                           </Select>
                           <FormMessage />
                         </FormItem>
                       )}
                     />
                     <FormField
                       control={form.control}
                       name="format"
                       render={({ field }) => (
                         <FormItem>
                           <FormLabel>Desired Format (Optional)</FormLabel>
                           <Select onValueChange={field.onChange} value={field.value || 'default'} disabled={isLoading}>
                             <FormControl>
                               <SelectTrigger>
                                 <SelectValue placeholder="Select a format" />
                               </SelectTrigger>
                             </FormControl>
                             <SelectContent>
                               <SelectItem value="default">Any / General</SelectItem> {/* Ensure value is not empty */}
                               <SelectItem value="Blog Post">Blog Post</SelectItem>
                               <SelectItem value="Video Script">Video Script</SelectItem>
                               <SelectItem value="Tweet">Tweet</SelectItem>
                               <SelectItem value="LinkedIn Post">LinkedIn Post</SelectItem>
                               <SelectItem value="Email Newsletter">Email Newsletter</SelectItem>
                               <SelectItem value="Presentation Outline">Presentation Outline</SelectItem>
                             </SelectContent>
                           </Select>
                           <FormMessage />
                         </FormItem>
                       )}
                     />
                  </div>

                  {/* Hidden field for generationMode - value set by Tabs */}
                   <FormField control={form.control} name="generationMode" render={({ field }) => <input type="hidden" {...field} />} />


                  <Button type="submit" disabled={isLoading} className="w-full md:w-auto">
                    {isLoading ? (
                       <> <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Generating {activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}... </>
                    ) : `Generate ${activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}`}
                     {!isLoggedIn && generationCount >= 1 && <span className="ml-2 text-xs">(Login Required)</span>}
                  </Button>
                </form>
              </Form>
            </CardContent>
          </Card>


        {/* Content area for results - shown below the form card */}
        <div className="mt-8">
            {error && (
             <Alert variant="destructive" className="mb-6">
               <Terminal className="h-4 w-4" />
               <AlertTitle>Error</AlertTitle>
               <AlertDescription>{error}</AlertDescription>
             </Alert>
           )}

          {(isLoading || generationResult) && (
            <Card>
              <CardHeader>
                <CardTitle>Generated {activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}</CardTitle>
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
                   generationResult && (
                     // Display logic based on the active tab / result structure
                     <TabsContent value={activeTab} forceMount={true}> {/* Use forceMount to ensure content renders immediately */}
                       {activeTab === 'ideas' && generationResult.ideas && (
                         <ul className="list-disc space-y-2 pl-5 text-foreground/90">
                           {generationResult.ideas.map((idea, index) => (
                             <li key={index}>{idea}</li>
                           ))}
                         </ul>
                       )}
                       {activeTab === 'headlines' && generationResult.headlines && (
                         <ul className="list-decimal space-y-2 pl-5 text-foreground/90">
                           {generationResult.headlines.map((headline, index) => (
                             <li key={index}>{headline}</li>
                           ))}
                         </ul>
                       )}
                        {/* Added rendering for outlines */}
                       {activeTab === 'outline' && generationResult.outline && (
                         <ol className="list-decimal space-y-2 pl-5 text-foreground/90">
                           {generationResult.outline.map((point, index) => (
                             <li key={index}>{point}</li>
                           ))}
                         </ol>
                       )}

                         {/* Fallback if result structure doesn't match expected */}
                         {activeTab === 'ideas' && !generationResult.ideas && <p className="text-foreground/60">No ideas generated or unexpected format received.</p>}
                         {activeTab === 'headlines' && !generationResult.headlines && <p className="text-foreground/60">No headlines generated or unexpected format received.</p>}
                         {activeTab === 'outline' && !generationResult.outline && <p className="text-foreground/60">No outline generated or unexpected format received.</p>}
                     </TabsContent>
                   )
                )}
                {!isLoading && !generationResult && !error && <p className="text-foreground/60">Enter a prompt and click Generate.</p>}
              </CardContent>
            </Card>
          )}
         </div>
      </Tabs>


       {/* Login Required Alert Dialog */}
       <AlertDialog open={showLoginAlert} onOpenChange={setShowLoginAlert}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle className="flex items-center gap-2"> <LogIn className="h-5 w-5"/> Login Required</AlertDialogTitle>
              <AlertDialogDescription>
                You've used your free generation. Please log in or sign up to continue generating unlimited content.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={() => router.push('/auth')}>Login / Sign Up</AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>

    </div>
  );
}
