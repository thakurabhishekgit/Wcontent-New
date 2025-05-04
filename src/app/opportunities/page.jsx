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
import { Search, MapPin, Briefcase, DollarSign, Filter, X, ArrowRight, Star, Award, Target, Users as UsersIcon, LogIn } from "lucide-react"; // Added more icons, added LogIn
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

// How It Works Component
const HowitWorks = () => (
  <div className="p-6 mb-12 bg-card rounded-lg border border-border/50 shadow-sm">
    <h2 className="text-xl font-semibold mb-3 text-primary">How It Works</h2>
    <ul className="list-decimal list-inside space-y-2 text-sm text-muted-foreground">
      <li>Browse available opportunities using the search bar and filters.</li>
      <li>Click 'View & Apply' on an opportunity that interests you to see full details.</li>
      <li>Log in or sign up to submit your application with your name, email, and portfolio link.</li>
      <li>The opportunity poster will be notified once you apply!</li>
    </ul>
  </div>
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
     applyFilters({ type: '', location: '', budget: '' }); // Apply cleared filters immediately
   };

  return (
    <Card className="sticky top-20 self-start"> {/* Added sticky positioning */}
      <CardHeader>
        <CardTitle className="text-lg flex items-center gap-2">
          <Filter className="h-5 w-5" /> Filters
        </CardTitle>
        <CardDescription>Refine your search</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Opportunity Type Filter */}
        <div className="space-y-1">
          <Label htmlFor="type-filter">Type</Label>
          <Select
             value={filters.type || 'all'}
             onValueChange={(value) => handleSelectChange('type', value)}
             id="type-filter"
             name="type"
          >
            <SelectTrigger>
              <SelectValue placeholder="Select type" />
            </SelectTrigger>
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

        {/* Location Filter */}
         <div className="space-y-1">
            <Label htmlFor="location-filter">Location</Label>
            <Input
              id="location-filter"
              name="location"
              placeholder="e.g., Remote, New York"
              value={filters.location || ''}
              onChange={handleInputChange}
            />
         </div>

         {/* Budget Filter (Example - could be range slider etc.) */}
         <div className="space-y-1">
            <Label htmlFor="budget-filter">Budget / Salary (Keyword)</Label>
            <Input
              id="budget-filter"
              name="budget"
              placeholder="e.g., $500, Negotiable"
              value={filters.budget || ''}
              onChange={handleInputChange}
            />
         </div>

      </CardContent>
       <CardFooter className="flex flex-col gap-2">
           <Button onClick={() => applyFilters(filters)} className="w-full">Apply Filters</Button>
           {(filters.type || filters.location || filters.budget) && (
              <Button variant="outline" onClick={clearFilters} className="w-full flex items-center gap-1 text-xs">
                 <X className="h-3 w-3"/> Clear Filters
              </Button>
           )}
       </CardFooter>
    </Card>
  );
};

// Dummy Opportunity Data
const dummyOpportunities = [
    { id: 201, title: 'Dummy Tech Review Gig', company: 'TechGadgets Demo', type: 'Paid Gig', location: 'Remote', postedDate: '1 day ago', salaryRange: '$400 - $800', description: 'Create a short review video for our demo product. Link portfolio.' },
    { id: 202, title: 'Dummy Travel Blog Post', company: 'Explore Examples', type: 'Travel Opportunity', location: 'Example City (Remote Option)', postedDate: '2 days ago', salaryRange: 'Expenses Covered', description: 'Write a blog post about travel planning tips. SEO skills preferred.' },
    { id: 203, title: 'Dummy Social Media Manager Role', company: 'Brand Builders Inc.', type: 'Part-Time Role', location: 'Remote', postedDate: '3 days ago', salaryRange: '$20/hour', description: 'Manage social media accounts for a sample brand. Experience required.' }
];


export default function OpportunitiesPage() {
  const [opportunities, setOpportunities] = useState([]);
  const [filteredOpportunities, setFilteredOpportunities] = useState([]);
  const [selectedOpportunity, setSelectedOpportunity] = useState(null);
  const [application, setApplication] = useState({
    name: "",
    email: "",
    resumeUrl: "", // Changed from resume to resumeUrl for clarity
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
  const router = useRouter();

  useEffect(() => {
    setIsClient(true);
    const token = localStorage.getItem('token');
    setIsLoggedIn(!!token);
    fetchOpportunities(!!token); // Pass login status to fetch function
  }, []);

  // Apply search and filters whenever opportunities, searchTerm, or filteredOpportunities change
   useEffect(() => {
     if(opportunities.length > 0) { // Avoid running on initial empty array
        applyFilters(filters);
     }
      // eslint-disable-next-line react-hooks/exhaustive-deps
   }, [opportunities]); // Only depends on opportunities list itself

   const fetchOpportunities = async (loggedIn) => {
     setIsLoading(true);
     setError(null);
     try {
        if (loggedIn) {
            // Fetch real data if logged in
           const response = await axios.get(
             "https://wcontent-app-latest.onrender.com/api/users/opportunities/opportunitiesGetAll"
           );
           if (Array.isArray(response.data)) {
             const opportunitiesWithId = response.data.map((opp, index) => ({
               ...opp,
               id: opp.id || opp._id || index // Use _id, fallback to id, then index
             }));
             setOpportunities(opportunitiesWithId);
             setFilteredOpportunities(opportunitiesWithId); // Initialize filtered list
           } else {
             console.error("API response is not an array:", response.data);
             setError("Received invalid data format from the server.");
             setOpportunities([]);
             setFilteredOpportunities([]);
           }
        } else {
            // Show dummy data if not logged in
            await new Promise(resolve => setTimeout(resolve, 500)); // Simulate loading
            setOpportunities(dummyOpportunities);
            setFilteredOpportunities(dummyOpportunities);
        }
     } catch (error) {
       console.error("Error fetching opportunities:", error);
       if (loggedIn) {
            setError("Failed to fetch opportunities. Please check the API endpoint and your connection.");
       } else {
           setError("Failed to load opportunity data. Displaying examples."); // Error for dummy data scenario
           setOpportunities(dummyOpportunities); // Fallback to dummy on error
           setFilteredOpportunities(dummyOpportunities);
       }
       // Ensure lists are empty if not falling back to dummy data on error
       if (loggedIn) {
            setOpportunities([]);
            setFilteredOpportunities([]);
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
      let tempOpportunities = [...opportunities];

      // Apply search term first
       if (currentSearchTerm) {
         const lowerSearchTerm = currentSearchTerm.toLowerCase();
         tempOpportunities = tempOpportunities.filter(opp =>
           opp.title?.toLowerCase().includes(lowerSearchTerm) ||
           opp.description?.toLowerCase().includes(lowerSearchTerm) ||
           opp.company?.toLowerCase().includes(lowerSearchTerm)
         );
       }

      // Apply filters
       if (currentFilters.type) {
         tempOpportunities = tempOpportunities.filter(opp => opp.type?.toLowerCase() === currentFilters.type.toLowerCase());
       }
       if (currentFilters.location) {
         tempOpportunities = tempOpportunities.filter(opp => opp.location?.toLowerCase().includes(currentFilters.location.toLowerCase()));
       }
       if (currentFilters.budget) { // Simple keyword check for budget/salary
         tempOpportunities = tempOpportunities.filter(opp => opp.salaryRange?.toLowerCase().includes(currentFilters.budget.toLowerCase()));
       }


       setFilteredOpportunities(tempOpportunities);
   };


  const handleCardClick = (opportunity) => {
    if (!isLoggedIn) {
      setShowLoginAlert(true); // Show login required alert
    } else {
      setSelectedOpportunity(opportunity);
      setSubmissionStatus(null); // Reset submission status
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setApplication({ ...application, [name]: value });
  };

  const handleApply = async (e) => {
    e.preventDefault();
    if (!selectedOpportunity || !isLoggedIn) return; // Ensure logged in

    setSubmissionStatus('Submitting...');

    try {
      if (!selectedOpportunity.id && selectedOpportunity.id !== 0) {
        throw new Error("Selected opportunity is missing an ID.");
      }

      // Use the correct field from backend ('id' or '_id' mapped to 'id')
       const oppIdToUse = selectedOpportunity.id;
       const token = localStorage.getItem('token'); // Get token for authenticated request

      const response = await axios.post(
        `https://wcontent-app-latest.onrender.com/api/users/application/opportunity/${oppIdToUse}/apply`,
        application,
        { // Add Authorization header
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );
      setSubmissionStatus("Application submitted successfully!");
      setApplication({
        name: "",
        email: "",
        resumeUrl: "",
        applicationDate: new Date().toISOString().split("T")[0],
      });
       // Close the dialog after successful application
       setTimeout(() => {
          setSelectedOpportunity(null);
       }, 1500); // Close after 1.5 seconds
    } catch (error) {
      console.error("Error applying for opportunity:", error);
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
           Discover Content Creator Opportunities
         </h1>
         <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto">
           Find paid gigs, sponsorships, roles, and projects tailored specifically for digital creators like you.
            {!isLoggedIn && <span className="text-sm block text-primary mt-1">(Login to view and apply to all opportunities)</span>}
         </p>
      </section>

      {/* Features Section */}
      <section className="space-y-12">
        <div className="text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-3">Why Use WContent Opportunities?</h2>
          <p className="text-muted-foreground max-w-xl mx-auto">Connect directly with brands and businesses looking for your talent.</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {[
            { icon: Award, title: 'Curated Gigs', description: 'Access opportunities specifically for content creators.', hint: 'trophy award job', imageSeed: 1 },
            { icon: Filter, title: 'Smart Filters', description: 'Easily find relevant gigs by type, location, and budget.', hint: 'filter search find', imageSeed: 2 },
            { icon: Target, title: 'Direct Applications', description: 'Apply directly to opportunities through the platform.', hint: 'apply form submit', imageSeed: 3 },
            { icon: Briefcase, title: 'Diverse Roles', description: 'From paid gigs to full-time roles, find what fits you.', hint: 'job work project', imageSeed: 4 },
          ].map((feature, index) => (
            <Card key={index} className="flex flex-col overflow-hidden hover:shadow-lg transition-shadow duration-300">
              <CardHeader>
                <feature.icon className="h-8 w-8 mb-2 text-primary" />
                <CardTitle>{feature.title}</CardTitle>
                <CardDescription>{feature.description}</CardDescription>
              </CardHeader>
              <CardContent className="flex-grow flex items-end">
                <Image
                   src={`https://picsum.photos/400/250?grayscale&blur=1&random=${feature.imageSeed}`} // Use blurred grayscale picsum photos
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

      {/* How It Works Section */}
      <HowitWorks />

      {/* Main Opportunities Listing Section */}
      <section className="space-y-8">
        <h2 className="text-3xl md:text-4xl font-bold text-center">Explore Opportunities</h2>
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
                   placeholder="Search by title, company, description..."
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


              {/* Opportunities Grid */}
              {!isLoading && !error && filteredOpportunities.length > 0 && (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredOpportunities.map((opportunity) => (
                    <Card key={opportunity.id} className="flex flex-col hover:shadow-md transition-shadow">
                      <CardHeader>
                        <CardTitle className="text-lg line-clamp-2">{opportunity.title}</CardTitle>
                         <div className="flex flex-wrap gap-1 pt-1">
                            <Badge variant={opportunity.type === 'Paid Gig' ? 'default' : 'secondary'}>{opportunity.type || 'N/A'}</Badge>
                            <Badge variant="outline" className="flex items-center"><MapPin className="h-3 w-3 mr-1"/>{opportunity.location || 'N/A'}</Badge>
                         </div>
                         <CardDescription className="text-xs pt-2 flex items-center">
                            <Briefcase className="h-3 w-3 mr-1"/> {opportunity.company || 'N/A'}
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
                          {isLoggedIn ? 'View & Apply' : 'View Details (Login to Apply)'}
                        </Button>
                      </CardFooter>
                    </Card>
                  ))}
                </div>
              )}
              {!isLoading && !error && filteredOpportunities.length === 0 && (
                 <Card className="text-center py-10 border-dashed">
                    <CardContent className="flex flex-col items-center gap-2">
                      <Search className="h-12 w-12 text-muted-foreground" />
                      <p className="text-muted-foreground">No opportunities match your criteria.</p>
                      <p className="text-xs text-muted-foreground">Try adjusting your search or filters.</p>
                    </CardContent>
                 </Card>
              )}
            </div>
          </div>
      </section>

       {/* Testimonials Section */}
       <section className="text-center">
         <h2 className="text-3xl md:text-4xl font-bold mb-3">Success Stories</h2>
         <p className="text-muted-foreground max-w-xl mx-auto mb-12">Hear from creators who found opportunities here.</p>
         <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
           {[
             { quote: "Landed a great sponsored content deal through WContent!", name: "TechReviewer Pro", role: "Gadget Reviewer" },
             { quote: "The travel opportunity I found here was a dream come true.", name: "Wanderlust Vlogs", role: "Travel Vlogger" },
             { quote: "Consistent paid gigs keep my freelance career thriving. Thanks, WContent!", name: "Creative Spark", role: "Social Media Manager" }
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
         <h2 className="text-3xl md:text-4xl font-bold mb-4">Ready to Find Your Next Gig?</h2>
         <p className="text-lg text-foreground/80 mb-8 max-w-2xl mx-auto">
           Sign up or log in to start applying for opportunities and grow your creator career.
         </p>
         <div className="flex justify-center gap-4">
           <Button asChild size="lg">
             <Link href="/dashboard/opportunities/new">
               Post an Opportunity <ArrowRight className="ml-2 h-5 w-5" />
             </Link>
           </Button>
           {!isLoggedIn && (
             <Button asChild variant="outline" size="lg">
               <Link href="/auth">Login / Sign Up</Link>
             </Button>
            )}
         </div>
       </section>


      {/* Application Dialog (Modal) - Only shows if logged in */}
       <Dialog open={!!selectedOpportunity} onOpenChange={() => setSelectedOpportunity(null)}>
         <DialogContent className="sm:max-w-[650px]">
           <DialogHeader>
             <DialogTitle>{selectedOpportunity?.title}</DialogTitle>
             <DialogDescription>
               Apply for this opportunity by filling out the form below.
             </DialogDescription>
              {/* Display opportunity details concisely */}
               <div className="text-sm text-muted-foreground space-y-1 pt-2 border-t mt-2">
                   <p className="flex items-center gap-1.5"><Briefcase className="h-3 w-3"/> {selectedOpportunity?.company}</p>
                   <p className="flex items-center gap-1.5"><MapPin className="h-3 w-3"/> {selectedOpportunity?.location}</p>
                   <p className="flex items-center gap-1.5"><DollarSign className="h-3 w-3"/> {selectedOpportunity?.salaryRange}</p>
                   <p className="mt-2 text-foreground/80">{selectedOpportunity?.description}</p>
                   {selectedOpportunity?.requirements && <p className="mt-1"><strong>Requirements:</strong> {selectedOpportunity.requirements}</p>}
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
                  <Label htmlFor="name" className="text-right">Name</Label>
                  <Input id="name" name="name" value={application.name} onChange={handleInputChange} required disabled={submissionStatus === 'Submitting...'} />
                </div>
                <div>
                  <Label htmlFor="email" className="text-right">Email</Label>
                  <Input id="email" name="email" type="email" value={application.email} onChange={handleInputChange} required disabled={submissionStatus === 'Submitting...'} />
                </div>
                <div>
                  <Label htmlFor="resumeUrl" className="text-right">Portfolio/Work URL</Label>
                  <Input id="resumeUrl" name="resumeUrl" type="url" value={application.resumeUrl} onChange={handleInputChange} required placeholder="https://yourportfolio.com" disabled={submissionStatus === 'Submitting...'} />
                </div>
                <div>
                  <Label htmlFor="applicationDate" className="text-right">Application Date</Label>
                  <Input id="applicationDate" name="applicationDate" type="date" value={application.applicationDate} onChange={handleInputChange} required disabled={submissionStatus === 'Submitting...'} />
                </div>
                 <DialogFooter>
                   <DialogClose asChild>
                      <Button type="button" variant="outline" disabled={submissionStatus === 'Submitting...'}>Cancel</Button>
                   </DialogClose>
                    <Button type="submit" disabled={submissionStatus === 'Submitting...'}>
                      {submissionStatus === 'Submitting...' ? 'Submitting...' : 'Submit Application'}
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
