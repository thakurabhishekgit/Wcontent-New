'use client';

import React, { useState, useEffect } from "react";
import axios from "axios";
import Link from 'next/link';
import Image from 'next/image'; // Import Image
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Search, Filter, Users as UsersIcon, Target, Clock, X, MessageSquare, CalendarDays, Mail, User, ArrowRight, Star, Handshake, Zap, Users, LogIn } from "lucide-react"; // Added more icons, added LogIn
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter, DialogClose } from "@/components/ui/dialog"; // Import Dialog components
import { Label } from "@/components/ui/label"; // Import Label
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

// Sidebar Filters Component
const FilterSidebar = ({ filters, setFilters, applyFilters }) => {
  const handleSelectChange = (name, value) => {
    setFilters(prev => ({ ...prev, [name]: value === 'all' ? '' : value }));
  };

  const handleInputChange = (e) => {
     setFilters(prev => ({ ...prev, [e.target.name]: e.target.value }));
  }

  const clearFilters = () => {
     setFilters({ contentCategory: '', collaborationType: '', timeline: '' });
     applyFilters({ contentCategory: '', collaborationType: '', timeline: '' }); // Apply cleared filters
   };

  // Dummy categories and types for filters - Replace with dynamic data if available
  const contentCategories = ["Comedy", "Gaming", "Tech", "Beauty", "Fashion", "Lifestyle", "Education", "Music", "Travel", "Food", "Fitness", "Wellness", "Other"];
  const collaborationTypes = ["Video Collab", "Podcast Guest Swap", "Instagram Collab", "Blog Post Collab", "Event/Workshop", "Challenge/Giveaway", "Other"];

  return (
    <Card className="sticky top-20 self-start">
      <CardHeader>
        <CardTitle className="text-lg flex items-center gap-2">
          <Filter className="h-5 w-5" /> Filters
        </CardTitle>
        <CardDescription>Find the perfect collab</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Content Category Filter */}
        <div className="space-y-1">
          <Label htmlFor="category-filter">Category / Niche</Label>
          <Select
             value={filters.contentCategory || 'all'}
             onValueChange={(value) => handleSelectChange('contentCategory', value)}
             id="category-filter"
             name="contentCategory"
          >
            <SelectTrigger>
              <SelectValue placeholder="Select category" />
            </SelectTrigger>
            <SelectContent>
               <SelectItem value="all">All Categories</SelectItem>
               {contentCategories.map(cat => <SelectItem key={cat} value={cat}>{cat}</SelectItem>)}
            </SelectContent>
          </Select>
        </div>

        {/* Collaboration Type Filter */}
        <div className="space-y-1">
           <Label htmlFor="type-filter">Collab Type</Label>
           <Select
              value={filters.collaborationType || 'all'}
              onValueChange={(value) => handleSelectChange('collaborationType', value)}
              id="type-filter"
              name="collaborationType"
           >
             <SelectTrigger>
               <SelectValue placeholder="Select type" />
             </SelectTrigger>
             <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                {collaborationTypes.map(type => <SelectItem key={type} value={type}>{type}</SelectItem>)}
             </SelectContent>
           </Select>
        </div>

         {/* Timeline Filter (Input for keyword) */}
         <div className="space-y-1">
            <Label htmlFor="timeline-filter">Timeline (Keyword)</Label>
            <Input
              id="timeline-filter"
              name="timeline"
              placeholder="e.g., Next Month, Flexible"
              value={filters.timeline || ''}
              onChange={handleInputChange}
            />
         </div>

      </CardContent>
       <CardFooter className="flex flex-col gap-2">
           <Button onClick={() => applyFilters(filters)} className="w-full">Apply Filters</Button>
           {(filters.contentCategory || filters.collaborationType || filters.timeline) && (
              <Button variant="outline" onClick={clearFilters} className="w-full flex items-center gap-1 text-xs">
                 <X className="h-3 w-3"/> Clear Filters
              </Button>
           )}
       </CardFooter>
    </Card>
  );
};

// Function to format date
const formatDate = (dateString) => {
   if (!dateString) return 'N/A';
   try {
     return new Date(dateString).toLocaleDateString('en-US', {
       year: 'numeric', month: 'short', day: 'numeric'
     });
   } catch (e) {
     return 'Invalid Date';
   }
 };

// Dummy Collab Data
const dummyCollabs = [
    { id: 101, title: 'Dummy Comedy Skit Collab', creatorName: 'Comedy Central Lite', niche: 'Comedy', platform: 'YouTube', postedDate: '1 day ago', goal: 'Cross-promote channels', lookingFor: 'Comedy channel with 5k+ subs', details: 'Looking for a partner for a short, funny skit. Must be able to film remotely.', channelLink: '#', creatorProfileLink: '#' },
    { id: 102, title: 'Dummy Wellness Instagram Live', creatorName: 'Mindful Moments', niche: 'Wellness', platform: 'Instagram', postedDate: '2 days ago', goal: 'Share tips, build community', lookingFor: 'Yoga instructor or meditation guide', details: 'Joint IG Live session on managing stress. Approx 30 mins.', channelLink: '#', creatorProfileLink: '#' },
    { id: 103, title: 'Dummy Tech Podcast Guest Spot', creatorName: 'Tech Talk Today', niche: 'Tech', platform: 'Podcast', postedDate: '3 days ago', goal: 'Discuss new AI trends', lookingFor: 'AI expert or developer', details: 'Seeking knowledgeable guest for a 45-min podcast episode on recent AI advancements.', channelLink: '#', creatorProfileLink: '#' }
];


export default function CollaborationsPage() {
  const [collaborations, setCollaborations] = useState([]);
  const [filteredCollaborations, setFilteredCollaborations] = useState([]);
  const [selectedCollaboration, setSelectedCollaboration] = useState(null);
  const [application, setApplication] = useState({
    requesterName: "", // Match backend schema
    requesterEmail: "", // Match backend schema
    message: "", // Match backend schema
    appliedDate: new Date().toISOString().split("T")[0], // Assuming backend handles date
  });
  const [submissionStatus, setSubmissionStatus] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filters, setFilters] = useState({ contentCategory: '', collaborationType: '', timeline: '' });
  const [isClient, setIsClient] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showLoginAlert, setShowLoginAlert] = useState(false);
  const router = useRouter();


  useEffect(() => {
    setIsClient(true);
    const token = localStorage.getItem('token');
    setIsLoggedIn(!!token);
    fetchCollaborations(!!token); // Pass login status to fetch function
  }, []);

  // Apply search and filters whenever collaborations, searchTerm, or filters change
  useEffect(() => {
    if (collaborations.length > 0) { // Avoid running on initial empty array
      applyFilters(filters);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [collaborations]); // Re-apply if base data changes

  const fetchCollaborations = async (loggedIn) => {
    setIsLoading(true);
    setError(null);
    try {
       if (loggedIn) {
          // Fetch real data if logged in
          const response = await axios.get(
            "http://localhost:3001/api/users/collabration/getCollabOfAllUsers"
          );
          if (Array.isArray(response.data)) {
             const collaborationsWithId = response.data.map(collab => ({
                ...collab,
                id: collab._id || collab.id // Use _id primarily, fallback to id
             }));
            setCollaborations(collaborationsWithId);
            setFilteredCollaborations(collaborationsWithId); // Initialize filtered list
          } else {
            console.error("API response is not an array:", response.data);
            setError("Received invalid data format from the server.");
            setCollaborations([]);
            setFilteredCollaborations([]);
          }
       } else {
            // Show dummy data if not logged in
            await new Promise(resolve => setTimeout(resolve, 500)); // Simulate loading
            setCollaborations(dummyCollabs);
            setFilteredCollaborations(dummyCollabs);
       }
    } catch (error) {
      console.error("Error fetching collaborations:", error);
       if (loggedIn) {
          setError("Failed to fetch collaborations. Please check the API endpoint and your connection.");
       } else {
          setError("Failed to load collaboration data. Displaying examples."); // Error for dummy data scenario
          setCollaborations(dummyCollabs); // Fallback to dummy on error
          setFilteredCollaborations(dummyCollabs);
       }
       // Ensure lists are empty if not falling back to dummy data on error
       if (loggedIn) {
          setCollaborations([]);
          setFilteredCollaborations([]);
       }
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
     applyFilters(filters, e.target.value); // Apply filters immediately with new search term
  };

  // Function to apply filters and search term
  const applyFilters = (currentFilters, currentSearchTerm = searchTerm) => {
      let tempCollaborations = [...collaborations];

      // Apply search term first
      if (currentSearchTerm) {
         const lowerSearchTerm = currentSearchTerm.toLowerCase();
         tempCollaborations = tempCollaborations.filter(collab =>
           collab.title?.toLowerCase().includes(lowerSearchTerm) ||
           collab.description?.toLowerCase().includes(lowerSearchTerm) ||
           collab.creatorName?.toLowerCase().includes(lowerSearchTerm) // Assuming creatorName exists
         );
      }

      // Apply filters
      if (currentFilters.contentCategory) {
         tempCollaborations = tempCollaborations.filter(collab => collab.contentCategory?.toLowerCase() === currentFilters.contentCategory.toLowerCase());
      }
      if (currentFilters.collaborationType) {
         tempCollaborations = tempCollaborations.filter(collab => collab.collaborationType?.toLowerCase() === currentFilters.collaborationType.toLowerCase());
      }
      if (currentFilters.timeline) {
         tempCollaborations = tempCollaborations.filter(collab => collab.timeline?.toLowerCase().includes(currentFilters.timeline.toLowerCase()));
      }


      setFilteredCollaborations(tempCollaborations);
   };


  const handleCardClick = (collaboration) => {
    if (!isLoggedIn) {
      setShowLoginAlert(true); // Show login required alert
    } else {
      setSelectedCollaboration(collaboration);
      setSubmissionStatus(null); // Reset submission status
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setApplication({ ...application, [name]: value });
  };

  const handleApply = async (e) => {
    e.preventDefault();
    if (!selectedCollaboration || !isLoggedIn) return; // Ensure logged in

    setSubmissionStatus('Submitting...');

    try {
      // Ensure selectedCollaboration.id exists (using the mapped 'id' which is _id)
      if (!selectedCollaboration.id && selectedCollaboration.id !== 0) { // Check for 0 just in case
          throw new Error("Selected collaboration is missing an ID.");
      }
      const collabIdToUse = selectedCollaboration.id;
      const token = localStorage.getItem('token'); // Get token for auth
      const userId = localStorage.getItem('id'); // Get user ID

      // Prepare payload matching backend expectations
       const payload = {
         requesterName: application.requesterName,
         requesterEmail: application.requesterEmail,
         message: application.message,
         appliedDate: application.appliedDate, // Send date if required by backend
         requesterId: userId || null // Include requester ID
       };

      const response = await axios.post(
        `http://localhost:3001/api/users/collabration/applyForCollab/${collabIdToUse}`,
        payload, // Send the prepared payload
        { // Add Authorization header
            headers: {
              Authorization: `Bearer ${token}`
            }
        }
      );
      setSubmissionStatus("Application submitted successfully!");
      setApplication({ // Reset form
        requesterName: "",
        requesterEmail: "",
        message: "",
        appliedDate: new Date().toISOString().split("T")[0],
      });
       // Close the dialog after successful application
       setTimeout(() => {
          setSelectedCollaboration(null);
       }, 1500); // Close after 1.5 seconds
    } catch (error) {
      console.error("Error applying for collaboration:", error);
      const errorMessage = error.response?.data?.message || "Failed to submit application. Please try again.";
      setSubmissionStatus(errorMessage);
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
           Connect & Collaborate
         </h1>
         <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto">
           Find fellow content creators for joint projects, cross-promotions, and creative partnerships.
            {!isLoggedIn && <span className="text-sm block text-primary mt-1">(Login to view and apply to all collaborations)</span>}
         </p>
       </section>

       {/* Features Section */}
       <section className="space-y-12">
        <div className="text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-3">Why Collaborate on WContent?</h2>
          <p className="text-muted-foreground max-w-xl mx-auto">Expand your reach, spark creativity, and build your network.</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {[
            { icon: UsersIcon, title: 'Find Partners', description: 'Discover creators in your niche or explore new ones.', hint: 'collaboration network people' },
            { icon: Zap, title: 'Spark Creativity', description: 'Brainstorm ideas and create unique content together.', hint: 'lightbulb innovation ideas' },
            { icon: Target, title: 'Reach New Audiences', description: 'Cross-promote to grow your combined following.', hint: 'audience growth charts' },
            { icon: Handshake, title: 'Build Relationships', description: 'Network with peers and build lasting partnerships.', hint: 'partnership agreement deal' },
          ].map((feature, index) => (
            <Card key={index} className="flex flex-col overflow-hidden hover:shadow-lg transition-shadow duration-300">
              <CardHeader>
                <feature.icon className="h-8 w-8 mb-2 text-primary" />
                <CardTitle>{feature.title}</CardTitle>
                <CardDescription>{feature.description}</CardDescription>
              </CardHeader>
              <CardContent className="flex-grow flex items-end">
                <Image
                  src={`https://picsum.photos/400/250?random=${index}&grayscale&blur=1`} // Use blurred grayscale picsum photos
                  alt={feature.title}
                  data-ai-hint={feature.hint}
                  width={400}
                  height={250}
                  className="rounded-md object-cover w-full h-auto mt-4"
                />
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

       {/* How It Works / Info Section (Simplified for Collabs) */}
       <section className="p-6 mb-12 bg-card rounded-lg border border-border/50 shadow-sm">
         <h2 className="text-xl font-semibold mb-3 text-primary">How Collaborations Work</h2>
         <ul className="list-decimal list-inside space-y-2 text-sm text-muted-foreground">
           <li>Browse collaboration posts or use filters to find potential partners.</li>
           <li>Click 'View & Apply' to learn more about a specific collab idea.</li>
           <li>Log in or sign up to send a message to the creator expressing your interest and ideas.</li>
           <li>Connect and start creating amazing content together!</li>
         </ul>
       </section>


       {/* Main Collaborations Listing Section */}
       <section className="space-y-8">
          <h2 className="text-3xl md:text-4xl font-bold text-center">Explore Collaborations</h2>
          {/* Search and Main Content Area */}
          <div className="flex flex-col md:flex-row gap-8">

            {/* Filters Sidebar */}
            <div className="w-full md:w-1/4 lg:w-1/5">
                <FilterSidebar filters={filters} setFilters={setFilters} applyFilters={applyFilters} />
            </div>

            {/* Main Content Grid */}
            <div className="w-full md:w-3/4 lg:w-4/5 space-y-6">

                {/* Search Bar */}
                <div className="relative">
                   <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                   <Input
                     type="search"
                     placeholder="Search by title, creator, description..."
                     className="pl-10"
                     value={searchTerm}
                     onChange={handleSearchChange}
                   />
                </div>

               {/* Loading and Error States */}
               {isLoading && (
                   <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                      {[...Array(6)].map((_, i) => (
                         <Card key={i}>
                           <CardHeader><Skeleton className="h-5 w-3/4" /></CardHeader>
                           <CardContent className="space-y-2">
                             <Skeleton className="h-4 w-1/2" />
                             <Skeleton className="h-4 w-1/3" />
                             <Skeleton className="h-4 w-full mt-2" />
                           </CardContent>
                           <CardFooter><Skeleton className="h-10 w-full" /></CardFooter>
                         </Card>
                      ))}
                   </div>
               )}
               {error && (
                 <Alert variant="destructive">
                   <AlertTitle>Error</AlertTitle>
                   <AlertDescription>{error}</AlertDescription>
                    {!isLoggedIn && <Button variant="outline" size="sm" onClick={() => fetchCollaborations(false)} className="mt-2">Retry with Example Data</Button>}
                    {isLoggedIn && <Button variant="outline" size="sm" onClick={() => fetchCollaborations(true)} className="mt-2">Retry Fetching</Button>}
                 </Alert>
               )}


                {/* Collaborations Grid */}
                {!isLoading && !error && filteredCollaborations.length > 0 && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredCollaborations.map((collab) => (
                      <Card key={collab.id} className="flex flex-col hover:shadow-md transition-shadow">
                        <CardHeader>
                          <CardTitle className="text-lg line-clamp-2">{collab.title}</CardTitle>
                           <div className="flex flex-wrap gap-1 pt-1">
                              <Badge variant="secondary">{collab.contentCategory || 'N/A'}</Badge>
                              <Badge variant="outline">{collab.collaborationType || collab.platform || 'N/A'}</Badge> {/* Display platform if type missing */}
                           </div>
                           {/* Optionally add Creator Name if available */}
                            {collab.creatorName && (
                              <CardDescription className="text-xs pt-2 flex items-center">
                                 By: {collab.creatorName}
                              </CardDescription>
                            )}
                        </CardHeader>
                        <CardContent className="flex-grow space-y-2">
                           <p className="text-sm text-muted-foreground line-clamp-3">{collab.description || collab.details || 'No description.'}</p>
                           <p className="text-sm flex items-center pt-1"><Clock className="h-4 w-4 mr-1 text-primary"/>Timeline: {collab.timeline || collab.postedDate || 'N/A'}</p>
                           {/* Show goal if available */}
                           {collab.goal && <p className="text-sm flex items-center pt-1"><Target className="h-4 w-4 mr-1 text-primary"/>Goal: {collab.goal}</p>}
                        </CardContent>
                        <CardFooter>
                          <Button
                            className="w-full"
                            onClick={() => handleCardClick(collab)}
                            variant="outline"
                          >
                             {isLoggedIn ? 'View & Apply' : 'View Details (Login to Apply)'}
                          </Button>
                        </CardFooter>
                      </Card>
                    ))}
                  </div>
                )}
                {!isLoading && !error && filteredCollaborations.length === 0 && (
                   <Card className="text-center py-10 border-dashed">
                      <CardContent className="flex flex-col items-center gap-2">
                        <Users className="h-12 w-12 text-muted-foreground" />
                        <p className="text-muted-foreground">No collaborations match your criteria.</p>
                        <p className="text-xs text-muted-foreground">Try adjusting your search or filters.</p>
                      </CardContent>
                   </Card>
                )}
              </div>
            </div>
       </section>

        {/* Testimonials Section */}
       <section className="text-center">
         <h2 className="text-3xl md:text-4xl font-bold mb-3">Collaboration Successes</h2>
         <p className="text-muted-foreground max-w-xl mx-auto mb-12">See what creators achieved by teaming up.</p>
         <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
           {[
             { quote: "Our joint video reached 2x our usual audience!", name: "Comedy Duo", role: "YouTube Creators" },
             { quote: "Found the perfect podcast guest swap partner here.", name: "Podcast Network", role: "Podcast Producers" },
             { quote: "Collaborating on a blog post was seamless and boosted both our SEO.", name: "Niche Bloggers", role: "Travel Writers" }
           ].map((testimonial, index) => (
             <Card key={index} className="bg-card/80 border border-border/60 text-left">
               <CardContent className="pt-6">
                 <div className="flex mb-2">
                   {[...Array(5)].map((_, i) => <Star key={i} className="h-4 w-4 text-primary fill-primary" />)}
                 </div>
                 <p className="italic mb-4 text-foreground/90">"{testimonial.quote}"</p>
                 <p className="font-semibold">{testimonial.name}</p>
                 <p className="text-xs text-foreground/60">{testimonial.role}</p>
               </CardContent>
             </Card>
           ))}
         </div>
       </section>

       {/* Call to Action Section */}
       <section className="text-center bg-gradient-to-r from-teal-900/30 via-background to-teal-900/30 py-16 rounded-lg border border-teal-800/50">
         <h2 className="text-3xl md:text-4xl font-bold mb-4">Ready to Collaborate?</h2>
         <p className="text-lg text-foreground/80 mb-8 max-w-2xl mx-auto">
           Post your own collaboration idea or find your next creative partner today!
         </p>
         <div className="flex justify-center gap-4">
            <Button asChild size="lg">
              <Link href="/dashboard/collabs/new">
                Post Your Collab Idea <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
            {!isLoggedIn && (
                <Button asChild variant="outline" size="lg">
                  <Link href="/auth">Login / Sign Up</Link>
                </Button>
             )}
          </div>
       </section>


      {/* Application Dialog (Modal) */}
       <Dialog open={!!selectedCollaboration} onOpenChange={() => setSelectedCollaboration(null)}>
         <DialogContent className="sm:max-w-[650px]">
           <DialogHeader>
             <DialogTitle>{selectedCollaboration?.title}</DialogTitle>
             <DialogDescription>
               Send a message to express your interest in this collaboration.
             </DialogDescription>
              {/* Display collaboration details concisely */}
               <div className="text-sm text-muted-foreground space-y-1 pt-2 border-t mt-2">
                   <p className="flex items-center gap-1.5"><UsersIcon className="h-3 w-3"/> Creator: {selectedCollaboration?.creatorName || 'Unknown'}</p>
                   <p className="flex items-center gap-1.5"><Target className="h-3 w-3"/> Category: {selectedCollaboration?.contentCategory || selectedCollaboration?.niche}</p>
                   <p className="flex items-center gap-1.5"><Clock className="h-3 w-3"/> Timeline: {selectedCollaboration?.timeline || selectedCollaboration?.postedDate}</p>
                   <p className="mt-2 text-foreground/80">{selectedCollaboration?.description || selectedCollaboration?.details}</p>
                    {/* Add link to creator's channel/profile if available */}
                    {selectedCollaboration?.channelLink && (
                        <p><Link href={selectedCollaboration.channelLink} className="text-primary hover:underline text-xs" target="_blank" rel="noopener noreferrer">View Creator's Channel</Link></p>
                     )}
                      {selectedCollaboration?.creatorProfileLink && (
                         <p><Link href={selectedCollaboration.creatorProfileLink} className="text-primary hover:underline text-xs" target="_blank" rel="noopener noreferrer">View Creator's Profile</Link></p>
                      )}
               </div>
           </DialogHeader>

           {/* Application Form */}
           <div className="py-4">
              {submissionStatus && (
                <Alert variant={submissionStatus.includes("success") ? "default" : "destructive"} className="mb-4">
                  <AlertTitle>{submissionStatus.includes("success") ? "Success" : "Error"}</AlertTitle>
                  <AlertDescription>{submissionStatus}</AlertDescription>
                </Alert>
              )}
              <form onSubmit={handleApply} className="space-y-4">
                <div>
                  <Label htmlFor="requesterName" className="text-right">Your Name</Label>
                  <Input id="requesterName" name="requesterName" value={application.requesterName} onChange={handleInputChange} required disabled={submissionStatus === 'Submitting...'} />
                </div>
                <div>
                  <Label htmlFor="requesterEmail" className="text-right">Your Email</Label>
                  <Input id="requesterEmail" name="requesterEmail" type="email" value={application.requesterEmail} onChange={handleInputChange} required disabled={submissionStatus === 'Submitting...'} />
                </div>
                <div>
                  <Label htmlFor="message" className="text-right">Message</Label>
                  <textarea
                      id="message"
                      name="message"
                      rows={4}
                      value={application.message}
                      onChange={handleInputChange}
                      required
                      placeholder="Introduce yourself and explain why you'd be a good fit for this collaboration..."
                      className="w-full px-3 py-2 border border-input rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring min-h-[80px] text-sm"
                      disabled={submissionStatus === 'Submitting...'}
                    />
                </div>
                {/* Removed Date Input - assuming backend handles this */}
                {/* <div>
                  <Label htmlFor="appliedDate" className="text-right">Application Date</Label>
                  <Input id="appliedDate" name="appliedDate" type="date" value={application.appliedDate} onChange={handleInputChange} required disabled={submissionStatus === 'Submitting...'} />
                </div> */}
                 <DialogFooter>
                   <DialogClose asChild>
                      <Button type="button" variant="outline" disabled={submissionStatus === 'Submitting...'}>Cancel</Button>
                   </DialogClose>
                    <Button type="submit" disabled={submissionStatus === 'Submitting...'}>
                      {submissionStatus === 'Submitting...' ? 'Submitting...' : 'Send Application'}
                    </Button>
                 </DialogFooter>
              </form>
            </div>
         </DialogContent>
       </Dialog>

        {/* Login Required Alert Dialog */}
        <AlertDialog open={showLoginAlert} onOpenChange={setShowLoginAlert}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle className="flex items-center gap-2"><LogIn className="h-5 w-5"/> Login Required</AlertDialogTitle>
              <AlertDialogDescription>
                You need to be logged in to view details and apply for collaborations.
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
