'use client'; // Add this directive

import React, { useState, useEffect } from "react"; // Import useEffect
import Image from 'next/image'; // Import Image
import { Button } from '@/components/ui/button'; // Import Shadcn Button
import { Input } from '@/components/ui/input'; // Import Shadcn Input
import { Textarea } from '@/components/ui/textarea'; // Import Shadcn Textarea
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card'; // Import Shadcn Card
import { Skeleton } from '@/components/ui/skeleton'; // Import Skeleton
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"; // Import Alert
import { Terminal, Youtube, Lightbulb, Loader2, LogIn, Search, TrendingUp, DollarSign, Users, Video, Target } from "lucide-react"; // Import icons
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
  const [reachPrediction, setReachPrediction] = useState("");
  const [reachError, setReachError] = useState("");

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
    setReachPrediction("");

    try {
      // --- IMPORTANT: Replace with your Genkit Flow call for reach prediction ---
      // This requires a new Genkit flow that takes channel stats and content details.
      // Example structure:
      // import { predictVideoReach } from '@/ai/flows/predict-reach-flow'; // Assuming you create this flow
      // const predictionResult = await predictVideoReach(futureReachData);
      // setReachPrediction(predictionResult.predictedReach); // Adjust based on flow output

      await new Promise(resolve => setTimeout(resolve, 2500)); // Simulate API delay
      const randomReach = Math.floor(Math.random() * (50000 - 5000 + 1)) + 5000;
      const placeholderPrediction = `Based on the provided details and current (simulated) stats, the estimated reach for this content is around ${randomReach.toLocaleString()} views within the first month. Factors like promotion and audience engagement could influence this.`;
      setReachPrediction(placeholderPrediction);

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
            img="https://picsum.photos/400/250?random=13"
            hint="comments feedback sentiment analysis"
          />
          <FeatureCard
            icon={Lightbulb}
            title="Actionable Improvement Ideas"
            description="Get AI-powered suggestions on how to make your next video even better based on feedback."
            img="https://picsum.photos/400/250?random=14"
            hint="lightbulb ideas improvement suggestions"
          />
           <FeatureCard
             icon={TrendingUp}
             title="Future Reach Prediction (Beta)"
             description="Estimate the potential viewership of your planned content based on topic and your channel stats."
             img="https://picsum.photos/400/250?random=15"
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
                {!isLoggedIn && predictionCount > 0 && <span className="ml-2 text-xs">(Login Required)</span>}
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
                       {!isLoggedIn && predictionCount > 0 && <span className="ml-2 text-xs">(Login Required)</span>}
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
                {!isLoggedIn && <span className="text-sm block text-primary">(Login required to use this feature.)</span>}
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
                  {!isLoggedIn && <span className="ml-2 text-xs">(Login Required)</span>}
                </Button>

                {/* Prediction Result */}
                {reachLoading && (
                   <div className="space-y-4 pt-4 border-t mt-6">
                      <h3 className="text-lg font-semibold">Predicted Reach:</h3>
                      <Skeleton className="h-5 w-1/3" />
                      <Skeleton className="h-4 w-full" />
                      <Skeleton className="h-4 w-5/6" />
                   </div>
                )}
                {reachPrediction && !reachLoading && (
                   <Card className="bg-muted/30 mt-6">
                      <CardHeader>
                         <CardTitle className="text-xl flex items-center gap-2"><Target className="h-5 w-5 text-primary"/> Predicted Reach</CardTitle>
                      </CardHeader>
                      <CardContent>
                         <p className="text-sm text-foreground/90 whitespace-pre-wrap">{reachPrediction}</p>
                         <p className="text-xs text-muted-foreground mt-2">*Disclaimer: This is an AI-generated estimate and actual results may vary.*</p>
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
