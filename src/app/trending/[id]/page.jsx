
'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Skeleton } from '@/components/ui/skeleton';
import { Flame, ArrowLeft, Bot, Sparkles, Loader2, Lightbulb, UserCheck } from 'lucide-react';
import { Label } from '@/components/ui/label';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { fetchTrendDetails, analyzeChannelTrendFit } from '../actions';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';

export default function TrendDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [trend, setTrend] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showLoginAlert, setShowLoginAlert] = useState(false);

  // State for the new Trend-Channel Fit Analysis
  const [analysisLoading, setAnalysisLoading] = useState(false);
  const [analysisResult, setAnalysisResult] = useState(null);
  const [analysisError, setAnalysisError] = useState(null);
  const [userChannel, setUserChannel] = useState('');
  const [isChannelPrefilled, setIsChannelPrefilled] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const loggedIn = !!token;
    setIsLoggedIn(loggedIn);

    if (loggedIn) {
        const userId = localStorage.getItem("id");
        async function fetchUserChannel() {
            try {
                const res = await fetch(`https://wcontent-app-latest.onrender.com/api/users/getUser/${userId}`, { headers: { Authorization: `Bearer ${token}` }});
                if (res.ok) {
                    const userData = await res.json();
                    if (userData.userType === 'ChannelOwner' && (userData.channelId || userData.channelHandle)) {
                        setUserChannel(userData.channelId || userData.channelHandle || '');
                        setIsChannelPrefilled(true);
                    }
                }
            } catch (err) {
                console.error("Failed to fetch user channel info", err);
            }
        }
        fetchUserChannel();
    }


    if (params.id) {
        async function loadTrendDetails() {
            setIsLoading(true);
            setError(null);
            try {
                const trendData = await fetchTrendDetails(params.id);
                setTrend(trendData);
            } catch (err) {
                setError(err.message);
                setTrend(null);
            } finally {
                setIsLoading(false);
            }
        }
        loadTrendDetails();
    }
  }, [params.id]);

  const handleAnalyzeFit = async () => {
    if (!isLoggedIn) {
        setShowLoginAlert(true);
        return;
    }
    if (!userChannel) {
        setAnalysisError("Please provide your YouTube handle or Channel ID.");
        return;
    }

    setAnalysisLoading(true);
    setAnalysisError(null);
    setAnalysisResult(null);

    try {
        const result = await analyzeChannelTrendFit(userChannel, trend);
        if (result.success) {
            setAnalysisResult(result.analysis);
        }
    } catch (err) {
        setAnalysisError(err.message);
    } finally {
        setAnalysisLoading(false);
    }
  };
  
  const renderMarkdown = (text) => {
    // Basic markdown for bold and newlines
    const html = text
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/\n/g, '<br />');
    return { __html: html };
  };

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-4xl space-y-6">
        <Skeleton className="h-8 w-40" />
        <Skeleton className="h-10 w-3/4" />
        <div className="flex gap-2"><Skeleton className="h-6 w-20" /><Skeleton className="h-6 w-24" /></div>
        <Skeleton className="h-40 w-full" />
        <Skeleton className="h-40 w-full" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <h1 className="text-2xl font-bold text-destructive">Failed to Load Trend</h1>
        <p className="text-muted-foreground">{error}</p>
        <Button onClick={() => router.push('/trending')} className="mt-4">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Trends
        </Button>
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
            
            <div className="prose dark:prose-invert max-w-none text-lg text-foreground/90 leading-relaxed" dangerouslySetInnerHTML={renderMarkdown(trend.fullArticle)} />
        </article>

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
                <CardTitle className="flex items-center gap-2"><UserCheck className="h-6 w-6 text-primary"/> Trend-Channel Fit Analysis</CardTitle>
                <CardDescription>See how well this trend fits your channel's current content and audience.</CardDescription>
            </CardHeader>
            <CardContent>
                <div className="p-4 border border-dashed rounded-md space-y-4">
                    <div>
                        <Label htmlFor="youtube-handle" className="text-sm font-medium">Your YouTube Handle or Channel ID</Label>
                        <Input 
                            id="youtube-handle" 
                            placeholder="@YourHandle or Channel ID" 
                            value={userChannel}
                            onChange={(e) => setUserChannel(e.target.value)}
                            className="mt-1" 
                            disabled={!isLoggedIn || analysisLoading}
                        />
                         {isChannelPrefilled && <p className="text-xs text-muted-foreground mt-1">Your channel info has been pre-filled from your profile.</p>}
                    </div>
                    <Button onClick={handleAnalyzeFit} disabled={analysisLoading || !isLoggedIn || !userChannel}>
                       {analysisLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                       Analyze Fit
                    </Button>
                     {!isLoggedIn && <p className="text-xs text-muted-foreground mt-2">Login to use the analysis tool.</p>}
                </div>
                
                {analysisLoading && (
                    <div className="mt-4 space-y-3">
                        <Skeleton className="h-5 w-1/3" />
                        <Skeleton className="h-4 w-full" />
                        <Skeleton className="h-4 w-4/5" />
                    </div>
                )}
                
                {analysisError && (
                    <Alert variant="destructive" className="mt-4">
                        <AlertTitle>Error</AlertTitle>
                        <AlertDescription>{analysisError}</AlertDescription>
                    </Alert>
                )}

                {analysisResult && (
                     <div className="mt-4 p-4 border rounded-md bg-background">
                         <h4 className="font-semibold text-lg mb-2 flex items-center gap-2"><Lightbulb className="h-5 w-5 text-primary"/> Analysis Summary</h4>
                         <div className="prose prose-sm dark:prose-invert max-w-none text-foreground/90" dangerouslySetInnerHTML={renderMarkdown(analysisResult)} />
                     </div>
                )}
            </CardContent>
        </Card>

        <AlertDialog open={showLoginAlert} onOpenChange={setShowLoginAlert}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Login Required</AlertDialogTitle>
              <AlertDialogDescription>
                You need to be logged in to use the AI Creation Assistant and Analysis tools.
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
