'use client'; // Add this directive

import React, { useState, useEffect } from "react"; // Import useEffect
import { Button } from '@/components/ui/button'; // Import Shadcn Button
import { Input } from '@/components/ui/input'; // Import Shadcn Input
import { Textarea } from '@/components/ui/textarea'; // Import Shadcn Textarea
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'; // Import Shadcn Card
import { Skeleton } from '@/components/ui/skeleton'; // Import Skeleton
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"; // Import Alert
import { Terminal, Youtube, Lightbulb, Loader2, LogIn } from "lucide-react"; // Import icons
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
      // const response = await fetch(
      //   `http://127.0.0.1:5000/get_comments_summary?videoLink=${encodeURIComponent(url)}`
      // );
      // if (!response.ok) {
      //   throw new Error("Failed to analyze comments");
      // }
      // const data = await response.json();
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

      // Example structure (replace with actual Genkit flow):
      // import { getImprovementSuggestions } from '@/ai/flows/get-suggestions-flow'; // Assuming you create this flow
      // const suggestionsResult = await getImprovementSuggestions({ commentSummary: summary });
      // setGeminiResponse(suggestionsResult.suggestions); // Adjust based on your flow's output schema

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

   if (!isClient) {
     // Render skeleton or null during SSR/hydration
     return null; // Or a loading skeleton component
   }

  return (
    <div className="container mx-auto px-4 py-8 space-y-8">
       <Card>
         <CardHeader className="text-center">
           <Youtube className="h-12 w-12 mx-auto text-primary mb-2" />
           <CardTitle className="text-3xl font-bold">YouTube Comment Analyzer</CardTitle>
           <CardDescription className="text-lg text-muted-foreground">
             Paste a YouTube video URL to get an AI-powered summary of the comments and suggestions for improvement.
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

        {/* Login Required Alert Dialog */}
        <AlertDialog open={showLoginAlert} onOpenChange={setShowLoginAlert}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle className="flex items-center gap-2"><LogIn className="h-5 w-5"/> Login Required</AlertDialogTitle>
              <AlertDialogDescription>
                 You've used your free analysis/suggestion request. Please log in or sign up to continue using this feature without limits.
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
