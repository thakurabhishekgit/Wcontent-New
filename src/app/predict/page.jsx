
'use client';

import React, { useState, useEffect } from "react";
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Terminal, Youtube, Lightbulb, Loader2, LogIn, Search, TrendingUp, DollarSign, Users, Video, Target, BarChart as BarChartIcon, HelpCircle, LineChart, UserCheck } from "lucide-react"; // Keep BarChartIcon for now, might be used by new feature
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
import { Bar, CartesianGrid, XAxis, YAxis, BarChart as RechartsBarChart, Tooltip as RechartsTooltip, Legend, ResponsiveContainer } from 'recharts';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';


const FeatureCard = ({ icon: Icon, title, description, img, hint }) => (
   <Card className="flex flex-col overflow-hidden hover:shadow-lg transition-shadow duration-300">
     <CardHeader>
       <Icon className="h-8 w-8 mb-2 text-primary" />
       <CardTitle>{title}</CardTitle>
       <CardDescription>{description}</CardDescription>
     </CardHeader>
     <CardContent className="flex-grow flex items-end">
       <Image
         src={img}
         alt={title}
         data-ai-hint={hint}
         width={400}
         height={250}
         className="rounded-md object-cover w-full h-auto mt-4"
       />
     </CardContent>
   </Card>
 );

// IMPORTANT: Storing API keys in frontend code is insecure.
// This should be handled via a backend proxy in a production environment.
const YOUTUBE_API_KEY = "AIzaSyDEqYeUl6kQpslAsKKa-6D6uqxOKjp_lT4"; // Replace with your actual API key


function Ml() {
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

  // State for New Audience Growth & Retention Predictor
  const [audienceGrowthInputs, setAudienceGrowthInputs] = useState({
    channelHandle: "", // e.g., @LoLzZzGaming
    contentType: "",
    ideaDescription: ""
  });
  const [channelStats, setChannelStats] = useState(null);
  const [growthRetentionPrediction, setGrowthRetentionPrediction] = useState(null);
  const [growthRetentionLoading, setGrowthRetentionLoading] = useState(false);
  const [growthRetentionError, setGrowthRetentionError] = useState("");


  useEffect(() => {
    setIsClient(true);
    const token = localStorage.getItem('token');
    setIsLoggedIn(!!token);
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
      return true; // Limit reached
    }
    return false; // Limit not reached
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
     if (checkPredictionLimit() && !summary) return; // Allow if summary was from free tier

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

  // Handlers for Audience Growth & Retention Predictor
  const handleAudienceGrowthInputChange = (e) => {
    const { name, value } = e.target;
    setAudienceGrowthInputs(prev => ({ ...prev, [name]: value }));
    setGrowthRetentionError("");
  };

  const fetchChannelIdByHandle = async (handle) => {
    // Remove "@" if present
    const cleanHandle = handle.startsWith('@') ? handle.substring(1) : handle;
    const url = `https://www.googleapis.com/youtube/v3/channels?part=id&forHandle=${cleanHandle}&key=${YOUTUBE_API_KEY}`;
    try {
      const response = await fetch(url);
      const data = await response.json();
      if (data.items && data.items.length > 0) {
        return data.items[0].id;
      } else {
        throw new Error("Channel handle not found or invalid.");
      }
    } catch (error) {
      console.error("Error fetching channel ID by handle:", error);
      throw error; // Re-throw to be caught by caller
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
        throw new Error("Channel statistics not found.");
      }
    } catch (error) {
      console.error("Error fetching channel statistics:", error);
      throw error;
    }
  };
  
  const simulateGrowthAndRetention = (stats, contentType, ideaDescription) => {
    // Basic simulation - replace with more sophisticated logic or ML model call
    const currentSubs = parseInt(stats.statistics.subscriberCount, 10);
    const currentVideos = parseInt(stats.statistics.videoCount, 10);
    
    // Subscriber Growth Simulation (e.g., next 3 months)
    const monthlyGrowthRate = 0.02 + (Math.random() * 0.03); // 2-5% monthly
    const predictedSubscribersNextMonth = Math.floor(currentSubs * (1 + monthlyGrowthRate));
    const predictedSubscribersThreeMonths = Math.floor(currentSubs * Math.pow((1 + monthlyGrowthRate), 3));

    // Audience Retention Simulation (qualitative)
    let retentionFactors = [];
    if (contentType.toLowerCase().includes("tutorial") || ideaDescription.toLowerCase().includes("how to")) {
      retentionFactors.push("clear, step-by-step instructions");
    }
    if (stats.topicDetails?.topicCategories?.some(cat => cat.toLowerCase().includes(contentType.toLowerCase()))) {
      retentionFactors.push("alignment with channel's core topics");
    } else {
      retentionFactors.push("exploring new niches (monitor retention closely)");
    }
    retentionFactors.push("engaging intro and consistent value delivery");

    let retentionOutlook = "Medium";
    if (retentionFactors.length >=2 && stats.statistics.viewCount > 100000) retentionOutlook = "High";
    if (retentionFactors.length <=1 && currentVideos < 20) retentionOutlook = "Low to Medium";


    return {
      currentStats: {
        subscribers: currentSubs.toLocaleString(),
        videos: currentVideos.toLocaleString(),
        views: parseInt(stats.statistics.viewCount, 10).toLocaleString(),
        topics: stats.topicDetails?.topicCategories?.map(tc => tc.split('/').pop().replace(/_/g, ' ')) || ["N/A"],
      },
      predictedGrowth: {
        nextMonth: predictedSubscribersNextMonth.toLocaleString(),
        threeMonths: predictedSubscribersThreeMonths.toLocaleString(),
      },
      predictedRetention: {
        outlook: retentionOutlook,
        keyFactors: retentionFactors,
        summary: `For content on "${contentType}" described as "${ideaDescription.substring(0,50)}...", focus on ${retentionFactors.join(', ')} to maximize audience retention. The outlook is currently ${retentionOutlook}.`
      },
      improvementTips: [
        `Consistently upload high-quality content related to "${contentType}".`,
        "Engage with your audience in comments and community posts.",
        "Promote your new videos across other social media platforms.",
        "Analyze your YouTube Analytics to understand what works best for your audience.",
        `Collaborate with other creators in the "${contentType}" niche.`
      ]
    };
  };


  const handlePredictAudienceGrowth = async () => {
    if (checkPredictionLimit()) return;

    const { channelHandle, contentType, ideaDescription } = audienceGrowthInputs;
    if (!channelHandle || !contentType || !ideaDescription) {
      setGrowthRetentionError("Please fill in Channel Handle, Content Type, and Description.");
      return;
    }

    setGrowthRetentionLoading(true);
    setGrowthRetentionError("");
    setChannelStats(null);
    setGrowthRetentionPrediction(null);

    try {
      const id = await fetchChannelIdByHandle(channelHandle);
      const stats = await fetchChannelStatistics(id);
      setChannelStats(stats); // Store full stats object

      const prediction = simulateGrowthAndRetention(stats, contentType, ideaDescription);
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
      { name: 'Current Subs', value: parseInt(growthRetentionPrediction.currentStats.subscribers.replace(/,/g, ''), 10) },
      { name: 'Next Month Est.', value: parseInt(growthRetentionPrediction.predictedGrowth.nextMonth.replace(/,/g, ''), 10) },
      { name: '3 Months Est.', value: parseInt(growthRetentionPrediction.predictedGrowth.threeMonths.replace(/,/g, ''), 10) },
   ] : [];


   if (!isClient) {
     return null;
   }

  return (
    <div className="container mx-auto px-4 py-8 space-y-16">

       <section className="text-center pt-8 pb-8 md:pt-12 md:pb-12">
         <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-4 bg-gradient-to-r from-primary via-teal-400 to-teal-600 bg-clip-text text-transparent">
           Predict & Optimize Your Content
         </h1>
         <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto">
           Leverage AI to understand audience sentiment and forecast the potential reach of your next big video idea.
           {!isLoggedIn && <span className="text-sm block text-primary mt-1">(First prediction/analysis is free! Login for unlimited access.)</span>}
         </p>
       </section>

       <section className="space-y-12">
        <div className="text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-3">Unlock Content Insights</h2>
          <p className="text-muted-foreground max-w-xl mx-auto">Go beyond guesswork with AI-driven analysis.</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <FeatureCard
            icon={Search}
            title="Comment Sentiment Analysis"
            description="Quickly understand what your audience thinks by analyzing comment sections."
            img="https://placehold.co/400x250.png"
            hint="vector feedback chat"
          />
          <FeatureCard
            icon={Lightbulb}
            title="Actionable Improvement Ideas"
            description="Get AI-powered suggestions on how to make your next video even better based on feedback."
            img="https://placehold.co/400x250.png"
            hint="vector idea lightbulb"
          />
           <FeatureCard
             icon={TrendingUp}
             title="Audience Growth Forecaster"
             description="Estimate subscriber growth and retention based on your channel stats and content plans."
             img="https://placehold.co/400x250.png"
             hint="vector chart growth"
           />
        </div>
       </section>

       {/* --- YouTube Comment Analyzer Section --- */}
       <section id="comment-analyzer" className="space-y-8 scroll-mt-20">
          <h2 className="text-3xl md:text-4xl font-bold text-center">YouTube Comment Analyzer</h2>
          <Card className="max-w-4xl mx-auto">
            <CardHeader className="text-center">
              <Youtube className="h-12 w-12 mx-auto text-primary mb-2" />
              <CardTitle className="text-2xl font-bold">Analyze Audience Feedback</CardTitle>
              <CardDescription className="text-md text-muted-foreground">
                Paste a YouTube video URL to get an AI-powered summary of the comments.
                {!isLoggedIn && predictionCount < 1 && <span className="text-sm block text-primary">(First analysis is free!)</span>}
              </CardDescription>
            </CardHeader>
            <CardContent className="max-w-2xl mx-auto space-y-6">
              <div
                className="border-2 border-dashed border-border rounded-lg p-6 text-center bg-muted/30 hover:border-primary transition-colors cursor-copy"
                onDragOver={(e) => e.preventDefault()}
                onDrop={handleDrop}
              >
                <Input
                  type="url"
                  value={url}
                  onChange={(e) => { setUrl(e.target.value); setError(""); }}
                  placeholder="Paste or drop YouTube URL here"
                  className="text-center text-base"
                  aria-label="YouTube Video URL Input"
                  disabled={loading || geminiLoading || (checkPredictionLimit() && isLoggedIn)}
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
                className="w-full"
                disabled={loading || geminiLoading || (!isLoggedIn && predictionCount >=1)}
              >
                {loading ? (
                  <> <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Analyzing... </>
                ) : 'Analyze Comments'}
                {!isLoggedIn && predictionCount >= 1 && <span className="ml-2 text-xs">(Login Required)</span>}
              </Button>

              {loading && (
                <div className="space-y-4 pt-4">
                  <Skeleton className="h-6 w-1/4" /> <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-5/6" /> <Skeleton className="h-10 w-1/2" />
                </div>
              )}

              {summary && !loading && (
                <Card className="bg-muted/30">
                   <CardHeader> <CardTitle className="text-xl">AI Analysis Summary</CardTitle> </CardHeader>
                  <CardContent className="space-y-4">
                    <p className="text-sm text-foreground/90 whitespace-pre-wrap">{summary}</p>
                    <Button onClick={handleGeminiRequest} variant="outline" className="w-full" disabled={geminiLoading || loading || (!isLoggedIn && predictionCount >=1)}>
                      {geminiLoading ? (
                        <> <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Generating Suggestions... </>
                      ) : ( <> <Lightbulb className="mr-2 h-4 w-4" /> Get Improvement Suggestions </> )}
                       {!isLoggedIn && predictionCount >= 1 && <span className="ml-2 text-xs">(Login Required)</span>}
                    </Button>
                    {geminiLoading && (
                      <div className="space-y-2 pt-2">
                        <Skeleton className="h-5 w-1/3" /> <Skeleton className="h-4 w-full" />
                        <Skeleton className="h-4 w-full" /> <Skeleton className="h-4 w-4/5" />
                      </div>
                    )}
                    {geminiResponse && !geminiLoading && (
                      <div className="pt-4">
                        <h3 className="text-lg font-semibold mb-2 flex items-center gap-2"><Lightbulb className="h-5 w-5 text-primary"/> Improvement Suggestions</h3>
                        <p className="text-sm text-foreground/90 whitespace-pre-wrap">{geminiResponse}</p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              )}
            </CardContent>
          </Card>
       </section>


       {/* --- New Audience Growth & Retention Predictor Section --- */}
        <section id="audience-growth-predictor" className="space-y-8 scroll-mt-20">
          <h2 className="text-3xl md:text-4xl font-bold text-center">Audience Growth &amp; Retention Forecaster</h2>
          <Card className="max-w-4xl mx-auto">
            <CardHeader className="text-center">
              <LineChart className="h-12 w-12 mx-auto text-primary mb-2" />
              <CardTitle className="text-2xl font-bold">Predict Your Channel's Trajectory</CardTitle>
              <CardDescription className="text-md text-muted-foreground">
                Input your YouTube channel handle and planned content details to get an AI-simulated forecast for subscriber growth and audience retention.
                {!isLoggedIn && predictionCount < 1 && <span className="text-sm block text-primary">(First forecast is free!)</span>}
              </CardDescription>
            </CardHeader>
            <CardContent className="max-w-3xl mx-auto space-y-6">
              <div className="space-y-2">
                <Label htmlFor="channelHandle" className="flex items-center gap-1"><Youtube className="h-4 w-4"/> YouTube Channel Handle</Label>
                <Input
                  id="channelHandle"
                  name="channelHandle"
                  value={audienceGrowthInputs.channelHandle}
                  onChange={handleAudienceGrowthInputChange}
                  placeholder="e.g., @YourChannelHandle or drop your youtube channel id @id"
                  disabled={growthRetentionLoading || (!isLoggedIn && predictionCount >=1)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="contentTypeGrowth" className="flex items-center gap-1"><Video className="h-4 w-4"/> Planned Content Type / Genre</Label>
                <Input
                  id="contentTypeGrowth"
                  name="contentType"
                  value={audienceGrowthInputs.contentType}
                  onChange={handleAudienceGrowthInputChange}
                  placeholder="e.g., Gaming Montages, Educational Series"
                  disabled={growthRetentionLoading || (!isLoggedIn && predictionCount >=1)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="ideaDescriptionGrowth" className="flex items-center gap-1"><Lightbulb className="h-4 w-4"/> Description of New Content Ideas</Label>
                <Textarea
                  id="ideaDescriptionGrowth"
                  name="ideaDescription"
                  value={audienceGrowthInputs.ideaDescription}
                  onChange={handleAudienceGrowthInputChange}
                  placeholder="Briefly describe the type of content you plan to create next..."
                  rows={3}
                  disabled={growthRetentionLoading || (!isLoggedIn && predictionCount >=1)}
                  required
                />
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
                className="w-full"
                disabled={growthRetentionLoading || (!isLoggedIn && predictionCount >=1)}
              >
                {growthRetentionLoading ? (
                  <> <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Forecasting... </>
                ) : 'Forecast Growth &amp; Retention'}
                {!isLoggedIn && predictionCount >= 1 && <span className="ml-2 text-xs">(Login Required)</span>}
              </Button>

              {growthRetentionLoading && !channelStats && ( // Show skeleton while fetching initial stats
                <div className="space-y-4 pt-4 border-t mt-6">
                  <Skeleton className="h-6 w-1/2 mb-2" />
                  <div className="grid grid-cols-3 gap-4"> <Skeleton className="h-10 w-full" /> <Skeleton className="h-10 w-full" /> <Skeleton className="h-10 w-full" /> </div>
                  <Skeleton className="h-4 w-full mt-2" /> <Skeleton className="h-4 w-3/4" />
                </div>
              )}

              {growthRetentionPrediction && !growthRetentionLoading && (
                <Card className="bg-muted/30 mt-6">
                  <CardHeader>
                    <CardTitle className="text-xl flex items-center gap-2">
                       <UserCheck className="h-5 w-5 text-primary"/> Audience Trajectory Forecast for <span className="text-primary">{audienceGrowthInputs.channelHandle}</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div>
                        <h4 className="text-md font-semibold mb-2 text-foreground/80">Current Channel Snapshot:</h4>
                        <ul className="text-sm list-disc list-inside space-y-1 pl-4 text-foreground/90">
                            <li>Subscribers: {growthRetentionPrediction.currentStats.subscribers}</li>
                            <li>Total Videos: {growthRetentionPrediction.currentStats.videos}</li>
                            <li>Total Views: {growthRetentionPrediction.currentStats.views}</li>
                            <li>Main Topics: {growthRetentionPrediction.currentStats.topics.join(', ') || 'N/A'}</li>
                        </ul>
                    </div>
                     <div>
                        <h4 className="text-md font-semibold mb-2 text-foreground/80">Simulated Subscriber Growth:</h4>
                        <div className="h-[200px] mt-2">
                            <ResponsiveContainer width="100%" height="100%">
                                <RechartsBarChart data={growthChartData} margin={{ top: 5, right: 0, left: -20, bottom: 5 }}>
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis dataKey="name" fontSize={12} />
                                    <YAxis fontSize={12} />
                                    <RechartsTooltip contentStyle={{backgroundColor: 'hsl(var(--background))', border: '1px solid hsl(var(--border))'}}/>
                                    <Legend wrapperStyle={{fontSize: "12px"}}/>
                                    <Bar dataKey="value" fill="hsl(var(--primary))" name="Subscribers" radius={[4, 4, 0, 0]} />
                                </RechartsBarChart>
                            </ResponsiveContainer>
                        </div>
                        <p className="text-xs text-center text-muted-foreground mt-1">Next Month Est: ~{growthRetentionPrediction.predictedGrowth.nextMonth} | 3 Months Est: ~{growthRetentionPrediction.predictedGrowth.threeMonths}</p>
                    </div>

                    <div>
                        <h4 className="text-md font-semibold mb-2 text-foreground/80">Audience Retention Outlook:</h4>
                        <p className="text-sm text-foreground/90">{growthRetentionPrediction.predictedRetention.summary}</p>
                        <p className="text-sm mt-1"><strong className="text-primary">{growthRetentionPrediction.predictedRetention.outlook} Potential.</strong> Focus on: {growthRetentionPrediction.predictedRetention.keyFactors.join(', ')}.</p>
                    </div>
                     <div>
                        <h4 className="text-md font-semibold mb-2 text-foreground/80">Improvement Tips:</h4>
                        <ul className="text-sm list-disc list-inside space-y-1 pl-4 text-foreground/90">
                            {growthRetentionPrediction.improvementTips.map((tip, index) => <li key={index}>{tip}</li>)}
                        </ul>
                    </div>
                    <p className="text-xs text-muted-foreground mt-2">*Disclaimer: This is an AI-generated simulation and actual results may vary.*</p>
                  </CardContent>
                </Card>
              )}
            </CardContent>
          </Card>
        </section>


        {/* Login Required Alert Dialog */}
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

export default Ml;
