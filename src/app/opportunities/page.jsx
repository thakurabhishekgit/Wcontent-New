
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
import { Search, MapPin, Briefcase, DollarSign, Filter, X, ArrowRight, Star, Award, Target as TargetIcon, Users as UsersIcon, LogIn, CalendarDays, FileText, Info, Loader2 } from "lucide-react";
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

// How It Works Component (Styled)
const HowitWorks = () => (
  <div className="p-8 md:p-10 mb-12 bg-card rounded-xl border border-border/50 shadow-lg animate-fade-in">
    <h2 className="text-2xl md:text-3xl font-bold mb-6 text-primary flex items-center gap-3"><Info className="h-7 w-7"/>How It Works</h2>
    <ol className="list-decimal list-inside space-y-4 text-muted-foreground text-base">
      <li className="leading-relaxed">Browse available opportunities using the intuitive search bar and comprehensive filters to pinpoint exactly what you're looking for.</li>
      <li className="leading-relaxed">Click 'View & Apply' on an opportunity that catches your eye to dive into the full details and requirements.</li>
      <li className="leading-relaxed">Log in or sign up seamlessly to submit your application, complete with your name, email, and a link to your portfolio or work.</li>
      <li className="leading-relaxed">The opportunity poster will be instantly notified once you apply, kickstarting your next potential project!</li>
    </ol>
  </div>
);

// Feature Card Component
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
     setFilters({ type: '', location: '', budget: '' });
     applyFilters({ type: '', location: '', budget: '' });
   };

  return (
    <Card className="sticky top-24 self-start shadow-lg border-border/50">
      <CardHeader>
        <CardTitle className="text-xl flex items-center gap-2">
          <Filter className="h-5 w-5 text-primary" /> Filters
        </CardTitle>
        <CardDescription>Refine your search for the perfect opportunity.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-5">
        <div className="space-y-1.5">
          <Label htmlFor="type-filter">Opportunity Type</Label>
          <Select
             value={filters.type || 'all'}
             onValueChange={(value) => handleSelectChange('type', value)}
             id="type-filter"
             name="type"
          >
            <SelectTrigger className="py-2.5 text-base"><SelectValue placeholder="Select type" /></SelectTrigger>
            <SelectContent>
               <SelectItem value="all">All Types</SelectItem>
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
        </div>

         <div className="space-y-1.5">
            <Label htmlFor="location-filter">Location</Label>
            <Input
              id="location-filter"
              name="location"
              placeholder="e.g., Remote, New York"
              value={filters.location || ''}
              onChange={handleInputChange}
              className="py-2.5 text-base"
            />
         </div>

         <div className="space-y-1.5">
            <Label htmlFor="budget-filter">Budget / Salary (Keyword)</Label>
            <Input
              id="budget-filter"
              name="budget"
              placeholder="e.g., $500, Negotiable"
              value={filters.budget || ''}
              onChange={handleInputChange}
              className="py-2.5 text-base"
            />
         </div>

      </CardContent>
       <CardFooter className="flex flex-col gap-2.5 pt-5">
           <Button onClick={() => applyFilters(filters)} className="w-full text-base py-3" size="lg">Apply Filters</Button>
           {(filters.type || filters.location || filters.budget) && (
              <Button variant="ghost" onClick={clearFilters} className="w-full flex items-center gap-1 text-sm text-muted-foreground hover:text-destructive">
                 <X className="h-4 w-4"/> Clear Filters
              </Button>
           )}
       </CardFooter>
    </Card>
  );
};

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


const dummyOpportunities = [
    { _id: 'dummy1', id: 'dummy1', title: 'Dummy Tech Review Gig', company: 'TechGadgets Demo', type: 'Paid Gig', location: 'Remote', postedDate: '2023-10-01T10:00:00Z', salaryRange: '$400 - $800', description: 'Create a short review video for our demo product. Link portfolio. Must have excellent camera presence and editing skills. Deliverables: 1 x 5-7 min video, 3 x social media clips.', requirements: 'Min. 10k YouTube subscribers, proven experience with tech reviews, high-quality video production setup.' },
    { _id: 'dummy2', id: 'dummy2', title: 'Dummy Travel Blog Post', company: 'Explore Examples', type: 'Travel Opportunity', location: 'Example City (Remote Option)', postedDate: '2023-09-28T14:30:00Z', salaryRange: 'Expenses Covered', description: 'Write a blog post about travel planning tips for a specific destination (to be discussed). SEO skills preferred. Looking for engaging writing style and beautiful photography.', requirements: 'Active travel blog with engaged readership, basic SEO knowledge, ability to produce high-quality photos.' },
    { _id: 'dummy3', id: 'dummy3', title: 'Dummy Social Media Manager Role', company: 'Brand Builders Inc.', type: 'Part-Time Role', location: 'Remote', postedDate: '2023-09-25T09:15:00Z', salaryRange: '$20/hour', description: 'Manage social media accounts (Instagram, TikTok) for a sample brand. Responsibilities include content creation, scheduling, community engagement, and reporting.', requirements: 'Proven experience in social media management, strong understanding of platform algorithms, excellent communication skills.' }
];


export default function OpportunitiesPage() {
  const [opportunities, setOpportunities] = useState([]);
  const [filteredOpportunities, setFilteredOpportunities] = useState([]);
  const [selectedOpportunity, setSelectedOpportunity] = useState(null);
  const [application, setApplication] = useState({
    name: "",
    email: "",
    resumeUrl: "",
    applicationDate: new Date().toISOString().split("T")[0],
  });
  const [submissionStatus, setSubmissionStatus] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filters, setFilters] = useState({ type: '', location: '', budget: '' });
  const [isClient, setIsClient] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showLoginAlert, setShowLoginAlert] = useState(false);
  const [showApplicationForm, setShowApplicationForm] = useState(false);
  const router = useRouter();
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 9; 

  useEffect(() => {
    setIsClient(true);
    const token = localStorage.getItem('token');
    setIsLoggedIn(!!token);
    fetchOpportunities(!!token);
  }, []);

   useEffect(() => {
     if(opportunities.length > 0) {
        applyFilters(filters, searchTerm); // Apply search term as well
     }
   // eslint-disable-next-line react-hooks/exhaustive-deps
   }, [opportunities, filters, searchTerm]);

   const fetchOpportunities = async (loggedIn) => {
     setIsLoading(true);
     setError(null);
     try {
        if (loggedIn) {
           const response = await axios.get(
             "http://localhost:3001/api/users/opportunities/opportunitiesGetAll"
           );
           if (Array.isArray(response.data)) {
             const opportunitiesWithId = response.data.map((opp, index) => ({
               ...opp,
               id: opp._id || opp.id || `live-${index}` 
             }));
             setOpportunities(opportunitiesWithId);
           } else {
             setError("Received invalid data format from the server.");
             setOpportunities([]);
           }
        } else {
            await new Promise(resolve => setTimeout(resolve, 500));
            const dummyDataWithId = dummyOpportunities.map((opp, index) => ({
              ...opp,
              id: opp._id || `dummy-${index}` 
            }));
            setOpportunities(dummyDataWithId);
        }
     } catch (error) {
       console.error("Error fetching opportunities:", error);
       if (loggedIn) {
            setError("Failed to fetch opportunities. Please check the API endpoint and your connection.");
       } else {
           setError("Failed to load live opportunity data. Displaying examples. Please login for full access.");
            const dummyDataWithId = dummyOpportunities.map((opp, index) => ({
              ...opp,
              id: opp._id || `dummy-${index}`
            }));
           setOpportunities(dummyDataWithId);
       }
       if (loggedIn) { 
            setOpportunities([]);
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
      let tempOpportunities = [...opportunities];

       if (currentSearchTerm) {
         const lowerSearchTerm = currentSearchTerm.toLowerCase();
         tempOpportunities = tempOpportunities.filter(opp =>
           opp.title?.toLowerCase().includes(lowerSearchTerm) ||
           opp.description?.toLowerCase().includes(lowerSearchTerm) ||
           opp.company?.toLowerCase().includes(lowerSearchTerm)
         );
       }

       if (currentFilters.type) {
         tempOpportunities = tempOpportunities.filter(opp => opp.type?.toLowerCase() === currentFilters.type.toLowerCase());
       }
       if (currentFilters.location) {
         tempOpportunities = tempOpportunities.filter(opp => opp.location?.toLowerCase().includes(currentFilters.location.toLowerCase()));
       }
       if (currentFilters.budget) { 
         tempOpportunities = tempOpportunities.filter(opp => opp.salaryRange?.toLowerCase().includes(currentFilters.budget.toLowerCase()));
       }
       setFilteredOpportunities(tempOpportunities);
       setCurrentPage(1); 
   };


  const handleCardClick = (opportunity) => {
    if (!isLoggedIn) {
      setShowLoginAlert(true);
    } else {
      setSelectedOpportunity(opportunity);
      setShowApplicationForm(false); 
      setSubmissionStatus(null);
      setApplication({
        name: "",
        email: "",
        resumeUrl: "",
        applicationDate: new Date().toISOString().split("T")[0],
      });
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setApplication({ ...application, [name]: value });
  };

  const handleApply = async (e) => {
    e.preventDefault();
    if (!selectedOpportunity || !isLoggedIn) return;

    setSubmissionStatus('Submitting...');

    try {
      if (!selectedOpportunity.id && selectedOpportunity.id !== 0) { 
        throw new Error("Selected opportunity is missing an ID.");
      }

       const oppIdToUse = selectedOpportunity.id;
       const token = localStorage.getItem('token');

      const response = await axios.post(
        `http://localhost:3001/api/users/application/opportunity/${oppIdToUse}/apply`,
        application,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );
      setSubmissionStatus("Application submitted successfully!");
       setTimeout(() => {
          setSelectedOpportunity(null);
          setShowApplicationForm(false);
       }, 2000);
    } catch (error) {
      console.error("Error applying for opportunity:", error);
      const errorMessage = error.response?.data?.message || "Failed to submit application. Please try again.";
      setSubmissionStatus(errorMessage);
    }
  };

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
    const listingsSection = document.getElementById('opportunities-listings');
    if (listingsSection) {
      listingsSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentOpportunities = filteredOpportunities.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredOpportunities.length / itemsPerPage);


  if (!isClient) {
    return (
        <div className="flex flex-col items-center justify-center min-h-screen p-4">
            <Loader2 className="h-12 w-12 animate-spin text-primary" />
            <p className="mt-4 text-muted-foreground">Loading Opportunities...</p>
        </div>
    );
  }


  return (
    <div className="container mx-auto px-4 py-8 space-y-20 md:space-y-24">

      <section className="text-center py-12 md:py-16 bg-gradient-to-b from-background via-primary/5 to-background animate-fade-in">
         <div className="container mx-auto px-4">
            <Briefcase className="h-16 w-16 text-primary mx-auto mb-6 animate-fade-in" style={{ animationDelay: '0.2s' }} />
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-6 animate-fade-in" style={{ animationDelay: '0.4s' }}>
            Discover Content Creator Opportunities
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto mb-8 animate-fade-in" style={{ animationDelay: '0.6s' }}>
            Find paid gigs, sponsorships, roles, and projects tailored specifically for digital creators like you.
                {!isLoggedIn && <span className="text-sm block text-primary mt-1 animate-fade-in" style={{ animationDelay: '0.8s' }}>(Login to view and apply to all opportunities)</span>}
            </p>
         </div>
      </section>

      <section className="space-y-12 animate-fade-in" style={{ animationDelay: '0.8s' }}>
        <div className="text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-3">Why Use Wcontent Opportunities?</h2>
          <p className="text-muted-foreground max-w-xl mx-auto">Connect directly with brands and businesses looking for your talent.</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <FeatureCard icon={Award} title='Curated Gigs' description='Access opportunities specifically for content creators.' img='https://picsum.photos/seed/gigs/400/200' hint='vector curated list' delay="1s" />
          <FeatureCard icon={Filter} title='Smart Filters' description='Easily find relevant gigs by type, location, and budget.' img='https://picsum.photos/seed/filters/400/200' hint='vector filter options' delay="1.2s" />
          <FeatureCard icon={TargetIcon} title='Direct Applications' description='Apply directly to opportunities through the platform.' img='https://picsum.photos/seed/apply/400/200' hint='vector apply form' delay="1.4s" />
        </div>
      </section>

      <section className="animate-fade-in" style={{ animationDelay: '1s' }}>
        <HowitWorks />
      </section>

      <section id="opportunities-listings" className="space-y-8 scroll-mt-20 animate-fade-in" style={{ animationDelay: '1.2s' }}>
        <h2 className="text-3xl md:text-4xl font-bold text-center">Explore Opportunities</h2>
        <div className="flex flex-col md:flex-row gap-8">
          <div className="w-full md:w-1/4 lg:w-1/5">
              <FilterSidebar filters={filters} setFilters={setFilters} applyFilters={applyFilters} />
          </div>

          <div className="w-full md:w-3/4 lg:w-4/5 space-y-6">
              <div className="relative">
                 <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                 <Input
                   type="search"
                   placeholder="Search by title, company, description..."
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
                           <Skeleton className="h-4 w-1/4" />
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
                  {!isLoggedIn && <Button variant="outline" size="sm" onClick={() => fetchOpportunities(false)} className="mt-2">Retry with Example Data</Button>}
                  {isLoggedIn && <Button variant="outline" size="sm" onClick={() => fetchOpportunities(true)} className="mt-2">Retry Fetching</Button>}
               </Alert>
             )}

              {!isLoading && !error && currentOpportunities.length > 0 && (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 animate-slide-in-from-bottom" style={{ animationDelay: '0.2s' }}>
                  {currentOpportunities.map((opportunity, index) => (
                    <Card key={opportunity.id || index} className="flex flex-col hover:shadow-lg transition-shadow duration-300 animate-fade-in" style={{ animationDelay: `${index * 0.05}s`}}>
                       <CardHeader>
                        <CardTitle className="text-lg line-clamp-2">{opportunity.title}</CardTitle>
                         <div className="flex flex-wrap gap-1 pt-1">
                            <Badge variant={opportunity.type === 'Paid Gig' || opportunity.type === 'Full-Time Role' || opportunity.type === 'Part-Time Role' || opportunity.type === 'Contract Role' ? 'default' : 'secondary'}>{opportunity.type || 'N/A'}</Badge>
                            <Badge variant="outline" className="flex items-center"><MapPin className="h-3 w-3 mr-1"/>{opportunity.location || 'N/A'}</Badge>
                         </div>
                         <CardDescription className="text-xs pt-2 flex items-center">
                            <Briefcase className="h-3 w-3 mr-1"/> {opportunity.company || 'Company N/A'}
                         </CardDescription>
                         <CardDescription className="text-xs pt-1 flex items-center">
                            <CalendarDays className="h-3 w-3 mr-1"/> Posted: {opportunity.postedDate ? new Date(opportunity.postedDate).toLocaleDateString() : 'N/A'}
                         </CardDescription>
                      </CardHeader>
                      <CardContent className="flex-grow space-y-2">
                         <p className="text-sm text-muted-foreground line-clamp-3">{opportunity.description || 'No description.'}</p>
                         <p className="text-sm font-medium flex items-center pt-1"><DollarSign className="h-4 w-4 mr-1 text-primary"/>{opportunity.salaryRange || 'N/A'}</p>
                      </CardContent>
                      <CardFooter>
                        <Button
                          className="w-full"
                          onClick={() => handleCardClick(opportunity)}
                          variant="outline"
                        >
                          {isLoggedIn ? 'View & Apply' : 'View Details'} <ArrowRight className="ml-2 h-4 w-4"/>
                        </Button>
                      </CardFooter>
                    </Card>
                  ))}
                </div>
              )}
              {!isLoading && !error && filteredOpportunities.length === 0 && (
                 <Card className="text-center py-10 border-dashed bg-card/50">
                    <CardContent className="flex flex-col items-center gap-3">
                      <Search className="h-12 w-12 text-muted-foreground" />
                      <p className="text-lg text-muted-foreground">No opportunities match your criteria.</p>
                      <p className="text-sm text-muted-foreground">Try adjusting your search or filters, or check back later!</p>
                    </CardContent>
                 </Card>
              )}
              <PaginationControls currentPage={currentPage} totalPages={totalPages} onPageChange={handlePageChange} />
            </div>
          </div>
      </section>

       <section className="text-center animate-fade-in" style={{ animationDelay: '1.4s' }}>
         <h2 className="text-3xl md:text-4xl font-bold mb-3">Success Stories</h2>
         <p className="text-muted-foreground max-w-xl mx-auto mb-12">Hear from creators who found opportunities here.</p>
         <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
           {[
             { quote: "Landed a great sponsored content deal through Wcontent!", name: "TechReviewer Pro", role: "Gadget Reviewer", imageSeed: "successOpp1" },
             { quote: "The travel opportunity I found here was a dream come true.", name: "Wanderlust Vlogs", role: "Travel Vlogger", imageSeed: "successOpp2" },
             { quote: "Consistent paid gigs keep my freelance career thriving. Thanks, Wcontent!", name: "Creative Spark", role: "Social Media Manager", imageSeed: "successOpp3" }
           ].map((testimonial, index) => (
             <Card key={index} className="bg-card/80 border border-border/60 text-left hover:shadow-lg transition-shadow duration-300 animate-slide-in-from-bottom" style={{ animationDelay: `${index * 0.15}s` }}>
                <CardHeader className="items-center">
                   <Image
                      src={`https://picsum.photos/seed/${testimonial.imageSeed}/100/100`}
                      alt={testimonial.name}
                      data-ai-hint="vector person avatar"
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
         <h2 className="text-3xl md:text-4xl font-bold mb-4">Ready to Find Your Next Gig?</h2>
         <p className="text-lg text-foreground/80 mb-8 max-w-2xl mx-auto">
           Sign up or log in to start applying for opportunities and grow your creator career.
         </p>
         <div className="flex flex-col sm:flex-row justify-center gap-4">
           <Button asChild size="lg" className="text-base py-3">
             <Link href="/dashboard/opportunities/new">
               Post an Opportunity <ArrowRight className="ml-2 h-5 w-5" />
             </Link>
           </Button>
           {!isLoggedIn && (
             <Button asChild variant="outline" size="lg" className="text-base py-3">
               <Link href="/auth">Login / Sign Up</Link>
             </Button>
            )}
         </div>
       </section>

        <Dialog open={!!selectedOpportunity} onOpenChange={() => {
            setSelectedOpportunity(null);
            setShowApplicationForm(false);
            setSubmissionStatus(null);
            setApplication({ name: "", email: "", resumeUrl: "", applicationDate: new Date().toISOString().split("T")[0] });
        }}>
         <DialogContent className="sm:max-w-[650px] max-h-[85vh] flex flex-col">
           <DialogHeader>
             <DialogTitle className="text-2xl">{selectedOpportunity?.title}</DialogTitle>
                {!showApplicationForm ? (
                    <DialogDescription className="flex flex-col gap-1 text-sm pt-2">
                        <span className="flex items-center gap-1.5"><Briefcase className="h-4 w-4"/> {selectedOpportunity?.company || 'N/A'}</span>
                        <span className="flex items-center gap-1.5"><MapPin className="h-4 w-4"/> {selectedOpportunity?.location || 'N/A'}</span>
                        <span className="flex items-center gap-1.5"><DollarSign className="h-4 w-4"/> {selectedOpportunity?.salaryRange || 'N/A'}</span>
                        <span className="flex items-center gap-1.5"><FileText className="h-4 w-4"/> Type: <Badge variant="secondary">{selectedOpportunity?.type || 'N/A'}</Badge></span>
                        {selectedOpportunity?.postedDate && <span className="flex items-center gap-1.5"><CalendarDays className="h-4 w-4"/> Posted: {new Date(selectedOpportunity.postedDate).toLocaleDateString()}</span>}
                    </DialogDescription>
                ) : (
                    <DialogDescription>
                        Fill out the form to apply for "{selectedOpportunity?.title}".
                    </DialogDescription>
                )}
           </DialogHeader>
            
           <ScrollArea className="flex-grow py-4 pr-6 -mx-6 px-6"> 
             {!showApplicationForm ? (
                <div className="space-y-4">
                    <div>
                        <h3 className="font-semibold text-md mb-1">Full Description:</h3>
                        <p className="text-sm text-muted-foreground whitespace-pre-wrap leading-relaxed">{selectedOpportunity?.description}</p>
                    </div>
                    {selectedOpportunity?.requirements && (
                        <div>
                            <h3 className="font-semibold text-md mb-1">Requirements:</h3>
                            <p className="text-sm text-muted-foreground whitespace-pre-wrap leading-relaxed">{selectedOpportunity.requirements}</p>
                        </div>
                    )}
                </div>
             ) : (
                <form id="applicationFormOpportunities" onSubmit={handleApply} className="space-y-4">
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
                        <Label htmlFor="name">Name</Label>
                        <Input id="name" name="name" value={application.name} onChange={handleInputChange} required disabled={submissionStatus === 'Submitting...'} />
                    </div>
                    <div>
                        <Label htmlFor="email">Email</Label>
                        <Input id="email" name="email" type="email" value={application.email} onChange={handleInputChange} required disabled={submissionStatus === 'Submitting...'} />
                    </div>
                    <div>
                        <Label htmlFor="resumeUrl">Portfolio/Work URL</Label>
                        <Input id="resumeUrl" name="resumeUrl" type="url" value={application.resumeUrl} onChange={handleInputChange} required placeholder="https://yourportfolio.com" disabled={submissionStatus === 'Submitting...'} />
                    </div>
                    <div>
                        <Label htmlFor="applicationDate">Application Date</Label>
                        <Input id="applicationDate" name="applicationDate" type="date" value={application.applicationDate} readOnly disabled className="bg-muted/50"/>
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
                        <Button onClick={() => setShowApplicationForm(true)}>Apply Now</Button>
                    </>
                ) : (
                    <>
                        <Button type="button" variant="outline" onClick={() => { setShowApplicationForm(false); setSubmissionStatus(null); }}>Back to Details</Button>
                        <Button type="submit" form="applicationFormOpportunities" disabled={submissionStatus === 'Submitting...' || (submissionStatus && submissionStatus.includes("successfully"))}>
                            {submissionStatus === 'Submitting...' ? (<><Loader2 className="mr-2 h-4 w-4 animate-spin"/> Submitting...</>) : 'Submit Application'}
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
                You need to be logged in to view details and apply for opportunities.
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
