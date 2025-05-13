'use client';

import React, { useState, useEffect } from "react";
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Terminal, Youtube, Lightbulb, Loader2, LogIn, Search, TrendingUp, DollarSign, Users, Video, Target, BarChart as BarChartIcon, HelpCircle, LineChart, UserCheck, Clock, Brain, CheckCircleIcon, ExternalLink, MapPin } from "lucide-react";
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
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Bar, CartesianGrid, XAxis, YAxis, BarChart as RechartsBarChart, Tooltip as RechartsTooltip, Legend, ResponsiveContainer } from 'recharts';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';


const PredictFeatureCard = ({ icon: Icon, title, description, img, hint, delay }) => (
   <Card className="flex flex-col overflow-hidden hover:shadow-xl transition-shadow duration-300 animate-fade-in border-border/50 bg-card/70" style={{ animationDelay: delay }}>
     <CardHeader>
       <Icon className="h-10 w-10 mb-3 text-primary" />
       <CardTitle className="text-xl">{title}</CardTitle>
       <CardDescription className="text-sm">{description}</CardDescription>
     </CardHeader>
     {img && (
        <CardContent className="flex-grow flex items-end mt-auto">
        <Image
            src={img}
            alt={title}
            data-ai-hint={hint}
            width={400}
            height={200}
            className="rounded-md object-cover w-full h-auto mt-4"
        />
        </CardContent>
     )}
   </Card>
 );

const YOUTUBE_API_KEY = process.env.NEXT_PUBLIC_YOUTUBE_API_KEY; 


export default function Ml() {
  const [url, setUrl] = useState("");
  const [summary, setSummary] = useState("");
  const [loading, setLoading] = useState(false);
  const [geminiLoading, setGeminiLoading] = useState(false);
  const [error, setError] = useState("");
  const [geminiResponse, setGeminiResponse] = useState("");
  const [isClient, setIsClient] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [predictionCount, setPredictionCount] = useState(0);
  const [showLoginAlert, setShowLoginAlert] = useState(false);
  const router = useRouter();

  const [audienceGrowthInputs, setAudienceGrowthInputs] = useState({
    platform: "youtube", // Default platform
    channelHandle: "",
    contentType: "",
    ideaDescription: "",
    uploadFrequency: "weekly",
    adSpend: "",
    targetAudienceAge: "",
    targetAudienceLocation: "",
    manualSubscribers: "",
    manualVideoCount: "",
  });
  const [channelStats, setChannelStats] = useState(null);
  const [growthRetentionPrediction, setGrowthRetentionPrediction] = useState(null);
  const [growthRetentionLoading, setGrowthRetentionLoading] = useState(false);
  const [growthRetentionError, setGrowthRetentionError] = useState("");


  useEffect(() => {
    setIsClient(true);
    const token = localStorage.getItem('token');
    const userChannelId = localStorage.getItem('channelId'); // Get channelId from localStorage
    setIsLoggedIn(!!token);
    if (token && userChannelId) {
      setAudienceGrowthInputs(prev => ({ ...prev, channelHandle: userChannelId }));
    }
    const storedCount = localStorage.getItem('predictionCount');
    if (storedCount) {
      setPredictionCount(parseInt(storedCount, 10));
    }
  }, []);

  const incrementPredictionCount = () => {
    const newCount = predictionCount + 1;
    setPredictionCount(newCount);
    if (typeof window !== 'undefined') {
        localStorage.setItem('predictionCount', newCount.toString());
    }
  };

  const checkPredictionLimit = () => {
    if (!isLoggedIn && predictionCount >= 1) {
      setShowLoginAlert(true);
      return true; 
    }
    return false; 
  };


  const isValidYouTubeUrl = (url) => {
    const pattern = /^(https?:\/\/)?(www\.)?(youtube\.com|youtu\.be)\/.+/;
    return pattern.test(url);
  };

  const handleAnalyze = async () => {
     if (checkPredictionLimit()) return;

    if (!isValidYouTubeUrl(url)) {
      setError("Please enter a valid YouTube URL");
      return;
    }
    setLoading(true);
    setError("");
    setSummary("");
    setGeminiResponse("");
    try {
      await new Promise(resolve => setTimeout(resolve, 1500));
      const placeholderSummary = `Placeholder summary for ${url}: Comments generally positive, mentioning good editing but some found the intro too long. Several users asked for a follow-up video on topic X.`;
      setSummary(placeholderSummary);
      if(!isLoggedIn) incrementPredictionCount();
    } catch (err) {
       const message = err instanceof Error ? err.message : "An error occurred during analysis";
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  const handleGeminiRequest = async () => {
     if (checkPredictionLimit() && !summary) return;

    if (!summary) {
      setError("Please analyze comments first.");
      return;
    }
    setGeminiLoading(true);
    setError("");
    setGeminiResponse("");
    try {
       await new Promise(resolve => setTimeout(resolve, 2000));
       const placeholderSuggestions = `Based on the summary:\n- Consider shortening the intro sequence.\n- Address the requests for a follow-up video on topic X in your next content plan.\n- Highlight the positive feedback on editing in your channel metrics.`;
       setGeminiResponse(placeholderSuggestions);
    } catch (err) {
       const message = err instanceof Error ? err.message : "Failed to fetch suggestions.";
      setError(message);
    } finally {
      setGeminiLoading(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const droppedUrl = e.dataTransfer.getData("text/plain");
    if (isValidYouTubeUrl(droppedUrl)) {
      setUrl(droppedUrl);
      setError("");
    } else {
      setError("Dropped item is not a valid YouTube URL");
    }
  };

  const handleAudienceGrowthInputChange = (e) => {
    const { name, value } = e.target;
    setAudienceGrowthInputs(prev => ({ ...prev, [name]: value }));
    setGrowthRetentionError("");
  };
  
  const fetchChannelIdByHandle = async (handle) => {
    const cleanHandle = handle.startsWith('@') ? handle.substring(1) : handle;
    const url = `https://www.googleapis.com/youtube/v3/channels?part=id&forHandle=${cleanHandle}&key=${YOUTUBE_API_KEY}`;
    try {
      const response = await fetch(url);
      const data = await response.json();
      if (data.items && data.items.length > 0) {
        return data.items[0].id;
      } else {
        // If handle lookup fails, try assuming it's an ID (basic check)
        if (cleanHandle.startsWith('UC') && cleanHandle.length > 20) return cleanHandle;
        throw new Error("Channel handle not found or invalid. Try using the Channel ID (starts with UC...).");
      }
    } catch (error) {
      console.error("Error fetching channel ID by handle:", error);
      throw error;
    }
  };

  const fetchChannelStatistics = async (channelId) => {
    const url = `https://www.googleapis.com/youtube/v3/channels?part=statistics,contentDetails,topicDetails&id=${channelId}&key=${YOUTUBE_API_KEY}`;
    try {
      const response = await fetch(url);
      const data = await response.json();
      if (data.items && data.items.length > 0) {
        return data.items[0];
      } else {
        throw new Error("Channel statistics not found. Ensure the Channel ID is correct.");
      }
    } catch (error) {
      console.error("Error fetching channel statistics:", error);
      throw error;
    }
  };
  
  const simulateGrowthAndRetention = (stats, inputs) => {
    const currentSubs = parseInt(stats.statistics.subscriberCount, 10) || parseInt(inputs.manualSubscribers, 10) || 0;
    const currentVideos = parseInt(stats.statistics.videoCount, 10) || parseInt(inputs.manualVideoCount, 10) || 0;
    const viewCount = stats.statistics?.viewCount ? parseInt(stats.statistics.viewCount, 10) : 0;
    
    let monthlyGrowthRate = 0.015 + (Math.random() * 0.025); // Base 1.5-4% monthly
    if (inputs.uploadFrequency === "daily") monthlyGrowthRate *= 1.3;
    if (inputs.uploadFrequency === "bi-weekly") monthlyGrowthRate *= 1.15;
    if (inputs.uploadFrequency === "monthly") monthlyGrowthRate *= 0.8;
    if (parseInt(inputs.adSpend, 10) > 50) monthlyGrowthRate *= (1 + (parseInt(inputs.adSpend, 10) / 2000)); // Ad spend boost

    const predictedSubscribersNextMonth = Math.floor(currentSubs * (1 + monthlyGrowthRate));
    const predictedSubscribersThreeMonths = Math.floor(currentSubs * Math.pow((1 + monthlyGrowthRate), 3));
    const predictedSubscribersSixMonths = Math.floor(currentSubs * Math.pow((1 + monthlyGrowthRate), 6));
    const predictedSubscribersOneYear = Math.floor(currentSubs * Math.pow((1 + monthlyGrowthRate), 12));


    let retentionFactors = [];
    if (inputs.contentType.toLowerCase().includes("tutorial") || inputs.ideaDescription.toLowerCase().includes("how to")) {
      retentionFactors.push("clear, step-by-step instructions");
    }
    if (stats.topicDetails?.topicCategories?.some(cat => cat.toLowerCase().includes(inputs.contentType.toLowerCase()))) {
      retentionFactors.push("alignment with channel's core topics");
    } else {
      retentionFactors.push("exploring new niches (monitor retention closely)");
    }
    retentionFactors.push("engaging intro and consistent value delivery");
    if(inputs.targetAudienceAge) retentionFactors.push(`targeting ${inputs.targetAudienceAge} age group`);
    if(inputs.targetAudienceLocation) retentionFactors.push(`focusing on ${inputs.targetAudienceLocation}`);


    let retentionOutlook = "Medium";
    if (retentionFactors.length >=3 && viewCount > 50000) retentionOutlook = "High";
    if (retentionFactors.length <=2 && currentVideos < 30) retentionOutlook = "Low to Medium";


    return {
      currentStats: {
        subscribers: currentSubs.toLocaleString(),
        videos: currentVideos.toLocaleString(),
        views: viewCount.toLocaleString(),
        topics: stats.topicDetails?.topicCategories?.map(tc => tc.split('/').pop().replace(/_/g, ' ')) || ["N/A"],
      },
      predictedGrowth: {
        nextMonth: predictedSubscribersNextMonth.toLocaleString(),
        threeMonths: predictedSubscribersThreeMonths.toLocaleString(),
        sixMonths: predictedSubscribersSixMonths.toLocaleString(),
        oneYear: predictedSubscribersOneYear.toLocaleString(),
      },
      predictedRetention: {
        outlook: retentionOutlook,
        keyFactors: retentionFactors,
        summary: `For content on "${inputs.contentType}" described as "${inputs.ideaDescription.substring(0,50)}...", focus on ${retentionFactors.join(', ')} to maximize audience retention. The outlook is currently ${retentionOutlook}.`
      },
      improvementTips: [
        `Consistently upload high-quality content related to "${inputs.contentType}" at your chosen frequency (${inputs.uploadFrequency}).`,
        "Engage with your audience actively in comments and community posts.",
        "Promote your new videos across other social media platforms.",
        "Analyze your YouTube Analytics (or platform equivalent) to understand what works best.",
        `Collaborate with other creators in the "${inputs.contentType}" niche.`,
        "Consider A/B testing thumbnails and titles to optimize click-through rates."
      ]
    };
  };


  const handlePredictAudienceGrowth = async () => {
    if (checkPredictionLimit()) return;

    const { platform, channelHandle, contentType, ideaDescription, manualSubscribers, manualVideoCount } = audienceGrowthInputs;
    if (!platform || !contentType || !ideaDescription) {
      setGrowthRetentionError("Please fill in Platform, Content Type, and Idea Description.");
      return;
    }
    if (platform === 'youtube' && !channelHandle) {
        setGrowthRetentionError("Please provide a YouTube Channel Handle or ID.");
        return;
    }
    if (platform !== 'youtube' && (!manualSubscribers || !manualVideoCount)) {
        setGrowthRetentionError("Please provide Current Followers and Total Videos for non-YouTube platforms.");
        return;
    }


    setGrowthRetentionLoading(true);
    setGrowthRetentionError("");
    setChannelStats(null);
    setGrowthRetentionPrediction(null);

    try {
      let stats = { statistics: {}, topicDetails: {} }; // Default structure
      if (platform === 'youtube') {
        const id = await fetchChannelIdByHandle(channelHandle);
        stats = await fetchChannelStatistics(id);
      } else {
        // Use manual inputs for non-YouTube platforms
        stats.statistics.subscriberCount = manualSubscribers || "0";
        stats.statistics.videoCount = manualVideoCount || "0";
        stats.statistics.viewCount = "0"; // Placeholder, as this is harder to get manually
      }
      setChannelStats(stats); 

      const prediction = simulateGrowthAndRetention(stats, audienceGrowthInputs);
      setGrowthRetentionPrediction(prediction);
      if(!isLoggedIn) incrementPredictionCount();

    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to predict audience growth.";
      setGrowthRetentionError(message);
    } finally {
      setGrowthRetentionLoading(false);
    }
  };

   const growthChartData = growthRetentionPrediction ? [
      { name: 'Current', value: parseInt(growthRetentionPrediction.currentStats.subscribers.replace(/,/g, ''), 10) },
      { name: '1 Mo', value: parseInt(growthRetentionPrediction.predictedGrowth.nextMonth.replace(/,/g, ''), 10) },
      { name: '3 Mo', value: parseInt(growthRetentionPrediction.predictedGrowth.threeMonths.replace(/,/g, ''), 10) },
      { name: '6 Mo', value: parseInt(growthRetentionPrediction.predictedGrowth.sixMonths.replace(/,/g, ''), 10) },
      { name: '1 Yr', value: parseInt(growthRetentionPrediction.predictedGrowth.oneYear.replace(/,/g, ''), 10) },
   ] : [];


   if (!isClient) {
     return (
        <div className="flex flex-col items-center justify-center min-h-screen p-4">
            <Loader2 className="h-12 w-12 animate-spin text-primary" />
            <p className="mt-4 text-muted-foreground">Loading Predictor...</p>
        </div>
    );
   }

  return (
    <div className="container mx-auto px-4 py-8 space-y-20 md:space-y-24">

       <section className="text-center py-12 md:py-16 bg-gradient-to-b from-background via-primary/5 to-background animate-fade-in">
         <div className="container mx-auto px-4">
           <TrendingUp className="h-16 w-16 text-primary mx-auto mb-6 animate-fade-in" style={{ animationDelay: '0.2s' }} />
           <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-6 animate-fade-in" style={{ animationDelay: '0.4s' }}>
             Predict & Optimize Your Content
           </h1>
           <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto mb-8 animate-fade-in" style={{ animationDelay: '0.6s' }}>
             Leverage AI to understand audience sentiment and forecast the potential reach of your next big video idea.
             {!isLoggedIn && <span className="text-sm block text-primary mt-1 animate-fade-in" style={{ animationDelay: '0.8s' }}>(First prediction/analysis is free! Login for unlimited access.)</span>}
           </p>
         </div>
       </section>

       <section className="space-y-12 animate-fade-in" style={{ animationDelay: '0.8s' }}>
        <div className="text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-3">Unlock Content Insights</h2>
          <p className="text-muted-foreground max-w-xl mx-auto">Go beyond guesswork with AI-driven analysis and strategic forecasting.</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <PredictFeatureCard
            icon={Search} 
            title="Comment Sentiment Analysis"
            description="Quickly understand what your audience thinks by analyzing YouTube comment sections. Identify key themes and overall sentiment."
            img="https://picsum.photos/400/200?random=predictSentiment&grayscale&blur=1"
            hint="audience feedback analytics graph"
            delay="1s"
          />
          <PredictFeatureCard
            icon={Brain} 
            title="AI-Powered Improvement Strategies"
            description="Get actionable, AI-generated suggestions on how to refine your content based on audience feedback and performance data."
            img="https://picsum.photos/400/200?random=predictStrategy&grayscale&blur=1"
            hint="ai brain gears strategy"
            delay="1.2s"
          />
           <PredictFeatureCard
             icon={LineChart} 
             title="Audience Growth Forecaster"
             description="Estimate subscriber growth and audience retention based on your channel statistics and planned content strategies. Make informed decisions to expand your reach."
             img="https://picsum.photos/400/200?random=predictGrowth&grayscale&blur=1"
             hint="growth chart arrow upward analytics"
             delay="1.4s"
           />
        </div>
       </section>

       <section id="comment-analyzer" className="space-y-8 scroll-mt-20 animate-fade-in" style={{ animationDelay: '1.6s' }}>
          <div className="text-center">
            <Youtube className="h-12 w-12 mx-auto text-primary mb-4" />
            <h2 className="text-3xl md:text-4xl font-bold">YouTube Comment Analyzer</h2>
            <p className="text-muted-foreground max-w-xl mx-auto mt-2">
                Paste a YouTube video URL to get an AI-powered summary of the comments and actionable insights.
            </p>
          </div>
            <Card className="max-w-4xl mx-auto shadow-xl border-border/50">
            <CardHeader>
                <CardTitle className="text-2xl font-bold">Analyze Audience Feedback</CardTitle>
                <CardDescription className="text-md text-muted-foreground">
                    {!isLoggedIn && predictionCount < 1 && <span className="text-sm block text-primary">(First analysis is free!)</span>}
                </CardDescription>
            </CardHeader>
             <CardContent className="max-w-2xl mx-auto space-y-6">
              <div
                className="border-2 border-dashed border-border rounded-lg p-6 text-center bg-card hover:border-primary transition-colors cursor-copy"
                onDragOver={(e) => e.preventDefault()}
                onDrop={handleDrop}
              >
                <Input
                  type="url"
                  value={url}
                  onChange={(e) => { setUrl(e.target.value); setError(""); }}
                  placeholder="Paste or drop YouTube URL here"
                  className="text-center text-base py-3"
                  aria-label="YouTube Video URL Input"
                  disabled={loading || geminiLoading || (!isLoggedIn && predictionCount >=1 && !summary) }
                />
                <p className="text-xs text-muted-foreground mt-2">Drag and drop works too!</p>
              </div>

              {error && (
                 <Alert variant="destructive">
                   <Terminal className="h-4 w-4" />
                   <AlertTitle>Error</AlertTitle>
                   <AlertDescription>{error}</AlertDescription>
                 </Alert>
              )}

              <Button
                onClick={handleAnalyze}
                className="w-full text-base py-3"
                size="lg"
                disabled={loading || geminiLoading || (!isLoggedIn && predictionCount >=1 && !summary)}
              >
                {loading ? (
                  <> <Loader2 className="mr-2 h-5 w-5 animate-spin" /> Analyzing Comments... </>
                ) : ( <> <Search className="mr-2 h-5 w-5" /> Analyze Comments </>)}
                {!isLoggedIn && predictionCount >= 1 && !summary && <span className="ml-2 text-xs">(Login Required)</span>}
              </Button>

              {loading && (
                <div className="space-y-4 pt-4 animate-pulse">
                  <Skeleton className="h-6 w-1/3" />
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-5/6" />
                  <Skeleton className="h-10 w-1/2 mt-2" />
                </div>
              )}

              {summary && !loading && (
                <Card className="bg-background/50 border-border/70 animate-fade-in">
                   <CardHeader>
                        <CardTitle className="text-xl flex items-center gap-2"><CheckCircleIcon className="h-6 w-6 text-green-500"/> Analysis Summary</CardTitle>
                   </CardHeader>
                  <CardContent className="space-y-4">
                    <p className="text-sm text-foreground/90 whitespace-pre-wrap leading-relaxed">{summary}</p>
                    <Button onClick={handleGeminiRequest} variant="outline" className="w-full text-base py-3" size="lg" disabled={geminiLoading || loading || (!isLoggedIn && predictionCount >=1)}>
                      {geminiLoading ? (
                        <> <Loader2 className="mr-2 h-5 w-5 animate-spin" /> Generating Suggestions... </>
                      ) : ( <> <Lightbulb className="mr-2 h-5 w-5" /> Get Improvement Suggestions </> )}
                       {!isLoggedIn && predictionCount >= 1 && <span className="ml-2 text-xs">(Login Required)</span>}
                    </Button>
                    {geminiLoading && (
                      <div className="space-y-2 pt-2 animate-pulse">
                        <Skeleton className="h-5 w-1/3" />
                        <Skeleton className="h-4 w-full" />
                        <Skeleton className="h-4 w-full" />
                        <Skeleton className="h-4 w-4/5" />
                      </div>
                    )}
                    {geminiResponse && !geminiLoading && (
                      <div className="pt-4 border-t mt-4 animate-fade-in">
                        <h3 className="text-lg font-semibold mb-2 flex items-center gap-2"><Lightbulb className="h-5 w-5 text-primary"/> AI-Powered Improvement Suggestions</h3>
                        <p className="text-sm text-foreground/90 whitespace-pre-wrap leading-relaxed">{geminiResponse}</p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              )}
            </CardContent>
          </Card>
       </section>

        <section id="audience-growth-predictor" className="space-y-8 scroll-mt-20 animate-fade-in" style={{ animationDelay: '1.8s' }}>
          <div className="text-center">
             <LineChart className="h-12 w-12 mx-auto text-primary mb-4" />
             <h2 className="text-3xl md:text-4xl font-bold">Audience Growth &amp; Retention Forecaster</h2>
             <p className="text-muted-foreground max-w-xl mx-auto mt-2">
                Input your channel details and content plans to get an AI-simulated forecast for subscriber growth and audience retention.
             </p>
          </div>
           <Card className="max-w-4xl mx-auto shadow-xl border-border/50">
            <CardHeader>
                <CardTitle className="text-2xl font-bold">Forecast Your Channel's Trajectory</CardTitle>
                <CardDescription className="text-md text-muted-foreground">
                {!isLoggedIn && predictionCount < 1 && <span className="text-sm block text-primary">(First forecast is free!)</span>}
                </CardDescription>
            </CardHeader>
             <CardContent className="max-w-3xl mx-auto space-y-6">
                <div className="space-y-2">
                    <Label htmlFor="platform" className="flex items-center gap-1"><Target className="h-4 w-4"/> Platform</Label>
                    <Select onValueChange={(value) => setAudienceGrowthInputs(prev => ({ ...prev, platform: value, channelHandle: value === 'youtube' ? prev.channelHandle : '' }))} value={audienceGrowthInputs.platform || "youtube"} disabled={growthRetentionLoading}>
                        <SelectTrigger id="platform"><SelectValue placeholder="Select platform" /></SelectTrigger>
                        <SelectContent>
                            <SelectItem value="youtube">YouTube</SelectItem>
                            <SelectItem value="instagram">Instagram</SelectItem>
                        </SelectContent>
                    </Select>
                </div>

                {audienceGrowthInputs.platform === "youtube" ? (
                    <div className="space-y-2">
                        <Label htmlFor="channelHandle" className="flex items-center gap-1"><Youtube className="h-4 w-4"/> YouTube Channel Handle/ID</Label>
                        <Input id="channelHandle" name="channelHandle" value={audienceGrowthInputs.channelHandle} onChange={handleAudienceGrowthInputChange} placeholder="e.g., @YourChannelHandle or UCxxxx" disabled={growthRetentionLoading || (!isLoggedIn && predictionCount >=1 && !growthRetentionPrediction)} required />
                        <p className="text-xs text-muted-foreground">Your Channel ID from your Wcontent profile is pre-filled if available.</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="manualSubscribers" className="flex items-center gap-1"><Users className="h-4 w-4"/> Current Followers/Subscribers</Label>
                            <Input id="manualSubscribers" name="manualSubscribers" type="number" value={audienceGrowthInputs.manualSubscribers || ''} onChange={handleAudienceGrowthInputChange} placeholder="e.g., 15000" disabled={growthRetentionLoading || (!isLoggedIn && predictionCount >=1 && !growthRetentionPrediction)} />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="manualVideoCount" className="flex items-center gap-1"><Video className="h-4 w-4"/> Total Videos/Posts</Label>
                            <Input id="manualVideoCount" name="manualVideoCount" type="number" value={audienceGrowthInputs.manualVideoCount || ''} onChange={handleAudienceGrowthInputChange} placeholder="e.g., 50" disabled={growthRetentionLoading || (!isLoggedIn && predictionCount >=1 && !growthRetentionPrediction)} />
                        </div>
                    </div>
                )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="contentTypeGrowth" className="flex items-center gap-1"><Video className="h-4 w-4"/> Planned Content Type / Genre</Label>
                  <Input id="contentTypeGrowth" name="contentType" value={audienceGrowthInputs.contentType} onChange={handleAudienceGrowthInputChange} placeholder="e.g., Gaming, Tutorials, Vlogs" disabled={growthRetentionLoading || (!isLoggedIn && predictionCount >=1 && !growthRetentionPrediction)} required />
                </div>
                 <div className="space-y-2">
                    <Label htmlFor="uploadFrequency" className="flex items-center gap-1"><Clock className="h-4 w-4"/> Content Upload Frequency</Label>
                    <Select onValueChange={(value) => setAudienceGrowthInputs(prev => ({ ...prev, uploadFrequency: value }))} value={audienceGrowthInputs.uploadFrequency || "weekly"} disabled={growthRetentionLoading}>
                        <SelectTrigger id="uploadFrequency"><SelectValue placeholder="Select frequency" /></SelectTrigger>
                        <SelectContent>
                            <SelectItem value="daily">Daily</SelectItem>
                            <SelectItem value="bi-weekly">2-3 times a week</SelectItem>
                            <SelectItem value="weekly">Weekly</SelectItem>
                            <SelectItem value="bi-monthly">Twice a month</SelectItem>
                            <SelectItem value="monthly">Monthly</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="ideaDescriptionGrowth" className="flex items-center gap-1"><Lightbulb className="h-4 w-4"/> Description of New Content Ideas</Label>
                <Textarea id="ideaDescriptionGrowth" name="ideaDescription" value={audienceGrowthInputs.ideaDescription} onChange={handleAudienceGrowthInputChange} placeholder="Briefly describe the type of content you plan to create next, topics, style..." rows={3} disabled={growthRetentionLoading || (!isLoggedIn && predictionCount >=1 && !growthRetentionPrediction)} required />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                 <div className="space-y-2">
                    <Label htmlFor="adSpend" className="flex items-center gap-1"><DollarSign className="h-4 w-4"/> Ad Spend / Promotion Budget (Optional)</Label>
                    <Input id="adSpend" name="adSpend" type="number" value={audienceGrowthInputs.adSpend || ''} onChange={handleAudienceGrowthInputChange} placeholder="e.g., 100 (in USD)" disabled={growthRetentionLoading}/>
                </div>
                <div className="space-y-2">
                    <Label htmlFor="targetAudienceAge" className="flex items-center gap-1"><UserCheck className="h-4 w-4"/> Target Audience Age (Optional)</Label>
                    <Input id="targetAudienceAge" name="targetAudienceAge" value={audienceGrowthInputs.targetAudienceAge} onChange={handleAudienceGrowthInputChange} placeholder="e.g., 18-24, 25-34" disabled={growthRetentionLoading}/>
                </div>
              </div>
               <div className="space-y-2">
                    <Label htmlFor="targetAudienceLocation" className="flex items-center gap-1"><MapPin className="h-4 w-4"/> Target Audience Location (Optional)</Label>
                    <Input id="targetAudienceLocation" name="targetAudienceLocation" value={audienceGrowthInputs.targetAudienceLocation} onChange={handleAudienceGrowthInputChange} placeholder="e.g., USA, India, Global" disabled={growthRetentionLoading}/>
                </div>


              {growthRetentionError && (
                <Alert variant="destructive">
                  <Terminal className="h-4 w-4" />
                  <AlertTitle>Prediction Error</AlertTitle>
                  <AlertDescription>{growthRetentionError}</AlertDescription>
                </Alert>
              )}

              <Button
                onClick={handlePredictAudienceGrowth}
                className="w-full text-base py-3"
                size="lg"
                disabled={growthRetentionLoading || (!isLoggedIn && predictionCount >=1 && !growthRetentionPrediction)}
              >
                {growthRetentionLoading ? (
                  <> <Loader2 className="mr-2 h-5 w-5 animate-spin" /> Forecasting Growth... </>
                ) : ( <> <BarChartIcon className="mr-2 h-5 w-5" /> Forecast Growth &amp; Retention </>)}
                {!isLoggedIn && predictionCount >= 1 && !growthRetentionPrediction && <span className="ml-2 text-xs">(Login Required)</span>}
              </Button>

              {growthRetentionLoading && !channelStats && ( 
                <div className="space-y-4 pt-4 border-t mt-6 animate-pulse">
                  <Skeleton className="h-6 w-2/3 mb-2" />
                  <div className="grid grid-cols-3 gap-4"> <Skeleton className="h-10 w-full" /> <Skeleton className="h-10 w-full" /> <Skeleton className="h-10 w-full" /> </div>
                  <Skeleton className="h-4 w-full mt-2" /> <Skeleton className="h-4 w-3/4" />
                  <Skeleton className="h-40 w-full mt-4" /> 
                </div>
              )}

            {growthRetentionPrediction && !growthRetentionLoading && (
            <Card className="bg-background/50 border-border/70 mt-6 animate-fade-in">
                <CardHeader>
                <CardTitle className="text-xl flex items-center gap-2">
                    <UserCheck className="h-6 w-6 text-green-500"/> Audience Trajectory Forecast for <span className="text-primary">{audienceGrowthInputs.platform === 'youtube' ? audienceGrowthInputs.channelHandle : 'Your Channel'}</span>
                </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                <div>
                    <h4 className="text-md font-semibold mb-2 text-foreground/80">Current Channel Snapshot:</h4>
                    <ul className="text-sm list-disc list-inside space-y-1 pl-4 text-foreground/90">
                        <li>Platform: <Badge variant="secondary" className="capitalize">{audienceGrowthInputs.platform || 'N/A'}</Badge></li>
                        <li>Subscribers/Followers: {growthRetentionPrediction.currentStats.subscribers}</li>
                        <li>Total Videos/Posts: {growthRetentionPrediction.currentStats.videos}</li>
                        {audienceGrowthInputs.platform === 'youtube' && <li>Total Views: {growthRetentionPrediction.currentStats.views}</li>}
                        {audienceGrowthInputs.platform === 'youtube' && <li>Main Topics: {growthRetentionPrediction.currentStats.topics.join(', ') || 'N/A'}</li>}
                    </ul>
                </div>
                <div>
                    <h4 className="text-md font-semibold mb-2 text-foreground/80">Simulated Subscriber/Follower Growth:</h4>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4 text-center">
                        {['nextMonth', 'threeMonths', 'sixMonths', 'oneYear'].map(period => (
                             <Card key={period} className="p-3 md:p-4">
                                <p className="text-xs text-muted-foreground capitalize">{period.replace('nextMonth', 'Next Month').replace('threeMonths', '3 Months').replace('sixMonths', '6 Months').replace('oneYear', '1 Year')} Est.</p>
                                <p className="text-xl md:text-2xl font-bold text-primary">{growthRetentionPrediction.predictedGrowth[period]}</p>
                            </Card>
                        ))}
                    </div>
                     <div className="h-[250px] mt-4"> 
                        <ChartContainer config={{ subscribers: { label: "Subscribers/Followers", color: "hsl(var(--primary))" } }} className="w-full">
                            <RechartsBarChart
                                accessibilityLayer
                                data={growthChartData}
                                layout="vertical"
                                margin={{ left: 10, right:10 }}
                            >
                                <CartesianGrid vertical={false} strokeDasharray="3 3"/>
                                <XAxis type="number" dataKey="value" hide/>
                                <YAxis dataKey="name" type="category" tickLine={false} tickMargin={10} axisLine={false} tickFormatter={(value) => value.slice(0, 15)} width={100} />
                                <ChartTooltip content={<ChartTooltipContent hideIndicator />} cursor={false}/>
                                <Legend wrapperStyle={{fontSize: "12px", paddingTop: "10px"}}/>
                                <Bar dataKey="value" name="Subscribers/Followers" fill="var(--color-subscribers)" radius={5} />
                            </RechartsBarChart>
                        </ChartContainer>
                    </div>
                     <p className="text-xs text-center text-muted-foreground mt-1">Prediction based on new content type: "{audienceGrowthInputs.contentType}"</p>
                </div>

                <div>
                    <h4 className="text-md font-semibold mb-2 text-foreground/80">Audience Retention Outlook:</h4>
                    <p className="text-sm text-foreground/90 leading-relaxed">{growthRetentionPrediction.predictedRetention.summary}</p>
                    <p className="text-sm mt-2"><strong className="text-primary">{growthRetentionPrediction.predictedRetention.outlook} Potential.</strong> Key factors: {growthRetentionPrediction.predictedRetention.keyFactors.join(', ')}.</p>
                </div>
                    <div>
                        <h4 className="text-md font-semibold mb-2 text-foreground/80">Actionable Improvement Tips:</h4>
                        <ul className="text-sm list-disc list-inside space-y-1.5 pl-4 text-foreground/90">
                            {growthRetentionPrediction.improvementTips.map((tip, index) => <li key={index}>{tip}</li>)}
                        </ul>
                    </div>
                <p className="text-xs text-muted-foreground mt-4">*Disclaimer: This is an AI-generated simulation based on provided data and general trends. Actual results may vary.*</p>
                </CardContent>
            </Card>
            )}
            </CardContent>
          </Card>
        </section>

        <AlertDialog open={showLoginAlert} onOpenChange={setShowLoginAlert}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle className="flex items-center gap-2"><LogIn className="h-5 w-5"/> Login Required</AlertDialogTitle>
              <AlertDialogDescription>
                 You've used your free analysis/prediction request. Please log in or sign up to continue using this feature without limits.
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
