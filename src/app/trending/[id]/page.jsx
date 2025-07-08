
'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { dummyTrends } from '@/app/trending/trend-data';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Skeleton } from '@/components/ui/skeleton';
import { Flame, ArrowLeft, Bot, Sparkles, Loader2, BarChart as BarChartIcon, Video } from 'lucide-react';
import { Label } from '@/components/ui/label';
import { Bar, CartesianGrid, XAxis, YAxis, BarChart as RechartsBarChart, Tooltip as RechartsTooltip, ResponsiveContainer } from 'recharts';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";

export default function TrendDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [trend, setTrend] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showLoginAlert, setShowLoginAlert] = useState(false);

  // For simulated growth prediction
  const [growthLoading, setGrowthLoading] = useState(false);
  const [growthPrediction, setGrowthPrediction] = useState(null);

  useEffect(() => {
    // Check login status on mount
    const token = localStorage.getItem('token');
    setIsLoggedIn(!!token);

    // Simulate fetching trend data
    if (params.id) {
      const foundTrend = dummyTrends.find(t => t.id.toString() === params.id);
      setTimeout(() => {
        setTrend(foundTrend);
        setIsLoading(false);
      }, 300);
    }
  }, [params.id]);

  const handleSimulateGrowth = () => {
    if (!isLoggedIn) {
        setShowLoginAlert(true);
        return;
    }
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
  
  const growthChartData = growthPrediction ? [
    { name: 'Average Views', value: growthPrediction.currentViews },
    { name: 'Predicted Views', value: growthPrediction.predictedViews },
  ] : [];

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-4xl space-y-6">
        <Skeleton className="h-8 w-40" />
        <Skeleton className="h-10 w-3/4" />
        <div className="flex gap-2"><Skeleton className="h-6 w-20" /><Skeleton className="h-6 w-24" /></div>
        <Skeleton className="h-60 w-full" />
        <Skeleton className="h-20 w-full" />
        <Skeleton className="h-40 w-full" />
      </div>
    );
  }

  if (!trend) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <h1 className="text-2xl font-bold">Trend not found</h1>
        <p className="text-muted-foreground">The trend you are looking for does not exist.</p>
        <Button onClick={() => router.push('/trending')} className="mt-4">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Trends
        </Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl space-y-8 animate-fade-in">
        <Button onClick={() => router.push('/trending')} variant="outline" size="sm">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to All Trends
        </Button>
        
        <article>
            <header className="space-y-2 mb-6">
                <Badge variant="default">{trend.category}</Badge>
                <h1 className="text-3xl md:text-4xl font-bold tracking-tight">{trend.title}</h1>
                <div className="flex items-center gap-2 text-muted-foreground text-sm">
                    <span>Hotness:</span>
                    <div className="flex items-center gap-1" title={`${trend.hotness}/5 Hotness`}>
                        {[...Array(trend.hotness)].map((_, i) => <Flame key={i} className="h-4 w-4 text-orange-500 fill-orange-400" />)}
                        {[...Array(5 - trend.hotness)].map((_, i) => <Flame key={i} className="h-4 w-4 text-muted-foreground/20" />)}
                    </div>
                </div>
            </header>
            
            <div className="prose dark:prose-invert max-w-none text-lg text-foreground/90 leading-relaxed">
                <p>{trend.fullArticle}</p>
            </div>
        </article>

        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2"><Video className="h-6 w-6 text-primary"/> Trend in Action</CardTitle>
                <CardDescription>Here's an example of this trend to inspire you.</CardDescription>
            </CardHeader>
            <CardContent>
                <div className="aspect-video w-full rounded-lg overflow-hidden border">
                    <iframe
                        width="100%"
                        height="100%"
                        src={trend.exampleVideoUrl}
                        title="YouTube video player"
                        frameBorder="0"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen>
                    </iframe>
                </div>
            </CardContent>
        </Card>

        <Card className="bg-muted/30 border-primary/20">
            <CardHeader>
                <CardTitle className="flex items-center gap-2"><Bot className="h-6 w-6 text-primary" /> AI Creation Assistant</CardTitle>
                <CardDescription>Let our AI help you create content for this trend. Login to get started!</CardDescription>
            </CardHeader>
            <CardContent>
                <Accordion type="single" collapsible className="w-full" disabled={!isLoggedIn}>
                    {trend.aiSteps.map((step, index) => (
                      <AccordionItem key={index} value={`item-${index}`}>
                        <AccordionTrigger className="text-base font-semibold disabled:text-muted-foreground/50">
                           <Sparkles className="h-4 w-4 mr-2 text-primary shrink-0"/> {step.title}
                        </AccordionTrigger>
                        <AccordionContent className="whitespace-pre-wrap text-sm text-muted-foreground">{step.content}</AccordionContent>
                      </AccordionItem>
                    ))}
                </Accordion>
                {!isLoggedIn && 
                    <div className="mt-4 p-4 text-center border-dashed border rounded-md">
                        <p className="text-sm text-muted-foreground mb-2">You must be logged in to use the AI Assistant.</p>
                        <Button onClick={() => setShowLoginAlert(true)}>Login to Continue</Button>
                    </div>
                }
            </CardContent>
        </Card>

        <Card className="bg-muted/30">
            <CardHeader>
                <CardTitle className="flex items-center gap-2"><BarChartIcon className="h-6 w-6 text-primary"/> Potential Growth</CardTitle>
                <CardDescription>Simulate how this trend could impact your channel's views.</CardDescription>
            </CardHeader>
            <CardContent>
                {!growthPrediction ? (
                    <div className="p-4 border border-dashed rounded-md text-center">
                        <Label htmlFor="youtube-handle" className="sr-only">YouTube Handle</Label>
                        <Input id="youtube-handle" placeholder="@YourHandle (optional)" className="mb-2 max-w-xs mx-auto" disabled={!isLoggedIn}/>
                        <Button onClick={handleSimulateGrowth} disabled={growthLoading || !isLoggedIn}>
                           {growthLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                           Forecast Potential Views
                        </Button>
                         {!isLoggedIn && <p className="text-xs text-muted-foreground mt-2">Login to use the forecast tool.</p>}
                    </div>
                ) : (
                    <div>
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
                        <div className="text-center mt-2">
                          <Button variant="link" size="sm" onClick={handleSimulateGrowth}>Recalculate</Button>
                        </div>
                    </div>
                )}
            </CardContent>
        </Card>

        <AlertDialog open={showLoginAlert} onOpenChange={setShowLoginAlert}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Login Required</AlertDialogTitle>
              <AlertDialogDescription>
                You need to be logged in to use the AI Creation Assistant and Growth Forecast tools.
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
