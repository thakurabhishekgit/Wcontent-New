'use client'; // Add this directive

import React, { useState, useEffect } from "react"; // Import useEffect
import Image from 'next/image'; // Import Image
import { Button } from '@/components/ui/button'; // Import Shadcn Button
import { Input } from '@/components/ui/input'; // Import Shadcn Input
import { Textarea } from '@/components/ui/textarea'; // Import Shadcn Textarea
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card'; // Import Shadcn Card
import { Skeleton } from '@/components/ui/skeleton'; // Import Skeleton
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"; // Import Alert
import { Terminal, Youtube, Lightbulb, Loader2, LogIn, Search, TrendingUp, DollarSign, Users, Video, Target, BarChart } from "lucide-react"; // Import icons, added BarChart
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
import { useRouter } from 'next/navigation'; // Import useRouter
import { Label } from "@/components/ui/label"; // Import Label
import { Bar, CartesianGrid, XAxis, YAxis, BarChart as RechartsBarChart } from 'recharts'; // Import Recharts components
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart'; // Import Shadcn Chart components


// Placeholder component similar to homepage features
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
         unoptimized={img.includes('encrypted-tbn0.gstatic.com')} // Add unoptimized for external image
       />
     </CardContent>
   </Card>
 );

function Ml() {
  const [url, setUrl] = useState("");
  const [summary, setSummary] = useState("");
  const [loading, setLoading] = useState(false);
  const [geminiLoading, setGeminiLoading] = useState(false); // Separate loading state for Gemini
  const [error, setError] = useState("");
  const [geminiResponse, setGeminiResponse] = useState("");
  const [isClient, setIsClient] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [predictionCount, setPredictionCount] = useState(0);
  const [showLoginAlert, setShowLoginAlert] = useState(false);
  const router = useRouter();

  // State for Future Reach Predictor
  const [futureReachData, setFutureReachData] = useState({
    contentType: "",
    description: "",
    estimatedCost: "",
    currentSubs: "",
    avgViews: "",
  });
  const [reachLoading, setReachLoading] = useState(false);
  // Updated state to hold detailed prediction results
  const [reachPredictionResult, setReachPredictionResult] = useState({
     views: null,
     likes: null,
     comments: null,
     description: "",
   });
  const [reachError, setReachError] = useState("");
  const [reachTips, setReachTips] = useState("");
  const [tipsLoading, setTipsLoading] = useState(false);

  useEffect(() => {
    setIsClient(true);
    const token = localStorage.getItem('token');
    setIsLoggedIn(!!token);
    // Load prediction count from localStorage if available
    const storedCount = localStorage.getItem('predictionCount');
    if (storedCount) {
      setPredictionCount(parseInt(storedCount, 10));
    }
  }, []);


  const isValidYouTubeUrl = (url) => {
    const pattern = /^(https?:\/\/)?(www\.)?(youtube\.com|youtu\.be)\/.+/;
    return pattern.test(url);
  };

  const handleAnalyze = async () => {
     // Check login status and prediction count before analysis
     if (!isLoggedIn && predictionCount >= 1) {
       setShowLoginAlert(true);
       return; // Stop analysis
     }

    if (!isValidYouTubeUrl(url)) {
      setError("Please enter a valid YouTube URL");
      return;
    }

    setLoading(true);
    setError("");
    setSummary("");
    setGeminiResponse("");

    try {
      // TODO: Replace with actual backend endpoint when available
      // Simulate fetching summary for now
      await new Promise(resolve => setTimeout(resolve, 1500)); // Simulate network delay
      const placeholderSummary = `Placeholder summary for ${url}: Comments generally positive, mentioning good editing but some found the intro too long. Several users asked for a follow-up video on topic X.`;
      setSummary(placeholderSummary); // Use placeholder

      // Increment prediction count only on successful analysis
      const newCount = predictionCount + 1;
      setPredictionCount(newCount);
       if (typeof window !== 'undefined') {
         localStorage.setItem('predictionCount', newCount.toString());
       }

    } catch (err) {
       const message = err instanceof Error ? err.message : "An error occurred during analysis";
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  const handleGeminiRequest = async () => {
     // Check login status and prediction count before Gemini request
     if (!isLoggedIn && predictionCount >= 1) { // Allow Gemini if analysis was the free one
       setShowLoginAlert(true);
       return; // Stop request
     }

    if (!summary) {
      setError("Please analyze comments first.");
      return;
    }

    setGeminiLoading(true);
    setError("");
    setGeminiResponse("");

    try {
      // --- IMPORTANT: Replace with your Genkit Flow call ---
      // This is a placeholder for the Gemini API call.
      // You should replace this with a call to a Genkit flow that takes the summary
      // and returns improvement suggestions.

       await new Promise(resolve => setTimeout(resolve, 2000)); // Simulate API delay
       const placeholderSuggestions = `Based on the summary:\n- Consider shortening the intro sequence.\n- Address the requests for a follow-up video on topic X in your next content plan.\n- Highlight the positive feedback on editing in your channel metrics.`;
       setGeminiResponse(placeholderSuggestions); // Use placeholder

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
       setError(""); // Clear error on valid drop
    } else {
        setError("Dropped item is not a valid YouTube URL");
    }
  };

  // Handlers for Future Reach Predictor
  const handleReachInputChange = (e) => {
    const { name, value } = e.target;
    setFutureReachData(prev => ({ ...prev, [name]: value }));
    setReachError(""); // Clear error on change
    setReachTips(""); // Clear tips when input changes
  };

  const handleReachPrediction = async () => {
    // Check login status and prediction count
    if (!isLoggedIn && predictionCount >= 1) {
      setShowLoginAlert(true);
      return; // Stop prediction
    }

    // Basic validation (can be more complex)
    if (!futureReachData.contentType || !futureReachData.description) {
      setReachError("Please fill in Content Type and Description.");
      return;
    }

    setReachLoading(true);
    setReachError("");
    setReachPredictionResult({ views: null, likes: null, comments: null, description: "" }); // Reset prediction results
    setReachTips(""); // Clear previous tips

    try {
      // --- IMPORTANT: Replace with your Genkit Flow call for reach prediction ---
      // const predictionResult = await predictVideoReach(futureReachData);
      // setReachPredictionResult({
      //    views: predictionResult.predictedViews,
      //    likes: predictionResult.predictedLikes,
      //    comments: predictionResult.predictedComments,
      //    description: predictionResult.predictionSummary
      // });

      await new Promise(resolve => setTimeout(resolve, 2500)); // Simulate API delay

      // Simulate detailed predictions
      const predictedViews = Math.floor(Math.random() * (50000 - 5000 + 1)) + 5000;
      const predictedLikes = Math.floor(predictedViews * (Math.random() * 0.05 + 0.01)); // Simulate likes as % of views
      const predictedComments = Math.floor(predictedLikes * (Math.random() * 0.1 + 0.02)); // Simulate comments as % of likes
      const predictionDescription = `Based on the provided details and current (simulated) stats, the estimated reach for "${futureReachData.contentType}" content could be around ${predictedViews.toLocaleString()} views, ${predictedLikes.toLocaleString()} likes, and ${predictedComments.toLocaleString()} comments within the first month. Factors like promotion strategy, audience engagement rate, and content quality will significantly influence the actual results.`;

       setReachPredictionResult({
          views: predictedViews,
          likes: predictedLikes,
          comments: predictedComments,
          description: predictionDescription,
       });

       // Increment prediction count (shared with comment analysis for simplicity)
       const newCount = predictionCount + 1;
       setPredictionCount(newCount);
       if (typeof window !== 'undefined') {
         localStorage.setItem('predictionCount', newCount.toString());
       }

    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to predict reach.";
      setReachError(message);
    } finally {
      setReachLoading(false);
    }
  };

   // Function to get improvement tips
   const handleGetTips = async () => {
     if (!reachPredictionResult.views) {
       setReachError("Generate a prediction first before asking for tips.");
       return;
     }

     setTipsLoading(true);
     setReachError("");
     setReachTips("");

     try {
       // --- IMPORTANT: Replace with your Genkit Flow call for improvement tips ---
       // Example:
       // const tipsResult = await getReachImprovementTips({
       //   contentDetails: futureReachData,
       //   prediction: reachPredictionResult,
       // });
       // setReachTips(tipsResult.tips);

       await new Promise(resolve => setTimeout(resolve, 2000)); // Simulate API delay
       const placeholderTips = `To potentially improve reach for "${futureReachData.contentType}":\n- Optimize Title & Thumbnail: Use keywords related to '${futureReachData.description.substring(0, 20)}...' and create a compelling thumbnail.\n- Promote Actively: Share on social media platforms relevant to your target audience immediately after posting.\n- Engage Early: Respond to initial comments quickly to boost engagement signals.\n- Collaboration: Consider collaborating with another creator in a similar niche if applicable.\n- Analyze Audience Retention: Check YouTube Analytics for drop-off points in similar past videos.`;
       setReachTips(placeholderTips);

     } catch (err) {
       const message = err instanceof Error ? err.message : "Failed to fetch improvement tips.";
       setReachError(message);
     } finally {
       setTipsLoading(false);
     }
   };

   // Prepare data for the chart
   const chartData = reachPredictionResult.views !== null ? [
      { name: 'Views', value: reachPredictionResult.views, fill: 'hsl(var(--chart-1))' },
      { name: 'Likes', value: reachPredictionResult.likes, fill: 'hsl(var(--chart-2))' },
      { name: 'Comments', value: reachPredictionResult.comments, fill: 'hsl(var(--chart-3))' },
   ] : [];

   const chartConfig = {
     views: { label: 'Views', color: 'hsl(var(--chart-1))' },
     likes: { label: 'Likes', color: 'hsl(var(--chart-2))' },
     comments: { label: 'Comments', color: 'hsl(var(--chart-3))' },
   };


   if (!isClient) {
     // Render skeleton or null during SSR/hydration
     return null; // Or a loading skeleton component
   }

  return (
    <div className="container mx-auto px-4 py-8 space-y-16"> {/* Increased spacing */}

       {/* Header Section */}
       <section className="text-center pt-8 pb-8 md:pt-12 md:pb-12">
         <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-4 bg-gradient-to-r from-primary via-teal-400 to-teal-600 bg-clip-text text-transparent">
           Predict & Optimize Your Content
         </h1>
         <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto">
           Leverage AI to understand audience sentiment and forecast the potential reach of your next big video idea.
           {!isLoggedIn && <span className="text-sm block text-primary mt-1">(First prediction/analysis is free! Login for unlimited access.)</span>}
         </p>
       </section>

        {/* Features Section (Placeholder) */}
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
            img="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSYnF6p676M9K1mS9VvH7W5R7qfE5C8P7D8Vw&s" // Use provided image URL
            hint="comments feedback sentiment analysis"
          />
          <FeatureCard
            icon={Lightbulb}
            title="Actionable Improvement Ideas"
            description="Get AI-powered suggestions on how to make your next video even better based on feedback."
            img="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSYnF6p676M9K1mS9VvH7W5R7qfE5C8P7D8Vw&s" // Use provided image URL
            hint="lightbulb ideas improvement suggestions"
          />
           <FeatureCard
             icon={TrendingUp}
             title="Future Reach Prediction (Beta)"
             description="Estimate the potential viewership of your planned content based on topic and your channel stats."
             img="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSYnF6p676M9K1mS9VvH7W5R7qfE5C8P7D8Vw&s" // Use provided image URL
             hint="graph trending up prediction forecast"
           />
        </div>
       </section>

       {/* --- YouTube Comment Analyzer Section --- */}
       <section id="comment-analyzer" className="space-y-8 scroll-mt-20"> {/* Added scroll-mt for potential anchor links */}
          <h2 className="text-3xl md:text-4xl font-bold text-center">YouTube Comment Analyzer</h2>
          <Card className="max-w-4xl mx-auto"> {/* Centered card */}
            <CardHeader className="text-center">
              <Youtube className="h-12 w-12 mx-auto text-primary mb-2" />
              <CardTitle className="text-2xl font-bold">Analyze Audience Feedback</CardTitle>
              <CardDescription className="text-md text-muted-foreground">
                Paste a YouTube video URL to get an AI-powered summary of the comments.
                {!isLoggedIn && <span className="text-sm block text-primary">(First analysis is free! Login for unlimited access.)</span>}
              </CardDescription>
            </CardHeader>
            <CardContent className="max-w-2xl mx-auto space-y-6">
              <div
                className="border-2 border-dashed border-border rounded-lg p-6 text-center bg-muted/30 hover:border-primary transition-colors cursor-copy"
                onDragOver={(e) => e.preventDefault()}
                onDrop={handleDrop}
              >
                <Input
                  type="url" // Use url type for better semantics
                  value={url}
                  onChange={(e) => { setUrl(e.target.value); setError(""); }} // Clear error on change
                  placeholder="Paste or drop YouTube URL here"
                  className="text-center text-base" // Adjusted text size
                  aria-label="YouTube Video URL Input"
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
                disabled={loading || geminiLoading} // Disable if either is loading
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Analyzing...
                  </>
                ) : (
                  'Analyze Comments'
                )}
                {!isLoggedIn && predictionCount >= 1 && <span className="ml-2 text-xs">(Login Required)</span>}
              </Button>

              {/* Results Section */}
              {loading && (
                <div className="space-y-4 pt-4">
                  <Skeleton className="h-6 w-1/4" />
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-5/6" />
                  <Skeleton className="h-10 w-1/2" />
                </div>
              )}

              {summary && !loading && (
                <Card className="bg-muted/30">
                   <CardHeader>
                     <CardTitle className="text-xl">AI Analysis Summary</CardTitle>
                   </CardHeader>
                  <CardContent className="space-y-4">
                    <p className="text-sm text-foreground/90 whitespace-pre-wrap">{summary}</p>
                    <Button
                      onClick={handleGeminiRequest}
                      variant="outline"
                      className="w-full"
                      disabled={geminiLoading || loading} // Disable if either is loading
                    >
                      {geminiLoading ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Generating Suggestions...
                        </>
                      ) : (
                        <>
                          <Lightbulb className="mr-2 h-4 w-4" /> Get Improvement Suggestions
                        </>
                      )}
                       {!isLoggedIn && predictionCount >= 1 && <span className="ml-2 text-xs">(Login Required)</span>}
                    </Button>

                    {geminiLoading && (
                      <div className="space-y-2 pt-2">
                        <Skeleton className="h-5 w-1/3" />
                        <Skeleton className="h-4 w-full" />
                        <Skeleton className="h-4 w-full" />
                        <Skeleton className="h-4 w-4/5" />
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

        {/* --- Future Reach Predictor Section --- */}
       <section id="reach-predictor" className="space-y-8 scroll-mt-20">
          <h2 className="text-3xl md:text-4xl font-bold text-center">Future Reach Predictor (Beta)</h2>
          <Card className="max-w-4xl mx-auto"> {/* Centered card */}
            <CardHeader className="text-center">
              <TrendingUp className="h-12 w-12 mx-auto text-primary mb-2" />
              <CardTitle className="text-2xl font-bold">Estimate Your Video's Potential</CardTitle>
              <CardDescription className="text-md text-muted-foreground">
                Provide details about your planned content and current channel stats to get an AI-driven reach prediction.
                {!isLoggedIn && <span className="text-sm block text-primary">(First prediction is free! Login for unlimited access.)</span>}
              </CardDescription>
            </CardHeader>
            <CardContent className="max-w-3xl mx-auto space-y-6">
               <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                      <Label htmlFor="contentType" className="flex items-center gap-1"><Video className="h-4 w-4"/> Content Type / Genre</Label>
                      <Input
                         id="contentType"
                         name="contentType"
                         value={futureReachData.contentType}
                         onChange={handleReachInputChange}
                         placeholder="e.g., Tech Review, Comedy Skit, Travel Vlog"
                         disabled={reachLoading || !isLoggedIn}
                         required
                       />
                  </div>
                  <div className="space-y-2">
                     <Label htmlFor="estimatedCost" className="flex items-center gap-1"><DollarSign className="h-4 w-4"/> Estimated Production Cost ($)</Label>
                      <Input
                         id="estimatedCost"
                         name="estimatedCost"
                         type="number"
                         value={futureReachData.estimatedCost}
                         onChange={handleReachInputChange}
                         placeholder="e.g., 100 (Optional)"
                         disabled={reachLoading || !isLoggedIn}
                       />
                  </div>
               </div>

               <div className="space-y-2">
                 <Label htmlFor="description" className="flex items-center gap-1"><Lightbulb className="h-4 w-4"/> Brief Content Description</Label>
                  <Textarea
                     id="description"
                     name="description"
                     value={futureReachData.description}
                     onChange={handleReachInputChange}
                     placeholder="Describe the video topic, format, and target audience..."
                     rows={3}
                     disabled={reachLoading || !isLoggedIn}
                     required
                   />
               </div>

               <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                   <div className="space-y-2">
                     <Label htmlFor="currentSubs" className="flex items-center gap-1"><Users className="h-4 w-4"/> Current Subscribers</Label>
                      <Input
                         id="currentSubs"
                         name="currentSubs"
                         type="number"
                         value={futureReachData.currentSubs}
                         onChange={handleReachInputChange}
                         placeholder="e.g., 10000 (Optional)"
                         disabled={reachLoading || !isLoggedIn}
                       />
                  </div>
                  <div className="space-y-2">
                     <Label htmlFor="avgViews" className="flex items-center gap-1"><TrendingUp className="h-4 w-4"/> Average Views per Video</Label>
                      <Input
                         id="avgViews"
                         name="avgViews"
                         type="number"
                         value={futureReachData.avgViews}
                         onChange={handleReachInputChange}
                         placeholder="e.g., 5000 (Optional)"
                         disabled={reachLoading || !isLoggedIn}
                       />
                  </div>
               </div>

               {reachError && (
                 <Alert variant="destructive">
                   <Terminal className="h-4 w-4" />
                   <AlertTitle>Prediction Error</AlertTitle>
                   <AlertDescription>{reachError}</AlertDescription>
                 </Alert>
               )}

               <Button
                  onClick={handleReachPrediction}
                  className="w-full"
                  disabled={reachLoading || !isLoggedIn}
                >
                  {reachLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Predicting Reach...
                    </>
                  ) : (
                    'Predict Future Reach'
                  )}
                  {!isLoggedIn && predictionCount >= 1 && <span className="ml-2 text-xs">(Login Required)</span>}
                </Button>

                {/* Prediction Result Section */}
                {reachLoading && (
                   <div className="space-y-4 pt-4 border-t mt-6">
                      <h3 className="text-lg font-semibold">Predicted Reach:</h3>
                      <Skeleton className="h-5 w-1/3" />
                      <Skeleton className="h-4 w-full" />
                      <Skeleton className="h-4 w-5/6" />
                      <div className="h-48 mt-4"><Skeleton className="h-full w-full" /></div> {/* Chart Skeleton */}
                      <Skeleton className="h-10 w-1/2 mt-4" /> {/* Tips Button Skeleton */}
                   </div>
                )}
                {reachPredictionResult.views !== null && !reachLoading && (
                   <Card className="bg-muted/30 mt-6">
                      <CardHeader>
                         <CardTitle className="text-xl flex items-center gap-2"><Target className="h-5 w-5 text-primary"/> Predicted Reach & Engagement</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-6">
                          {/* Numerical Predictions */}
                          <div className="grid grid-cols-3 gap-4 text-center">
                              <div>
                                  <p className="text-xs text-muted-foreground uppercase">Views</p>
                                  <p className="text-2xl font-bold text-primary">{reachPredictionResult.views.toLocaleString()}</p>
                              </div>
                              <div>
                                  <p className="text-xs text-muted-foreground uppercase">Likes</p>
                                  <p className="text-2xl font-bold">{reachPredictionResult.likes.toLocaleString()}</p>
                              </div>
                              <div>
                                  <p className="text-xs text-muted-foreground uppercase">Comments</p>
                                  <p className="text-2xl font-bold">{reachPredictionResult.comments.toLocaleString()}</p>
                              </div>
                          </div>

                         {/* Bar Chart Visualization */}
                         <div className="h-[200px] mt-4">
                           <ChartContainer config={chartConfig} className="w-full h-full">
                             <RechartsBarChart accessibilityLayer data={chartData} layout="vertical" margin={{ left: 10, right: 10 }}>
                               <CartesianGrid horizontal={false} />
                               <XAxis type="number" hide />
                               <YAxis dataKey="name" type="category" tickLine={false} axisLine={false} tickMargin={10} width={60} />
                               <ChartTooltip cursor={false} content={<ChartTooltipContent hideLabel />} />
                               <Bar dataKey="value" radius={5} />
                             </RechartsBarChart>
                           </ChartContainer>
                         </div>

                         {/* Prediction Description */}
                         <p className="text-sm text-foreground/90 whitespace-pre-wrap mt-4">{reachPredictionResult.description}</p>
                         <p className="text-xs text-muted-foreground mt-2">*Disclaimer: This is an AI-generated estimate and actual results may vary.*</p>

                         {/* Improvement Tips Button & Section */}
                         <Button
                             onClick={handleGetTips}
                             variant="outline"
                             className="w-full mt-4"
                             disabled={tipsLoading || !isLoggedIn}
                          >
                             {tipsLoading ? (
                               <>
                                 <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Generating Tips...
                               </>
                             ) : (
                               <>
                                 <Lightbulb className="mr-2 h-4 w-4" /> Get Improvement Tips
                               </>
                             )}
                              {!isLoggedIn && predictionCount >= 1 && <span className="ml-2 text-xs">(Login Required)</span>}
                          </Button>

                          {tipsLoading && (
                            <div className="space-y-2 pt-2 mt-4">
                              <Skeleton className="h-5 w-1/3" />
                              <Skeleton className="h-4 w-full" />
                              <Skeleton className="h-4 w-full" />
                              <Skeleton className="h-4 w-4/5" />
                            </div>
                          )}

                          {reachTips && !tipsLoading && (
                            <div className="pt-4 mt-4 border-t">
                              <h3 className="text-lg font-semibold mb-2 flex items-center gap-2"><Lightbulb className="h-5 w-5 text-primary"/> Improvement Tips</h3>
                              <p className="text-sm text-foreground/90 whitespace-pre-wrap">{reachTips}</p>
                            </div>
                          )}
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
