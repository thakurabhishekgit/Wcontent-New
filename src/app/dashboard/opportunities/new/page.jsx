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
import { Checkbox } from "@/components/ui/checkbox";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Terminal, CheckCircle, Loader2 } from "lucide-react";

// Define Zod schema for form validation
const opportunitySchema = z.object({
  title: z.string().min(5, { message: "Title must be at least 5 characters." }).max(100, { message: "Title cannot exceed 100 characters." }),
  description: z.string().min(20, { message: "Description must be at least 20 characters." }).max(1500, { message: "Description cannot exceed 1500 characters." }),
  requirements: z.string().min(10, { message: "Requirements must be at least 10 characters." }).max(1000, { message: "Requirements cannot exceed 1000 characters." }),
  location: z.string().min(3, { message: "Location must be at least 3 characters." }).max(100, { message: "Location cannot exceed 100 characters." }),
  type: z.string().min(1, { message: "Please select an opportunity type." }),
  salaryRange: z.string().min(1, { message: "Salary/Budget is required." }).max(50, { message: "Salary/Budget cannot exceed 50 characters." }),
  email: z.string().email({ message: "Please enter a valid contact email address." }),
  isFilled: z.boolean().default(false).optional(),
});


export default function NewOpportunityPage() {
  const [error, setError] = useState(null);
  const [message, setMessage] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isClient, setIsClient] = useState(false);
  const router = useRouter();

   useEffect(() => {
    setIsClient(true); // Component has mounted
   }, []);

  const form = useForm({
    resolver: zodResolver(opportunitySchema),
    defaultValues: {
      title: "",
      description: "",
      requirements: "",
      location: "",
      type: "",
      salaryRange: "",
      email: "",
      isFilled: false,
    },
  });

  const onSubmit = async (data) => {
    setError(null);
    setMessage(null);
    setIsSubmitting(true);

    const token = localStorage.getItem("token");
    const userId = localStorage.getItem("id");

    if (!token || !userId) {
      setError("Authentication failed. Please log in again.");
      setIsSubmitting(false);
      return;
    }

    try {
      const response = await fetch(
        `http://localhost:3001/api/users/opportunities/opportunity/${userId}`, // Use deployed URL
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(data),
        }
      );

      if (response.ok) {
        setMessage("Opportunity posted successfully!");
        form.reset(); // Clear form fields
        // Optionally redirect after success
        // router.push('/dashboard/opportunities/myopportunities');
      } else {
        const errorData = await response.json().catch(() => ({ message: "Failed to post opportunity. Please check your input." }));
        setError(errorData.message || "Failed to post opportunity.");
      }
    } catch (err) {
      console.error("Error posting opportunity:", err);
      let fetchErrorMessage = "An unexpected error occurred. Please try again.";
      if (isClient && err instanceof TypeError && err.message.includes('fetch')) {
         // Updated error message to reflect deployed URL
         fetchErrorMessage = `Error posting opportunity. Could not connect to the server at http://localhost:3001. Please ensure the backend is running and CORS is configured correctly.`;
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
        <CardTitle>Post a New Opportunity</CardTitle>
        <CardDescription>Share a paid gig, project, or role with content creators.</CardDescription>
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
                  <FormLabel>Opportunity Title</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., Tech Gadget Review Video" {...field} disabled={isSubmitting} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Provide a detailed description of the opportunity, responsibilities, deliverables, etc."
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

             <FormField
              control={form.control}
              name="requirements"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Requirements</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="List necessary skills, experience, equipment, audience size, etc."
                      className="resize-none"
                      rows={3}
                      {...field}
                      disabled={isSubmitting}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <FormField
                control={form.control}
                name="location"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Location</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., Remote, New York, Bali (Travel Provided)" {...field} disabled={isSubmitting} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="type"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Opportunity Type</FormLabel>
                     <Select onValueChange={field.onChange} defaultValue={field.value} disabled={isSubmitting}>
                       <FormControl>
                         <SelectTrigger>
                           <SelectValue placeholder="Select type" />
                         </SelectTrigger>
                       </FormControl>
                       <SelectContent>
                         <SelectItem value="Paid Gig">Paid Gig</SelectItem>
                         <SelectItem value="Sponsored Content">Sponsored Content</SelectItem>
                         <SelectItem value="Travel Opportunity">Travel Opportunity</SelectItem>
                         <SelectItem value="Product Review">Product Review</SelectItem>
                          <SelectItem value="Full-Time Role">Full-Time Role</SelectItem>
                          <SelectItem value="Part-Time Role">Part-Time Role</SelectItem>
                          <SelectItem value="Contract Role">Contract Role</SelectItem>
                         <SelectItem value="Other">Other</SelectItem>
                       </SelectContent>
                     </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="salaryRange"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Salary / Budget</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., $500, Expenses Covered + Fee, Negotiable" {...field} disabled={isSubmitting} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Contact Email</FormLabel>
                  <FormControl>
                    <Input type="email" placeholder="Email address for applications" {...field} disabled={isSubmitting} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

             <FormField
                control={form.control}
                name="isFilled"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4 shadow">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                         disabled={isSubmitting}
                      />
                    </FormControl>
                    <div className="space-y-1 leading-none">
                      <FormLabel>
                         Mark as Filled
                      </FormLabel>
                      <p className="text-xs text-muted-foreground">
                        Check this if the opportunity is no longer available.
                      </p>
                    </div>
                     <FormMessage />
                  </FormItem>
                )}
              />


            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Posting...
                </>
              ) : (
                'Post Opportunity'
              )}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}

    