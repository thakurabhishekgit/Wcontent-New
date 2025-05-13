'use client';

import React, { useState, useEffect } from "react";
import axios from "axios";
import Link from 'next/link';
import Image from 'next/image';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Search, Filter, Users as UsersIcon, Target, Clock, X, MessageSquare, CalendarDays, Mail, User, ArrowRight, Star, Handshake, Zap, LogIn, Link as LinkIcon, Info, Loader2 } from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter, DialogClose } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
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
import { Textarea } from "@/components/ui/textarea";

// How It Works Component (Styled)
const HowitWorks = () => (
  <section className="p-8 md:p-10 mb-12 bg-card rounded-xl border border-border/50 shadow-lg animate-fade-in">
    <h2 className="text-2xl md:text-3xl font-bold mb-6 text-primary flex items-center gap-3"><Info className="h-7 w-7"/>How Collaborations Work</h2>
    <ol className="list-decimal list-inside space-y-4 text-muted-foreground text-base">
      <li className="leading-relaxed">Browse collaboration posts or use filters to find potential partners with similar interests or complementary audiences.</li>
      <li className="leading-relaxed">Click 'View & Request' to learn more about a specific collab idea, including goals, creator details, and what they're looking for.</li>
      <li className="leading-relaxed">Log in or sign up to send a personalized message to the creator expressing your interest and how you envision the collaboration.</li>
      <li className="leading-relaxed">Connect, brainstorm, and start creating amazing content together, leveraging each other's strengths and communities!</li>
    </ol>
  </section>
);

// Feature Card Component (Reused or adapted if needed)
const FeatureCard = ({ icon: Icon, title, description, img, hint, delay }) => (
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
     applyFilters({ contentCategory: '', collaborationType: '', timeline: '' });
   };

  const contentCategories = ["Comedy", "Gaming", "Tech", "Beauty", "Fashion", "Lifestyle", "Education", "Music", "Travel", "Food", "Fitness", "Wellness", "Other"];
  const collaborationTypes = ["Video Collab", "Podcast Guest Swap", "Instagram Collab", "Blog Post Collab", "Event/Workshop", "Challenge/Giveaway", "Other"];

  return (
    <Card className="sticky top-24 self-start shadow-lg border-border/50">
      <CardHeader>
        <CardTitle className="text-xl flex items-center gap-2">
          <Filter className="h-5 w-5 text-primary" /> Filters
        </CardTitle>
        <CardDescription>Find the perfect collab partner.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-5">
        <div className="space-y-1.5">
          <Label htmlFor="category-filter">Category / Niche</Label>
          <Select
             value={filters.contentCategory || 'all'}
             onValueChange={(value) => handleSelectChange('contentCategory', value)}
             id="category-filter"
             name="contentCategory"
          >
            <SelectTrigger className="py-2.5 text-base"><SelectValue placeholder="Select category" /></SelectTrigger>
            <SelectContent>
               <SelectItem value="all">All Categories</SelectItem>
               {contentCategories.map(cat => <SelectItem key={cat} value={cat}>{cat}</SelectItem>)}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-1.5">
           <Label htmlFor="type-filter">Collab Type</Label>
           <Select
              value={filters.collaborationType || 'all'}
              onValueChange={(value) => handleSelectChange('collaborationType', value)}
              id="type-filter"
              name="collaborationType"
           >
             <SelectTrigger className="py-2.5 text-base"><SelectValue placeholder="Select type" /></SelectTrigger>
             <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                {collaborationTypes.map(type => <SelectItem key={type} value={type}>{type}</SelectItem>)}
             </SelectContent>
           </Select>
        </div>

         <div className="space-y-1.5">
            <Label htmlFor="timeline-filter">Timeline (Keyword)</Label>
            <Input
              id="timeline-filter"
              name="timeline"
              placeholder="e.g., Next Month, Flexible"
              value={filters.timeline || ''}
              onChange={handleInputChange}
              className="py-2.5 text-base"
            />
         </div>

      </CardContent>
       <CardFooter className="flex flex-col gap-2.5 pt-5">
           <Button onClick={() => applyFilters(filters)} className="w-full text-base py-3" size="lg">Apply Filters</Button>
           {(filters.contentCategory || filters.collaborationType || filters.timeline) && (
              <Button variant="ghost" onClick={clearFilters} className="w-full flex items-center gap-1 text-sm text-muted-foreground hover:text-destructive">
                 <X className="h-4 w-4"/> Clear Filters
              </Button>
           )}
       </CardFooter>
    </Card>
  );
};

// Pagination Controls Component
const PaginationControls = ({ currentPage, totalPages, onPageChange }) => {
  if (totalPages <= 1) return null;

  const pageNumbers = [];
  for (let i = 1; i <= totalPages; i++) {
    pageNumbers.push(i);
  }

  return (
    <div className="flex justify-center items-center space-x-2 mt-10 pt-6 border-t">
      <Button
        variant="outline"
        size="sm"
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="text-base px-4 py-2"
      >
        Previous
      </Button>
      {pageNumbers.map((number) => (
        <Button
          key={number}
          variant={currentPage === number ? "default" : "outline"}
          size="icon"
          className="h-10 w-10 text-base"
          onClick={() => onPageChange(number)}
        >
          {number}
        </Button>
      ))}
      <Button
        variant="outline"
        size="sm"
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="text-base px-4 py-2"
      >
        Next
      </Button>
    </div>
  );
};


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

const dummyCollabs = [
    { _id: 'dummy101', id: 'dummy101', title: 'Dummy Comedy Skit Collab', creatorName: 'Comedy Central Lite', niche: 'Comedy', platform: 'YouTube', postedDate: '2023-10-01T10:00:00Z', goal: 'Cross-promote channels', lookingFor: 'Comedy channel with 5k+ subs', description: 'Looking for a partner for a short, funny skit. Must be able to film remotely.', details: 'Detailed plan: Brainstorm script ideas together, film separate parts, then one person edits. Aim for a 2-3 minute video. Open to new ideas!', channelLink: '#', creatorProfileLink: '#', contentCategory: 'Comedy', collaborationType: 'Video Collab', timeline: 'Within 2 weeks' },
    { _id: 'dummy102', id: 'dummy102', title: 'Dummy Wellness Instagram Live', creatorName: 'Mindful Moments', niche: 'Wellness', platform: 'Instagram', postedDate: '2023-09-28T14:30:00Z', goal: 'Share tips, build community', lookingFor: 'Yoga instructor or meditation guide', description: 'Joint IG Live session on managing stress. Approx 30 mins.', details: 'We can cover topics like mindfulness exercises, quick stress-relief techniques, and Q&A with the audience. Flexible on date/time.', channelLink: '#', creatorProfileLink: '#', contentCategory: 'Wellness', collaborationType: 'Instagram Collab', timeline: 'Next month' },
    { _id: 'dummy103', id: 'dummy103', title: 'Dummy Tech Podcast Guest Spot', creatorName: 'Tech Talk Today', niche: 'Tech', platform: 'Podcast', postedDate: '2023-09-25T09:15:00Z', goal: 'Discuss new AI trends', lookingFor: 'AI expert or developer', description: 'Seeking knowledgeable guest for a 45-min podcast episode on recent AI advancements.', details: 'Our podcast reaches tech enthusiasts and professionals. Episode will be recorded remotely. Please provide topics you can speak on.', channelLink: '#', creatorProfileLink: '#', contentCategory: 'Tech', collaborationType: 'Podcast Guest Swap', timeline: 'Flexible' }
];


export default function CollaborationsPage() {
  const [collaborations, setCollaborations] = useState([]);
  const [filteredCollaborations, setFilteredCollaborations] = useState([]);
  const [selectedCollaboration, setSelectedCollaboration] = useState(null);
  const [application, setApplication] = useState({
    requesterName: "",
    requesterEmail: "",
    message: "",
    appliedDate: new Date().toISOString().split("T")[0],
  });
  const [submissionStatus, setSubmissionStatus] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filters, setFilters] = useState({ contentCategory: '', collaborationType: '', timeline: '' });
  const [isClient, setIsClient] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showLoginAlert, setShowLoginAlert] = useState(false);
  const [showApplicationForm, setShowApplicationForm] = useState(false);
  const router = useRouter();
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 9; // Or 8 for a 4x2 grid


  useEffect(() => {
    setIsClient(true);
    const token = localStorage.getItem('token');
    setIsLoggedIn(!!token);
    fetchCollaborations(!!token);
  }, []);

  useEffect(() => {
    if (collaborations.length > 0) {
      applyFilters(filters, searchTerm); // Apply search term as well
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [collaborations, filters, searchTerm]); // Add searchTerm to dependency array

  const fetchCollaborations = async (loggedIn) => {
    setIsLoading(true);
    setError(null);
    try {
       if (loggedIn) {
          const response = await axios.get(
            "https://wcontent-app-latest.onrender.com/api/users/collabration/getCollabOfAllUsers"
          );
          if (Array.isArray(response.data)) {
             const collaborationsWithId = response.data.map(collab => ({
                ...collab,
                id: collab._id || collab.id 
             }));
            setCollaborations(collaborationsWithId);
          } else {
            setError("Received invalid data format from the server.");
            setCollaborations([]);
          }
       } else {
            await new Promise(resolve => setTimeout(resolve, 500));
             const dummyDataWithId = dummyCollabs.map((collab, index) => ({
               ...collab,
               id: collab._id || `dummy-${index}` 
             }));
            setCollaborations(dummyDataWithId);
       }
    } catch (error) {
      console.error("Error fetching collaborations:", error);
       if (loggedIn) {
          setError("Failed to fetch collaborations. Please check the API endpoint and your connection.");
       } else {
          setError("Failed to load collaboration data. Displaying examples. Login for full access.");
            const dummyDataWithId = dummyCollabs.map((collab, index) => ({
              ...collab,
              id: collab._id || `dummy-${index}`
            }));
          setCollaborations(dummyDataWithId);
       }
       if (loggedIn) {
          setCollaborations([]);
       }
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearchChange = (e) => {
    const newSearchTerm = e.target.value;
    setSearchTerm(newSearchTerm);
  };

  const applyFilters = (currentFilters, currentSearchTerm = searchTerm) => {
      let tempCollaborations = [...collaborations];

      if (currentSearchTerm) {
         const lowerSearchTerm = currentSearchTerm.toLowerCase();
         tempCollaborations = tempCollaborations.filter(collab =>
           collab.title?.toLowerCase().includes(lowerSearchTerm) ||
           collab.description?.toLowerCase().includes(lowerSearchTerm) ||
           collab.creatorName?.toLowerCase().includes(lowerSearchTerm)
         );
      }

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
      setCurrentPage(1); 
   };


  const handleCardClick = (collaboration) => {
    if (!isLoggedIn) {
      setShowLoginAlert(true);
    } else {
      setSelectedCollaboration(collaboration);
      setShowApplicationForm(false);
      setSubmissionStatus(null);
      setApplication({
        requesterName: "",
        requesterEmail: "",
        message: "",
        appliedDate: new Date().toISOString().split("T")[0],
      });
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setApplication({ ...application, [name]: value });
  };

  const handleApply = async (e) => {
    e.preventDefault();
    if (!selectedCollaboration || !isLoggedIn) return;

    setSubmissionStatus('Submitting...');

    try {
      if (!selectedCollaboration.id && selectedCollaboration.id !== 0) {
          throw new Error("Selected collaboration is missing an ID.");
      }
      const collabIdToUse = selectedCollaboration.id;
      const token = localStorage.getItem('token');
      const userId = localStorage.getItem('id');

       const payload = {
         ...application,
         requesterId: userId || null // Ensure requesterId is included
       };

      const response = await axios.post(
        `https://wcontent-app-latest.onrender.com/api/users/collabration/applyForCollab/${collabIdToUse}`,
        payload,
        {
            headers: {
              Authorization: `Bearer ${token}`
            }
        }
      );
      setSubmissionStatus("Collaboration request sent successfully!");
       setTimeout(() => {
          setSelectedCollaboration(null);
          setShowApplicationForm(false);
       }, 2000);
    } catch (error) {
      console.error("Error applying for collaboration:", error);
      const errorMessage = error.response?.data?.message || "Failed to submit collaboration request. Please try again.";
      setSubmissionStatus(errorMessage);
    }
  };

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
    const listingsSection = document.getElementById('collaborations-listings');
    if (listingsSection) {
      listingsSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentCollaborations = filteredCollaborations.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredCollaborations.length / itemsPerPage);


   if (!isClient) {
     return (
        <div className="flex flex-col items-center justify-center min-h-screen p-4">
            <Loader2 className="h-12 w-12 animate-spin text-primary" />
            <p className="mt-4 text-muted-foreground">Loading Collaborations...</p>
        </div>
    );
   }

  return (
    <div className="container mx-auto px-4 py-8 space-y-20 md:space-y-24">

       <section className="text-center py-12 md:py-16 bg-gradient-to-b from-background via-primary/5 to-background animate-fade-in">
         <div className="container mx-auto px-4">
            <UsersIcon className="h-16 w-16 text-primary mx-auto mb-6 animate-fade-in" style={{ animationDelay: '0.2s' }} />
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-6 animate-fade-in" style={{ animationDelay: '0.4s' }}>
            Connect & Collaborate
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto mb-8 animate-fade-in" style={{ animationDelay: '0.6s' }}>
            Find fellow content creators for joint projects, cross-promotions, and creative partnerships.
                {!isLoggedIn && <span className="text-sm block text-primary mt-1 animate-fade-in" style={{ animationDelay: '0.8s' }}>(Login to view and request collaborations)</span>}
            </p>
         </div>
       </section>

       <section className="space-y-12 animate-fade-in" style={{ animationDelay: '0.8s' }}>
        <div className="text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-3">Why Collaborate on Wcontent?</h2>
          <p className="text-muted-foreground max-w-xl mx-auto">Expand your reach, spark creativity, and build your network.</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"> {/* Changed to 3 cols */}
          <FeatureCard icon={UsersIcon} title='Find Partners' description='Discover creators in your niche or explore new ones.' img="https://picsum.photos/400/200?random=collabPartners&grayscale&blur=1" hint='collaboration network people' delay="1s" />
          <FeatureCard icon={Zap} title='Spark Creativity' description='Brainstorm ideas and create unique content together.' img="https://picsum.photos/400/200?random=collabCreativity&grayscale&blur=1" hint='lightbulb innovation ideas' delay="1.2s" />
          <FeatureCard icon={Target} title='Reach New Audiences' description='Cross-promote to grow your combined following.' img="https://picsum.photos/400/200?random=collabAudience&grayscale&blur=1" hint='audience growth charts' delay="1.4s" />
        </div>
      </section>

       <section className="animate-fade-in" style={{ animationDelay: '1s' }}>
        <HowitWorks />
      </section>

       <section id="collaborations-listings" className="space-y-8 scroll-mt-20 animate-fade-in" style={{ animationDelay: '1.2s' }}>
          <h2 className="text-3xl md:text-4xl font-bold text-center">Explore Collaborations</h2>
          <div className="flex flex-col md:flex-row gap-8">
            <div className="w-full md:w-1/4 lg:w-1/5">
                <FilterSidebar filters={filters} setFilters={setFilters} applyFilters={applyFilters} />
            </div>

            <div className="w-full md:w-3/4 lg:w-4/5 space-y-6">
                <div className="relative">
                   <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                   <Input
                     type="search"
                     placeholder="Search by title, creator, description..."
                     className="pl-10 py-3 text-base"
                     value={searchTerm}
                     onChange={handleSearchChange}
                   />
                </div>

               {isLoading && (
                   <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                      {[...Array(itemsPerPage)].map((_, i) => (
                         <Card key={i} className="animate-pulse">
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

                {!isLoading && !error && currentCollaborations.length > 0 && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 animate-slide-in-from-bottom" style={{ animationDelay: '0.2s' }}>
                    {currentCollaborations.map((collab, index) => (
                      <Card key={collab.id || index} className="flex flex-col hover:shadow-lg transition-shadow duration-300 animate-fade-in" style={{ animationDelay: `${index * 0.05}s`}}>
                        <CardHeader>
                          <CardTitle className="text-lg line-clamp-2">{collab.title}</CardTitle>
                           <div className="flex flex-wrap gap-1 pt-1">
                              <Badge variant="secondary">{collab.contentCategory || 'N/A'}</Badge>
                              <Badge variant="outline">{collab.collaborationType || collab.platform || 'N/A'}</Badge>
                           </div>
                            {collab.creatorName && (
                              <CardDescription className="text-xs pt-2 flex items-center">
                                 By: {collab.creatorName}
                              </CardDescription>
                            )}
                             <CardDescription className="text-xs pt-1 flex items-center">
                                <Clock className="h-3 w-3 mr-1"/> Timeline: {collab.timeline || formatDate(collab.postedDate) || 'N/A'}
                             </CardDescription>
                        </CardHeader>
                        <CardContent className="flex-grow space-y-2">
                           <p className="text-sm text-muted-foreground line-clamp-3">{collab.description || collab.details || 'No description.'}</p>
                           {collab.goal && <p className="text-sm flex items-center pt-1"><Target className="h-4 w-4 mr-1 text-primary"/>Goal: {collab.goal}</p>}
                        </CardContent>
                        <CardFooter>
                          <Button
                            className="w-full"
                            onClick={() => handleCardClick(collab)}
                            variant="outline"
                          >
                             {isLoggedIn ? 'View & Request Collab' : 'View Details'} <ArrowRight className="ml-2 h-4 w-4"/>
                          </Button>
                        </CardFooter>
                      </Card>
                    ))}
                  </div>
                )}
                {!isLoading && !error && filteredCollaborations.length === 0 && (
                   <Card className="text-center py-10 border-dashed bg-card/50">
                      <CardContent className="flex flex-col items-center gap-3">
                        <UsersIcon className="h-12 w-12 text-muted-foreground" />
                        <p className="text-lg text-muted-foreground">No collaborations match your criteria.</p>
                        <p className="text-sm text-muted-foreground">Try adjusting your search or filters.</p>
                      </CardContent>
                   </Card>
                )}
                 <PaginationControls currentPage={currentPage} totalPages={totalPages} onPageChange={handlePageChange} />
              </div>
            </div>
       </section>

       <section className="text-center animate-fade-in" style={{ animationDelay: '1.4s' }}>
         <h2 className="text-3xl md:text-4xl font-bold mb-3">Collaboration Successes</h2>
         <p className="text-muted-foreground max-w-xl mx-auto mb-12">See what creators achieved by teaming up.</p>
         <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
           {[
             { quote: "Our joint video reached 2x our usual audience!", name: "Comedy Duo", role: "YouTube Creators", imageSeed: "collabSuccess1" },
             { quote: "Found the perfect podcast guest swap partner here.", name: "Podcast Network", role: "Podcast Producers", imageSeed: "collabSuccess2" },
             { quote: "Collaborating on a blog post was seamless and boosted both our SEO.", name: "Niche Bloggers", role: "Travel Writers", imageSeed: "collabSuccess3" }
           ].map((testimonial, index) => (
             <Card key={index} className="bg-card/80 border border-border/60 text-left hover:shadow-lg transition-shadow duration-300 animate-slide-in-from-bottom" style={{ animationDelay: `${index * 0.15}s`}}>
                <CardHeader className="items-center">
                   <Image
                      src={`https://picsum.photos/100/100?random=${testimonial.imageSeed}&grayscale&blur=1`}
                      alt={testimonial.name}
                      data-ai-hint="person portrait professional"
                      width={80}
                      height={80}
                      className="rounded-full mb-3 border-2 border-primary"
                   />
                </CardHeader>
               <CardContent className="pt-0">
                 <div className="flex mb-2 justify-center md:justify-start">
                   {[...Array(5)].map((_, i) => <Star key={i} className="h-4 w-4 text-primary fill-primary" />)}
                 </div>
                 <p className="italic mb-4 text-foreground/90">"{testimonial.quote}"</p>
                 <p className="font-semibold text-center md:text-left">{testimonial.name}</p>
                 <p className="text-xs text-foreground/60 text-center md:text-left">{testimonial.role}</p>
               </CardContent>
             </Card>
           ))}
         </div>
       </section>

       <section className="text-center bg-gradient-to-r from-primary/10 via-background to-primary/20 py-16 rounded-xl border border-primary/30 animate-fade-in" style={{ animationDelay: '1.6s' }}>
         <h2 className="text-3xl md:text-4xl font-bold mb-4">Ready to Collaborate?</h2>
         <p className="text-lg text-foreground/80 mb-8 max-w-2xl mx-auto">
           Post your own collaboration idea or find your next creative partner today!
         </p>
         <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Button asChild size="lg" className="text-base py-3">
              <Link href="/dashboard/collabs/new">
                Post Your Collab Idea <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
            {!isLoggedIn && (
                <Button asChild variant="outline" size="lg" className="text-base py-3">
                  <Link href="/auth">Login / Sign Up</Link>
                </Button>
             )}
          </div>
       </section>

       <Dialog open={!!selectedCollaboration} onOpenChange={() => {
           setSelectedCollaboration(null);
           setShowApplicationForm(false);
           setSubmissionStatus(null);
           setApplication({ requesterName: "", requesterEmail: "", message: "", appliedDate: new Date().toISOString().split("T")[0] });
        }}>
         <DialogContent className="sm:max-w-[650px] max-h-[85vh] flex flex-col"> 
           <DialogHeader>
             <DialogTitle className="text-2xl">{selectedCollaboration?.title}</DialogTitle>
             {!showApplicationForm ? (
                <DialogDescription className="flex flex-col gap-1 text-sm pt-2">
                    <span className="flex items-center gap-1.5"><User className="h-4 w-4"/> Creator: {selectedCollaboration?.creatorName || 'N/A'}</span>
                    <span className="flex items-center gap-1.5"><Badge variant="secondary" className="text-xs">{selectedCollaboration?.contentCategory || selectedCollaboration?.niche || 'N/A'}</Badge></span>
                    <span className="flex items-center gap-1.5"><Badge variant="outline" className="text-xs">{selectedCollaboration?.platform || 'N/A'}</Badge></span>
                    <span className="flex items-center gap-1.5"><Clock className="h-4 w-4"/> Timeline/Posted: {selectedCollaboration?.timeline || formatDate(selectedCollaboration?.postedDate) || 'N/A'}</span>
                </DialogDescription>
             ) : (
                <DialogDescription>
                    Send a request to collaborate on "{selectedCollaboration?.title}".
                </DialogDescription>
             )}
           </DialogHeader>
            
            <ScrollArea className="flex-grow py-4 pr-6 -mx-6 px-6">
                {!showApplicationForm ? (
                    <div className="space-y-4">
                        {selectedCollaboration?.goal && <div><h3 className="font-semibold text-md mb-1">Goal:</h3><p className="text-sm text-muted-foreground whitespace-pre-wrap leading-relaxed">{selectedCollaboration.goal}</p></div>}
                        {selectedCollaboration?.lookingFor && <div><h3 className="font-semibold text-md mb-1">Looking for:</h3><p className="text-sm text-muted-foreground whitespace-pre-wrap leading-relaxed">{selectedCollaboration.lookingFor}</p></div>}
                        <div>
                            <h3 className="font-semibold text-md mb-1">Full Description/Details:</h3>
                            <p className="text-sm text-muted-foreground whitespace-pre-wrap leading-relaxed">{selectedCollaboration?.description || selectedCollaboration?.details || 'No detailed description provided.'}</p>
                        </div>
                        {selectedCollaboration?.channelLink && (
                            <p><Link href={selectedCollaboration.channelLink} className="text-primary hover:underline text-xs flex items-center gap-1" target="_blank" rel="noopener noreferrer">
                                <LinkIcon className="h-3 w-3"/> View Creator's Channel
                            </Link></p>
                         )}
                          {selectedCollaboration?.creatorProfileLink && (
                             <p><Link href={selectedCollaboration.creatorProfileLink} className="text-primary hover:underline text-xs flex items-center gap-1" target="_blank" rel="noopener noreferrer">
                                <User className="h-3 w-3"/> View Creator's Profile
                             </Link></p>
                          )}
                   </div>
                ) : (
                    <form id="collabRequestForm" onSubmit={handleApply} className="space-y-4">
                        {submissionStatus && !submissionStatus.includes("successfully") && (
                            <Alert variant="destructive" className="mb-4">
                            <AlertTitle>Error</AlertTitle>
                            <AlertDescription>{submissionStatus}</AlertDescription>
                            </Alert>
                        )}
                        {submissionStatus && submissionStatus.includes("successfully") && (
                            <Alert variant="default" className="mb-4 bg-green-100 dark:bg-green-900/30 border-green-300 dark:border-green-700 text-green-700 dark:text-green-300">
                                <AlertTitle className="text-current font-semibold">Success</AlertTitle>
                                <AlertDescription className="text-current">{submissionStatus}</AlertDescription>
                            </Alert>
                        )}
                        <div>
                            <Label htmlFor="requesterName">Your Name</Label>
                            <Input id="requesterName" name="requesterName" value={application.requesterName} onChange={handleInputChange} required disabled={submissionStatus === 'Submitting...'} />
                        </div>
                        <div>
                            <Label htmlFor="requesterEmail">Your Email</Label>
                            <Input id="requesterEmail" name="requesterEmail" type="email" value={application.requesterEmail} onChange={handleInputChange} required disabled={submissionStatus === 'Submitting...'} />
                        </div>
                        <div>
                            <Label htmlFor="message">Message</Label>
                            <Textarea
                                id="message"
                                name="message"
                                rows={4}
                                value={application.message}
                                onChange={handleInputChange}
                                required
                                placeholder="Introduce yourself and explain why you'd be a good fit for this collaboration..."
                                disabled={submissionStatus === 'Submitting...'}
                                />
                        </div>
                         <div>
                            <Label htmlFor="appliedDateCollab">Application Date</Label>
                            <Input id="appliedDateCollab" name="appliedDate" type="date" value={application.appliedDate} readOnly disabled className="bg-muted/50"/>
                         </div>
                    </form>
                )}
           </ScrollArea>
          
           <DialogFooter className="pt-4 border-t mt-auto">
             {!showApplicationForm ? (
                <>
                    <DialogClose asChild>
                        <Button type="button" variant="outline">Cancel</Button>
                    </DialogClose>
                    <Button onClick={() => setShowApplicationForm(true)}>Request Collaboration</Button>
                </>
             ) : (
                <>
                    <Button type="button" variant="outline" onClick={() => { setShowApplicationForm(false); setSubmissionStatus(null); }}>Back to Details</Button>
                    <Button type="submit" form="collabRequestForm" disabled={submissionStatus === 'Submitting...' || (submissionStatus && submissionStatus.includes("successfully"))}>
                        {submissionStatus === 'Submitting...' ? (<><Loader2 className="mr-2 h-4 w-4 animate-spin"/> Submitting...</>) : 'Send Request'}
                    </Button>
                </>
             )}
           </DialogFooter>
         </DialogContent>
       </Dialog>

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
