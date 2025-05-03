'use client';

import React, { useState, useEffect } from "react";
import axios from "axios";
import Link from 'next/link';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Search, MapPin, Briefcase, DollarSign, Filter, X } from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter, DialogClose } from "@/components/ui/dialog"; // Import Dialog components
import { Label } from "@/components/ui/label"; // Import Label


// Placeholder for HowitWorks component if it's not available yet
const HowitWorks = () => (
  <div className="p-4 mb-6 bg-card rounded-lg border border-border/50 shadow-sm">
    <h2 className="text-lg font-semibold mb-2 text-primary">How It Works</h2>
    <ul className="list-decimal list-inside space-y-1 text-sm text-muted-foreground">
      <li>Browse available opportunities or use filters to narrow your search.</li>
      <li>Click 'View & Apply' on an opportunity that interests you.</li>
      <li>Review the details and fill out the application form.</li>
      <li>Submit your application and wait for the poster to respond!</li>
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

  useEffect(() => {
    fetchOpportunities();
  }, []);

  // Apply search and filters whenever opportunities, searchTerm, or filteredOpportunities change
   useEffect(() => {
     applyFilters(filters); // Re-apply filters if opportunities list changes
      // eslint-disable-next-line react-hooks/exhaustive-deps
   }, [opportunities]); // Only depends on opportunities list itself

   const fetchOpportunities = async () => {
     setIsLoading(true);
     setError(null);
     try {
       const response = await axios.get(
         "http://localhost:3001/api/users/opportunities/opportunitiesGetAll"
       );
       if (Array.isArray(response.data)) {
         const opportunitiesWithId = response.data.map((opp, index) => ({
           ...opp,
           id: opp.id || opp._id || index
         }));
         setOpportunities(opportunitiesWithId);
         setFilteredOpportunities(opportunitiesWithId); // Initialize filtered list
       } else {
         console.error("API response is not an array:", response.data);
         setError("Received invalid data format from the server.");
         setOpportunities([]);
         setFilteredOpportunities([]);
       }
     } catch (error) {
       console.error("Error fetching opportunities:", error);
       setError("Failed to fetch opportunities. Please check the API endpoint and your connection.");
       setOpportunities([]);
       setFilteredOpportunities([]);
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
    setSelectedOpportunity(opportunity);
    setSubmissionStatus(null); // Reset submission status
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setApplication({ ...application, [name]: value });
  };

  const handleApply = async (e) => {
    e.preventDefault();
    if (!selectedOpportunity) return;

    setSubmissionStatus('Submitting...');

    try {
      if (!selectedOpportunity.id && selectedOpportunity.id !== 0) {
        throw new Error("Selected opportunity is missing an ID.");
      }

      // Use the correct field from backend ('id' or '_id' mapped to 'id')
       const oppIdToUse = selectedOpportunity.id;

      const response = await axios.post(
        `http://localhost:3001/api/users/application/opportunity/${oppIdToUse}/apply`,
        application
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

  return (
    <div className="container mx-auto px-4 py-8 space-y-8">

      {/* Header Section */}
      <div className="text-center mb-8">
         <h1 className="text-3xl md:text-4xl font-bold mb-2">Discover Opportunities</h1>
         <p className="text-lg text-muted-foreground">Find paid gigs, sponsorships, and roles tailored for content creators.</p>
      </div>

      {/* How It Works Section */}
      <HowitWorks />

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
               <Button variant="outline" size="sm" onClick={fetchOpportunities} className="mt-2">Retry</Button>
             </Alert>
           )}


            {/* Opportunities Grid */}
            {!isLoading && !error && filteredOpportunities.length > 0 && (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredOpportunities.map((opportunity) => (
                  <Card key={opportunity.id} className="flex flex-col">
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
                        View & Apply
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

      {/* Application Dialog (Modal) */}
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
    </div>
  );
}
