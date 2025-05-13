
'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { generateContentIdeas } from '@/ai/flows/generate-content-ideas';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Terminal, LogIn, Lightbulb, Sparkles, Bot, Loader2, FileText, Zap, LayoutList, CheckCircle } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useRouter } from 'next/navigation';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const formSchema = z.object({
  prompt: z.string().min(10, { message: 'Prompt must be at least 10 characters long.' }).max(500, { message: 'Prompt cannot exceed 500 characters.' }),
  tone: z.string().optional(),
  format: z.string().optional(),
  generationMode: z.string().default('ideas'),
});

const FeatureHighlightCard = ({ icon: Icon, title, description }) => (
  <Card className="bg-card/60 border-border/50">
    <CardHeader className="flex flex-row items-center gap-3 pb-3">
      <Icon className="h-6 w-6 text-primary" />
      <CardTitle className="text-lg">{title}</CardTitle>
    </CardHeader>
    <CardContent>
      <p className="text-sm text-muted-foreground">{description}</p>
    </CardContent>
  </Card>
);

export default function GeneratePage() {
  const [generationResult, setGenerationResult] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isClient, setIsClient] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [generationCount, setGenerationCount] = useState(0);
  const [showLoginAlert, setShowLoginAlert] = useState(false);
  const [activeTab, setActiveTab] = useState('ideas');
  const router = useRouter();

  useEffect(() => {
    setIsClient(true);
    const token = localStorage.getItem('token');
    setIsLoggedIn(!!token);
    const storedCount = localStorage.getItem('generationCount');
    if (storedCount) {
      setGenerationCount(parseInt(storedCount, 10));
    }
  }, []);

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      prompt: '',
      tone: 'default',
      format: 'default',
      generationMode: 'ideas',
    },
  });

  useEffect(() => {
    form.setValue('generationMode', activeTab);
  }, [activeTab, form]);

  const onSubmit = async (formData) => {
    if (!isLoggedIn && generationCount >= 1) {
      setShowLoginAlert(true);
      return;
    }

    setIsLoading(true);
    setError(null);
    setGenerationResult(null);

    const flowInput = {
      ...formData,
      tone: formData.tone === 'default' ? undefined : formData.tone,
      format: formData.format === 'default' ? undefined : formData.format,
    };

    try {
      const result = await generateContentIdeas(flowInput);
      if (result) {
        setGenerationResult(result);
        if(!isLoggedIn) {
          const newCount = generationCount + 1;
          setGenerationCount(newCount);
          if (typeof window !== 'undefined') {
            localStorage.setItem('generationCount', newCount.toString());
          }
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
    return (
      <div className="space-y-8 py-8">
        <section className="text-center pt-8 pb-4">
          <Skeleton className="h-12 w-3/4 mx-auto mb-4" />
          <Skeleton className="h-6 w-1/2 mx-auto" />
        </section>
        <Skeleton className="h-10 w-full md:max-w-lg mx-auto" />
        <Card className="mt-6">
          <CardHeader><Skeleton className="h-8 w-1/3 mb-2" /><Skeleton className="h-4 w-2/3" /></CardHeader>
          <CardContent className="space-y-6">
            <Skeleton className="h-20 w-full" />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Skeleton className="h-10 w-full" /> <Skeleton className="h-10 w-full" />
            </div>
            <Skeleton className="h-10 w-full md:w-1/4" />
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-12 md:space-y-16 animate-fade-in">
      <section className="text-center py-12 md:py-16 bg-gradient-to-b from-background via-primary/5 to-background animate-fade-in">
        <div className="container mx-auto px-4">
          <Zap className="h-16 w-16 text-primary mx-auto mb-6 animate-fade-in" style={{ animationDelay: '0.2s' }} />
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-6 animate-fade-in" style={{ animationDelay: '0.4s' }}>
            AI Content Supercharger
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto mb-8 animate-fade-in" style={{ animationDelay: '0.6s' }}>
            Stuck in a creative rut? Let Wcontent's AI be your brainstorming partner. Generate unique ideas, craft irresistible headlines, and structure perfect outlines in seconds.
          </p>
          {!isLoggedIn && (
            <p className="text-sm text-primary animate-fade-in" style={{ animationDelay: '0.8s' }}>
              Your first generation is on us! Login for unlimited creative power.
            </p>
          )}
        </div>
      </section>

      <section className="container mx-auto px-4 animate-fade-in" style={{ animationDelay: '0.8s' }}>
        <div className="grid md:grid-cols-3 gap-6 mb-12">
          <FeatureHighlightCard
            icon={Lightbulb}
            title="Spark Ideas Instantly"
            description="Transform a simple topic into a list of engaging and unique content ideas. Perfect for videos, blogs, and social media."
          />
          <FeatureHighlightCard
            icon={Sparkles}
            title="Craft Catchy Headlines"
            description="Generate attention-grabbing headlines designed to boost clicks and engagement for your content."
          />
          <FeatureHighlightCard
            icon={LayoutList}
            title="Build Solid Outlines"
            description="Quickly create structured outlines for your articles, scripts, or presentations, ensuring a logical flow."
          />
        </div>
      </section>

      <section className="container mx-auto px-4 animate-fade-in" style={{ animationDelay: '1s' }}>
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-3 md:max-w-xl mx-auto mb-8 shadow-sm border border-border">
            <TabsTrigger value="ideas" className="py-2.5 data-[state=active]:bg-primary/10 data-[state=active]:text-primary data-[state=active]:font-semibold">
              <Lightbulb className="mr-2 h-4 w-4" /> Ideas
            </TabsTrigger>
            <TabsTrigger value="headlines" className="py-2.5 data-[state=active]:bg-primary/10 data-[state=active]:text-primary data-[state=active]:font-semibold">
              <Sparkles className="mr-2 h-4 w-4" /> Headlines
            </TabsTrigger>
            <TabsTrigger value="outline" className="py-2.5 data-[state=active]:bg-primary/10 data-[state=active]:text-primary data-[state=active]:font-semibold">
              <FileText className="mr-2 h-4 w-4" /> Outlines
            </TabsTrigger>
          </TabsList>

          <Card className="shadow-xl border border-border/50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-2xl">
                <Bot className="h-7 w-7 text-primary"/> AI Content Generator
              </CardTitle>
              <CardDescription>
                Enter your core topic and let our AI assist you in generating creative content {activeTab}.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                  <FormField
                    control={form.control}
                    name="prompt"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-base">Core Topic or Prompt</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="e.g., 'Next-gen sustainable tech', 'Unusual travel destinations for foodies', 'How to start a successful podcast'"
                            className="resize-none text-base"
                            rows={4}
                            {...field}
                            disabled={isLoading}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField
                      control={form.control}
                      name="tone"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Desired Tone (Optional)</FormLabel>
                          <Select onValueChange={field.onChange} value={field.value || 'default'} disabled={isLoading}>
                            <FormControl><SelectTrigger><SelectValue placeholder="Select a tone" /></SelectTrigger></FormControl>
                            <SelectContent>
                              <SelectItem value="default">Any / Default</SelectItem>
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
                            <FormControl><SelectTrigger><SelectValue placeholder="Select a format" /></SelectTrigger></FormControl>
                            <SelectContent>
                              <SelectItem value="default">Any / General</SelectItem>
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
                  <FormField control={form.control} name="generationMode" render={({ field }) => <input type="hidden" {...field} />} />
                  <Button type="submit" disabled={isLoading} size="lg" className="w-full md:w-auto text-base py-3">
                    {isLoading ? (
                      <><Loader2 className="mr-2 h-5 w-5 animate-spin" /> Generating {activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}...</>
                    ) : (
                      <><Sparkles className="mr-2 h-5 w-5" /> Generate {activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}</>
                    )}
                    {!isLoggedIn && generationCount >= 1 && <span className="ml-2 text-xs">(Login Required)</span>}
                  </Button>
                </form>
              </Form>
            </CardContent>
          </Card>
        </Tabs>
      </section>

      <section className="container mx-auto px-4 pb-12 md:pb-16">
        {isLoading && (
          <Card className="mt-8 shadow-lg animate-pulse">
            <CardHeader><CardTitle>Generating...</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              {[...Array(4)].map((_, i) => <Skeleton key={i} className="h-6 w-full" style={{ width: `${80 - i * 5}%`}} />)}
            </CardContent>
          </Card>
        )}

        {error && (
          <Alert variant="destructive" className="mt-8">
            <Terminal className="h-4 w-4" />
            <AlertTitle>Generation Error</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {!isLoading && generationResult && (
          <Card className="mt-10 shadow-2xl border-2 border-primary/30 animate-fade-in">
            <CardHeader className="bg-primary/5">
              <CardTitle className="text-2xl flex items-center gap-2">
                <CheckCircle className="h-7 w-7 text-primary"/> AI Generated {activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}
              </CardTitle>
              <CardDescription>Here's what our AI came up with based on your prompt.</CardDescription>
            </CardHeader>
            <CardContent className="pt-6 text-base">
              {activeTab === 'ideas' && generationResult.ideas && (
                <ul className="list-disc space-y-3 pl-6 text-foreground/90">
                  {generationResult.ideas.map((idea, index) => <li key={index} className="leading-relaxed">{idea}</li>)}
                </ul>
              )}
              {activeTab === 'headlines' && generationResult.headlines && (
                <ol className="list-decimal space-y-3 pl-6 text-foreground/90">
                  {generationResult.headlines.map((headline, index) => <li key={index} className="leading-relaxed">{headline}</li>)}
                </ol>
              )}
              {activeTab === 'outline' && generationResult.outline && (
                <ol className="list-decimal space-y-3 pl-6 text-foreground/90">
                  {generationResult.outline.map((point, index) => <li key={index} className="leading-relaxed">{point}</li>)}
                </ol>
              )}
              {activeTab === 'ideas' && !generationResult.ideas && <p className="text-muted-foreground">No ideas generated or unexpected format received.</p>}
              {activeTab === 'headlines' && !generationResult.headlines && <p className="text-muted-foreground">No headlines generated or unexpected format received.</p>}
              {activeTab === 'outline' && !generationResult.outline && <p className="text-muted-foreground">No outline generated or unexpected format received.</p>}
            </CardContent>
            <CardFooter>
              <p className="text-xs text-muted-foreground">Remember to review and refine AI-generated content to match your unique voice and style.</p>
            </CardFooter>
          </Card>
        )}
         {!isLoading && !generationResult && !error &&
           <div className="text-center py-10 mt-8 border-2 border-dashed border-border/50 rounded-lg bg-card/30">
             <Bot className="h-12 w-12 text-muted-foreground mx-auto mb-4"/>
             <p className="text-muted-foreground">Your AI-generated content will appear here.</p>
             <p className="text-xs text-muted-foreground">Enter a prompt above to get started!</p>
           </div>
         }
      </section>

      <AlertDialog open={showLoginAlert} onOpenChange={setShowLoginAlert}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2"><LogIn className="h-5 w-5"/> Login Required</AlertDialogTitle>
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
