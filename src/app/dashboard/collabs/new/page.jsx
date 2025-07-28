'use client';

import React, { useState, useEffect } from "react";
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Terminal, CheckCircle, Loader2 } from "lucide-react";

// Define Zod schema for form validation
const collabSchema = z.object({
  title: z.string().min(5, { message: "Title must be at least 5 characters." }).max(100, { message: "Title cannot exceed 100 characters." }),
  contentCategory: z.string().min(1, { message: "Please select a content category." }),
  collaborationType: z.string().min(1, { message: "Please select a collaboration type." }),
  description: z.string().min(20, { message: "Description must be at least 20 characters." }).max(1000, { message: "Description cannot exceed 1000 characters." }),
  timeline: z.string().min(3, { message: "Timeline must be at least 3 characters." }).max(50, { message: "Timeline cannot exceed 50 characters." }),
  email: z.string().email({ message: "Please enter a valid email address." }),
});

export default function PostCollabPage() {
  const [error, setError] = useState(null);
  const [message, setMessage] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isClient, setIsClient] = useState(false);
  const router = useRouter();

  useEffect(() => {
    setIsClient(true); // Component has mounted
  }, []);

  const form = useForm({
    resolver: zodResolver(collabSchema),
    defaultValues: {
      title: "",
      contentCategory: "",
      collaborationType: "",
      description: "",
      timeline: "",
      email: "",
    },
  });

  const onSubmit = async (data) => {
    setError(null);
    setMessage(null);
    setIsSubmitting(true);

    const token = localStorage.getItem("token");
    // userId is likely still needed by the backend, possibly inferred from the token or required in the body
    const userId = localStorage.getItem("id");

    if (!token || !userId) { // Keep userId check as it might be needed in payload
      setError("Authentication failed. Please log in again.");
      setIsSubmitting(false);
      return;
    }

    try {
      // Updated endpoint: use deployed URL
      const response = await fetch(
        `http://localhost:3001/api/users/collabration/addCollab/${userId}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          // Include necessary data in the body, potentially userId if backend requires it here now
          body: JSON.stringify({ ...data, open: true, creatorId: userId }), // Example: Adding creatorId to body
        }
      );

      if (response.ok) {
        setMessage("Collaboration posted successfully!");
        form.reset(); // Clear form fields
        // Optionally redirect after success
        // router.push('/dashboard/collabs/myrequests');
      } else {
        const errorData = await response.json().catch(() => ({ message: "Failed to post collaboration. Please check your input." }));
        setError(errorData.message || "Failed to post collaboration.");
      }
    } catch (err) {
      console.error("Error posting collaboration:", err);
      let fetchErrorMessage = "An unexpected error occurred. Please try again.";
      if (isClient && err instanceof TypeError && err.message.includes('fetch')) {
         // Updated error message to reflect deployed URL
         fetchErrorMessage = `Error posting collaboration. Could not connect to the server at http://localhost:3001. Please ensure the backend is running and CORS is configured correctly.`;
      }
      setError(fetchErrorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

   if (!isClient) {
     return null; // Or a loading spinner/skeleton
   }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Post a New Collaboration</CardTitle>
        <CardDescription>Share your collaboration idea with the community.</CardDescription>
      </CardHeader>
      <CardContent>
        {error && (
          <Alert variant="destructive" className="mb-4">
            <Terminal className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
        {message && (
           <Alert variant="default" className="mb-4 bg-green-100 dark:bg-green-900/30 border-green-300 dark:border-green-700 text-green-700 dark:text-green-300">
             <CheckCircle className="h-4 w-4 text-current" />
             <AlertTitle className="text-current font-semibold">Success</AlertTitle>
             <AlertDescription className="text-current">{message}</AlertDescription>
           </Alert>
        )}
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Collaboration Title</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., Joint YouTube Video - Comedy Skit" {...field} disabled={isSubmitting} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
               <FormField
                 control={form.control}
                 name="contentCategory"
                 render={({ field }) => (
                   <FormItem>
                     <FormLabel>Content Category / Niche</FormLabel>
                     <Select onValueChange={field.onChange} defaultValue={field.value} disabled={isSubmitting}>
                       <FormControl>
                         <SelectTrigger>
                           <SelectValue placeholder="Select a category" />
                         </SelectTrigger>
                       </FormControl>
                       <SelectContent>
                         <SelectItem value="Comedy">Comedy</SelectItem>
                         <SelectItem value="Gaming">Gaming</SelectItem>
                         <SelectItem value="Tech">Tech</SelectItem>
                         <SelectItem value="Beauty">Beauty</SelectItem>
                         <SelectItem value="Fashion">Fashion</SelectItem>
                         <SelectItem value="Lifestyle">Lifestyle</SelectItem>
                         <SelectItem value="Education">Education</SelectItem>
                         <SelectItem value="Music">Music</SelectItem>
                         <SelectItem value="Travel">Travel</SelectItem>
                          <SelectItem value="Food">Food</SelectItem>
                          <SelectItem value="Fitness">Fitness</SelectItem>
                          <SelectItem value="Wellness">Wellness</SelectItem>
                         <SelectItem value="Other">Other</SelectItem>
                       </SelectContent>
                     </Select>
                     <FormMessage />
                   </FormItem>
                 )}
               />

               <FormField
                 control={form.control}
                 name="collaborationType"
                 render={({ field }) => (
                   <FormItem>
                     <FormLabel>Collaboration Type</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value} disabled={isSubmitting}>
                       <FormControl>
                         <SelectTrigger>
                           <SelectValue placeholder="Select collab type" />
                         </SelectTrigger>
                       </FormControl>
                       <SelectContent>
                          <SelectItem value="Video Collab">Video Collab (YouTube, TikTok, etc.)</SelectItem>
                          <SelectItem value="Podcast Guest Swap">Podcast Guest Swap</SelectItem>
                          <SelectItem value="Instagram Collab">Instagram Collab (Live, Post, Reels)</SelectItem>
                          <SelectItem value="Blog Post Collab">Blog Post Collab</SelectItem>
                          <SelectItem value="Event/Workshop">Joint Event/Workshop</SelectItem>
                          <SelectItem value="Challenge/Giveaway">Challenge/Giveaway</SelectItem>
                          <SelectItem value="Other">Other</SelectItem>
                       </SelectContent>
                     </Select>
                     <FormMessage />
                   </FormItem>
                 )}
               />
             </div>

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Describe the collaboration goal, what you're looking for, and any specific requirements..."
                      className="resize-none"
                      rows={5}
                      {...field}
                      disabled={isSubmitting}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
               <FormField
                 control={form.control}
                 name="timeline"
                 render={({ field }) => (
                   <FormItem>
                     <FormLabel>Expected Timeline</FormLabel>
                     <FormControl>
                       <Input placeholder="e.g., Next month, Flexible, Within 2 weeks" {...field} disabled={isSubmitting} />
                     </FormControl>
                     <FormMessage />
                   </FormItem>
                 )}
               />

               <FormField
                 control={form.control}
                 name="email"
                 render={({ field }) => (
                   <FormItem>
                     <FormLabel>Contact Email</FormLabel>
                     <FormControl>
                       <Input type="email" placeholder="Your contact email for interested collaborators" {...field} disabled={isSubmitting} />
                     </FormControl>
                     <FormMessage />
                   </FormItem>
                 )}
               />
            </div>

            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Posting...
                </>
              ) : (
                'Post Collaboration'
              )}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}

    