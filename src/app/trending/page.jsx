'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter, DialogClose } from '@/components/ui/dialog';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Skeleton } from '@/components/ui/skeleton';
import { Flame, TrendingUp, Search, ArrowRight, Lightbulb, Bot, Video, Mic, BarChart as BarChartIcon, Check, LogIn, Sparkles } from 'lucide-react';
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
import { Label } from '@/components/ui/label';
import { Bar, CartesianGrid, XAxis, YAxis, BarChart as RechartsBarChart, Tooltip as RechartsTooltip, Legend, ResponsiveContainer } from 'recharts';

const dummyTrends = [
  {
    id: 1,
    title: 'The "One Thing" Daily Vlog Format',
    category: 'Lifestyle',
    hotness: 5,
    description: "A short, daily vlog focusing on accomplishing or highlighting just one single, interesting thing from your day. It's concise, engaging, and easy to produce.",
    image: 'https://picsum.photos/seed/trend1/400/200',
    details: 'This trend leverages short attention spans by delivering a focused narrative. Instead of a sprawling "day in the life," creators isolate a single compelling moment, skill, or experience. It works great on TikTok, Reels, and YouTube Shorts.',
    aiSteps: [
      {
        title: 'Step 1: AI-Powered Script & Outline',
        content: "Our AI suggests a simple 3-part structure: \n1. **Hook:** State the 'one thing' you'll do (e.g., 'Today, I'm finally trying to bake sourdough.').\n2. **Process:** Show quick, dynamic clips of you doing the thing.\n3. **Payoff & CTA:** Show the result and ask a question (e.g., 'It was a success! What's one thing you've been wanting to try?')."
      },
      {
        title: 'Step 2: Visuals & Audio',
        content: "Use fast cuts and a trending, upbeat audio track. The AI suggests searching for 'upbeat lo-fi' or 'acoustic chill pop' on royalty-free music sites. Keep clips under 3 seconds each."
      },
      {
        title: 'Step 3: AI-Generated Titles & Tags',
        content: "Suggested Titles: \n- My 'One Thing' Today: [Your Activity]\n- Finally Tried [Your Activity]... Here's What Happened\n- Conquering My Goal for the Day\n\nSuggested Tags: #onething, #dailyvlog, #productivity, #[yourniche]"
      }
    ]
  },
  {
    id: 2,
    title: 'Unboxing... But with a Story',
    category: 'Tech',
    hotness: 4,
    description: 'Go beyond the standard tech unboxing. Weave a narrative around why you need the product or the problem it solves for you.',
    image: 'https://picsum.photos/seed/trend2/400/200',
    details: 'Viewers are tired of sterile unboxings. This trend adds a human element, making the product more relatable. It focuses on the "why" behind the purchase, not just the "what."',
    aiSteps: [
       {
        title: 'Step 1: AI-Powered Script & Outline',
        content: "Structure: \n1. **Problem:** Start by showing the problem you're facing (e.g., 'My old laptop is so slow for video editing...').\n2. **Introduction:** Introduce the new product as the solution.\n3. **Unboxing & Setup:** Show key moments of unboxing and your initial reactions. \n4. **Resolution:** Show the product solving your initial problem (e.g., 'Wow, rendering is so much faster!')."
      },
      {
        title: 'Step 2: Visuals & Audio',
        content: "Focus on close-up shots of the product and your genuine reactions. Use subtle background music that matches the tone of your story."
      },
      {
        title: 'Step 3: AI-Generated Titles & Tags',
        content: "Suggested Titles: \n- The Real Reason I Bought the New [Product Name]\n- Solving My Biggest Problem with the [Product Name]\n- [Product Name] Unboxing: A Creator's Lifesaver?\n\nSuggested Tags: #unboxing, #[productname], #[brand], #techreview, #creatorlife"
      }
    ]
  },
  {
    id: 3,
    title: 'Historical Deep Dives (Gaming)',
    category: 'Gaming',
    hotness: 4,
    description: 'Explore the development history, cut content, or real-world inspirations behind popular video games.',
    image: 'https://picsum.photos/seed/trend3/400/200',
    details: 'This long-form content appeals to dedicated fans and showcases your deep knowledge of the subject. It combines gameplay with research and storytelling.',
    aiSteps: [
      {
        title: 'Step 1: AI-Powered Research & Outline',
        content: "Our AI can help you find initial research sources and structure your video. \n1. **Intro:** Hook with a surprising fact about the game.\n2. **Chapter 1: The Concept:** Discuss the initial idea. \n3. **Chapter 2: Development Hell:** Detail the challenges. \n4. **Chapter 3: The Final Product:** Compare it to the original vision. \n5. **Legacy:** Discuss its impact."
      },
      {
        title: 'Step 2: Visuals & Audio',
        content: "Mix gameplay footage with archival screenshots, developer interviews, and concept art. A clear voiceover is crucial."
      },
      {
        title: 'Step 3: AI-Generated Titles & Tags',
        content: "Suggested Titles: \n- The Unseen History of [Game Name]\n- What You Never Knew About [Game Name]'s Development\n- The Full Story Behind [Game Name]\n\nSuggested Tags: #gamedocumentary, #gaminghistory, #[gamename], #retro"
      }
    ]
  },
  {
    id: 4,
    title: '"Silent" Cooking Tutorials',
    category: 'Food',
    hotness: 5,
    description: 'ASMR-style cooking videos with no talking, just the sounds of cooking, paired with clear on-screen instructions.',
    image: 'https://picsum.photos/seed/trend4/400/200',
    details: 'This relaxing and visually satisfying format is popular on Reels and TikTok. The focus is on high-quality audio and crisp visuals to make the food the star.',
    aiSteps: [
      {
        title: 'Step 1: AI-Powered Shot List',
        content: 'AI suggests this shot list for clarity:\n1. Wide shot of all ingredients.\n2. Close-up on chopping/mixing (focus on sound).\n3. Overhead shot of cooking process (pan/pot).\n4. "Beauty shot" of the final plated dish.'
      },
      {
        title: 'Step 2: Audio & Text',
        content: 'Use a high-quality microphone to capture cooking sounds (sizzling, chopping). Use clean, bold text overlays for ingredients and steps. Keep text on screen long enough to be read.'
      },
      {
        title: 'Step 3: AI-Generated Titles & Tags',
        content: "Suggested Titles: \n- Just vibes and [Dish Name]\n- The only [Dish Name] recipe you need\n- Cooking [Dish Name] ASMR\n\nSuggested Tags: #asmrcooking, #silentvlog, #[dishname], #easyrecipe"
      }
    ]
  },
];

const categories = ['All', ...new Set(dummyTrends.map(t => t.category))];

const TrendCard = ({ trend, onClick }) => (
  <Card className="flex flex-col hover:shadow-xl transition-shadow duration-300 cursor-pointer animate-fade-in" onClick={() => onClick(trend)}>
    <CardHeader className="p-0">
      <Image
        src={trend.image}
        alt={trend.title}
        width={400}
        height={200}
        className="rounded-t-lg object-cover w-full h-40"
        data-ai-hint={`${trend.category.toLowerCase()} content creation`}
      />
    </CardHeader>
    <CardContent className="p-4 flex-grow">
      <div className="flex justify-between items-start mb-2">
        <Badge variant="secondary">{trend.category}</Badge>
        <div className="flex items-center gap-1" title={`${trend.hotness}/5 Hotness`}>
          {[...Array(trend.hotness)].map((_, i) => <Flame key={i} className="h-4 w-4 text-primary fill-primary" />)}
          {[...Array(5 - trend.hotness)].map((_, i) => <Flame key={i} className="h-4 w-4 text-muted-foreground/30" />)}
        </div>
      </div>
      <h3 className="font-semibold text-lg line-clamp-2">{trend.title}</h3>
      <p className="text-sm text-muted-foreground mt-1 line-clamp-3">{trend.description}</p>
    </CardContent>
    <CardFooter className="p-4 pt-0">
        <Button variant="outline" className="w-full">
            View Trend & Get Help <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
    </CardFooter>
  </Card>
);


export default function TrendingPage() {
  const [filteredTrends, setFilteredTrends] = useState(dummyTrends);
  const [activeCategory, setActiveCategory] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTrend, setSelectedTrend] = useState(null);
  const [isHelpModal, setIsHelpModal] = useState(false);

  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isClient, setIsClient] = useState(false);
  const [showLoginAlert, setShowLoginAlert] = useState(false);
  const router = useRouter();

  // For simulated growth prediction
  const [growthLoading, setGrowthLoading] = useState(false);
  const [growthPrediction, setGrowthPrediction] = useState(null);
  
  useEffect(() => {
    setIsClient(true);
    const token = localStorage.getItem('token');
    setIsLoggedIn(!!token);
  }, []);

  useEffect(() => {
    let trends = dummyTrends;
    if (activeCategory !== 'All') {
      trends = trends.filter(t => t.category === activeCategory);
    }
    if (searchTerm) {
      trends = trends.filter(t => t.title.toLowerCase().includes(searchTerm.toLowerCase()) || t.description.toLowerCase().includes(searchTerm.toLowerCase()));
    }
    setFilteredTrends(trends);
  }, [activeCategory, searchTerm]);

  const handleCardClick = (trend) => {
    if (!isLoggedIn) {
        setShowLoginAlert(true);
    } else {
        setSelectedTrend(trend);
        setIsHelpModal(false); // Reset to details view first
        setGrowthPrediction(null); // Reset prediction
    }
  };
  
  const handleSimulateGrowth = () => {
      setGrowthLoading(true);
      setTimeout(() => {
          setGrowthPrediction({
              currentViews: Math.floor(Math.random() * 5000) + 1000,
              predictedViews: Math.floor(Math.random() * 8000) + 7000,
              growthPercentage: Math.floor(Math.random() * 150) + 50,
          });
          setGrowthLoading(false);
      }, 1500);
  };

  if (!isClient) {
    return (
        <div className="flex items-center justify-center min-h-screen">
            <h1 className="text-2xl">Loading Trends...</h1>
        </div>
    );
  }

  const growthChartData = growthPrediction ? [
      { name: 'Average Views', value: growthPrediction.currentViews },
      { name: 'Predicted Views', value: growthPrediction.predictedViews },
   ] : [];


  return (
    <div className="space-y-12 md:space-y-16 animate-fade-in">
        <section className="text-center py-12 md:py-16 bg-gradient-to-b from-background via-primary/5 to-background">
            <TrendingUp className="h-16 w-16 text-primary mx-auto mb-6" />
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-4">Stay Ahead of the Curve</h1>
            <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto">
                Discover the hottest content trends and get AI-powered help to create them. Stop guessing, start creating what's next.
            </p>
        </section>

        <section className="container mx-auto px-4">
            <div className="flex flex-col md:flex-row gap-4 mb-8 justify-center items-center">
                <div className="relative w-full md:w-1/2 lg:w-1/3">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                    <Input 
                        placeholder="Search trends..." 
                        className="pl-10 py-3 text-base"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                <div className="flex gap-2 overflow-x-auto pb-2">
                    {categories.map(category => (
                        <Button 
                            key={category}
                            variant={activeCategory === category ? 'default' : 'outline'}
                            onClick={() => setActiveCategory(category)}
                            className="shrink-0"
                        >
                            {category}
                        </Button>
                    ))}
                </div>
            </div>

            {filteredTrends.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {filteredTrends.map(trend => <TrendCard key={trend.id} trend={trend} onClick={handleCardClick} />)}
                </div>
            ) : (
                <Card className="text-center py-12 border-dashed bg-card/50">
                    <CardContent className="flex flex-col items-center gap-3">
                        <Search className="h-12 w-12 text-muted-foreground" />
                        <p className="text-lg text-muted-foreground">No trends match your criteria.</p>
                        <p className="text-sm text-muted-foreground">Try a different category or search term.</p>
                    </CardContent>
                </Card>
            )}
        </section>

        <Dialog open={!!selectedTrend} onOpenChange={() => setSelectedTrend(null)}>
            <DialogContent className="sm:max-w-2xl max-h-[90vh] flex flex-col">
                <DialogHeader>
                    <DialogTitle className="text-2xl">{selectedTrend?.title}</DialogTitle>
                    <DialogDescription>
                        {selectedTrend?.description}
                    </DialogDescription>
                </DialogHeader>

                {!isHelpModal ? (
                    <>
                        <div className="py-4 flex-grow overflow-y-auto pr-6 -mr-6">
                            <h3 className="font-semibold text-lg mb-2">Trend Breakdown</h3>
                            <p className="text-sm text-muted-foreground">{selectedTrend?.details}</p>
                        </div>
                        <DialogFooter className="mt-auto border-t pt-4">
                           <DialogClose asChild><Button type="button" variant="outline">Close</Button></DialogClose>
                           <Button onClick={() => setIsHelpModal(true)}>
                             <Sparkles className="mr-2 h-4 w-4" /> Help Me Create This
                           </Button>
                        </DialogFooter>
                    </>
                ) : (
                    <div className="flex-grow overflow-y-auto pr-6 -mr-6">
                        <h3 className="font-semibold text-lg mb-2 flex items-center gap-2"><Bot className="h-5 w-5 text-primary" /> AI Creation Assistant</h3>
                        <Accordion type="single" collapsible className="w-full" defaultValue="item-0">
                           {selectedTrend?.aiSteps.map((step, index) => (
                              <AccordionItem key={index} value={`item-${index}`}>
                                <AccordionTrigger>{step.title}</AccordionTrigger>
                                <AccordionContent className="whitespace-pre-wrap text-sm text-muted-foreground">{step.content}</AccordionContent>
                              </AccordionItem>
                           ))}
                        </Accordion>
                        
                        <div className="mt-6">
                            <h3 className="font-semibold text-lg mb-2 flex items-center gap-2"><BarChartIcon className="h-5 w-5 text-primary" /> Potential Growth</h3>
                            {!growthPrediction ? (
                                <div className="p-4 border border-dashed rounded-md text-center">
                                    <p className="text-sm text-muted-foreground mb-2">Simulate how this trend could impact your channel's views.</p>
                                    <Label htmlFor="youtube-handle" className="sr-only">YouTube Handle</Label>
                                    <Input id="youtube-handle" placeholder="@YourHandle (optional)" className="mb-2 max-w-xs mx-auto" />
                                    <Button onClick={handleSimulateGrowth} disabled={growthLoading}>
                                       {growthLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                       Forecast Potential Views
                                    </Button>
                                </div>
                            ) : (
                                <Card>
                                    <CardContent className="pt-6">
                                        <p className="text-center text-sm mb-2 text-muted-foreground">Based on your channel, creating this content could increase average views by up to <strong className="text-primary">{growthPrediction.growthPercentage}%</strong>.</p>
                                        <div className="h-[200px]">
                                            <ResponsiveContainer width="100%" height="100%">
                                                <RechartsBarChart data={growthChartData} margin={{ top: 5, right: 0, left: -20, bottom: 5 }}>
                                                    <CartesianGrid strokeDasharray="3 3" />
                                                    <XAxis dataKey="name" fontSize={12} />
                                                    <YAxis fontSize={12} />
                                                    <RechartsTooltip contentStyle={{backgroundColor: 'hsl(var(--background))', border: '1px solid hsl(var(--border))'}}/>
                                                    <Bar dataKey="value" fill="hsl(var(--primary))" name="Views" radius={[4, 4, 0, 0]} />
                                                </RechartsBarChart>
                                            </ResponsiveContainer>
                                        </div>
                                        <p className="text-xs text-center text-muted-foreground mt-1">*This is a simulation. Actual results may vary.</p>
                                    </CardContent>
                                </Card>
                            )}
                        </div>
                    </div>
                     <DialogFooter className="mt-auto border-t pt-4">
                           <Button type="button" variant="outline" onClick={() => setIsHelpModal(false)}>Back to Details</Button>
                           <DialogClose asChild><Button>Done</Button></DialogClose>
                     </DialogFooter>
                )}
            </DialogContent>
        </Dialog>
        
        <AlertDialog open={showLoginAlert} onOpenChange={setShowLoginAlert}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle className="flex items-center gap-2"><LogIn className="h-5 w-5"/> Login Required</AlertDialogTitle>
              <AlertDialogDescription>
                You need to be logged in to use the AI Creation Assistant for trends.
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
