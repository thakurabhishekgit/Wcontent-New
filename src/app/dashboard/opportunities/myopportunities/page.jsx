'use client';

import React, { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger, DialogFooter, DialogClose } from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Inbox, Mail, Briefcase, MapPin, DollarSign, CalendarDays, User, Loader2, FileText, ExternalLink, Eye, PlusCircle } from "lucide-react"; // Import icons, added PlusCircle
import Link from "next/link";

export default function MyOpportunitiesPage() {
  const [opportunities, setOpportunities] = useState([]);
  const [selectedOpp, setSelectedOpp] = useState(null); // Opportunity whose applications are being viewed
  const [applications, setApplications] = useState([]);
  const [isLoadingOpps, setIsLoadingOpps] = useState(true);
  const [isLoadingApps, setIsLoadingApps] = useState(false);
  const [error, setError] = useState(null);
  const [isClient, setIsClient] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  useEffect(() => {
    setIsClient(true); // Component has mounted
  }, []);

  // Fetch user's opportunities on mount
  useEffect(() => {
    if (isClient) {
      const userId = localStorage.getItem("id");
      const token = localStorage.getItem("token");

      if (!userId || !token) {
        setError("User not logged in. Please login again.");
        setIsLoadingOpps(false);
        return;
      }

      fetchOpportunities(userId, token);
    }
     // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isClient]);

  const fetchOpportunities = async (userId, token) => {
      setIsLoadingOpps(true);
      setError(null);
      try {
        const response = await fetch(
          `http://localhost:3001/api/users/opportunities/getMyOpportunities/${userId}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        if (response.ok) {
          const data = await response.json();
          // Ensure data is an array and map id correctly (assuming backend sends 'id' or '_id')
          setOpportunities(Array.isArray(data) ? data.map(opp => ({ ...opp, dbId: opp.id || opp._id })) : []);
        } else {
           const errorData = await response.json().catch(() => ({ message: "Failed to fetch opportunities." }));
           setError(errorData.message || "Failed to fetch opportunities.");
           setOpportunities([]);
        }
      } catch (error) {
        console.error("Error fetching opportunities:", error);
        setError("Error fetching opportunities. Please try again.");
         setOpportunities([]);
      } finally {
        setIsLoadingOpps(false);
      }
    };

  // Fetch applications for the selected opportunity
  const fetchApplications = async (oppDbId) => {
    const token = localStorage.getItem("token");
     if (!oppDbId || !token) return;

    setIsLoadingApps(true);
    setApplications([]); // Clear previous applications
    // Clear previous errors specific to applications - keep general errors if any
    // setError(null);

    try {
       // Use the correct ID field (dbId which is mapped from id or _id)
      const response = await fetch(
        `http://localhost:3001/api/users/application/opportunity/${oppDbId}/applicants`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (response.ok) {
        const data = await response.json();
         // Ensure data is an array and map id if necessary (using email as key for now if no unique id)
         setApplications(Array.isArray(data) ? data.map(app => ({...app, id: app._id || app.email })) : []);
      } else {
        const errorData = await response.json().catch(() => ({ message: "Failed to fetch applications for this opportunity." }));
        setError(errorData.message || "Failed to fetch applications for this opportunity."); // Set specific error
         setApplications([]);
      }
    } catch (error) {
      console.error("Error fetching applications:", error);
      setError("Error fetching applications. Please try again."); // Set specific error
       setApplications([]);
    } finally {
      setIsLoadingApps(false);
    }
  };

  // Called when the "View Applications" button (now DialogTrigger) is clicked
  const handleViewApplicationsClick = (opportunity) => {
    setSelectedOpp(opportunity);
    setIsDialogOpen(true); // Open the dialog
    fetchApplications(opportunity.dbId); // Fetch applications when dialog opens
  };

   const handleDialogClose = () => {
     setIsDialogOpen(false);
     setSelectedOpp(null); // Clear selected opportunity when closing
     setApplications([]); // Clear applications
     setError(null); // Clear errors related to applications fetch
   }

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


   // Render Loading Skeletons for Opportunities
   if (isLoadingOpps) {
     return (
       <div className="space-y-6">
         <h1 className="text-2xl font-bold">My Posted Opportunities</h1>
         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
           {[...Array(3)].map((_, i) => (
             <Card key={i}>
               <CardHeader>
                 <Skeleton className="h-6 w-3/4 mb-2" />
                 <Skeleton className="h-4 w-1/2" />
               </CardHeader>
               <CardContent>
                 <Skeleton className="h-4 w-full mb-2" />
                 <Skeleton className="h-4 w-5/6" />
               </CardContent>
                <CardFooter>
                   <Skeleton className="h-10 w-full" />
                </CardFooter>
             </Card>
           ))}
         </div>
       </div>
     );
   }

   // Render General Error State (if loading opps failed)
   if (!isLoadingOpps && error && !selectedOpp) { // Show general error if loading opps done and no opp selected for dialog
     return (
        <div className="space-y-6">
          <h1 className="text-2xl font-bold">My Posted Opportunities</h1>
           <Alert variant="destructive">
             <Inbox className="h-4 w-4" />
             <AlertTitle>Error</AlertTitle>
             <AlertDescription>{error}</AlertDescription>
             {/* Optionally add a retry button */}
             <Button variant="outline" size="sm" className="mt-2" onClick={() => {
                 const userId = localStorage.getItem("id");
                 const token = localStorage.getItem("token");
                 if(userId && token) fetchOpportunities(userId, token);
             }}>Retry</Button>
           </Alert>
        </div>
     );
   }

  return (
    <div className="space-y-8">
      <h1 className="text-2xl font-bold">My Posted Opportunities</h1>

      {/* Opportunities List */}
       {opportunities.length === 0 && !isLoadingOpps && !error && (
           <Card className="text-center py-8 border-dashed">
              <CardContent className="flex flex-col items-center gap-3"> {/* Increased gap */}
                 <Inbox className="h-12 w-12 text-muted-foreground" />
                 <p className="text-muted-foreground">You haven't posted any opportunities yet.</p>
                 {/* Updated Button */}
                 <Button variant="default" size="sm" asChild>
                     <Link href="/dashboard/opportunities/new" className="flex items-center gap-1">
                         <PlusCircle className="h-4 w-4" /> Post Your First Opportunity
                     </Link>
                 </Button>
               </CardContent>
           </Card>
       )}

      {opportunities.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {opportunities.map((opp) => (
            <Card key={opp.dbId} className="flex flex-col">
              <CardHeader>
                <CardTitle className="text-lg">{opp.title}</CardTitle>
                <CardDescription className="flex items-center text-xs pt-1">
                   <MapPin className="h-3 w-3 mr-1" /> {opp.location || 'N/A'}
                </CardDescription>
                 <div className="flex flex-wrap gap-1 pt-1">
                    <Badge variant="secondary">{opp.type || 'N/A'}</Badge>
                    <Badge variant="outline" className="flex items-center"><DollarSign className="h-3 w-3 mr-1"/>{opp.salaryRange || 'N/A'}</Badge>
                 </div>
              </CardHeader>
              <CardContent className="flex-grow">
                <p className="text-sm text-muted-foreground line-clamp-3">{opp.description || 'No description.'}</p>
              </CardContent>
              <CardFooter>
                 {/* Use DialogTrigger to open the modal */}
                 <Button
                    variant="outline"
                    className="w-full"
                    onClick={() => handleViewApplicationsClick(opp)} // Set selected opp and fetch apps
                    disabled={isLoadingApps && selectedOpp?.dbId === opp.dbId} // Disable while loading apps for THIS opp
                  >
                    <Eye className="mr-2 h-4 w-4" />
                    View Applications
                  </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}

      {/* Dialog for Viewing Applications */}
      <Dialog open={isDialogOpen} onOpenChange={handleDialogClose}>
        {/* DialogTrigger is handled by the button click, so no explicit trigger needed here */}
        <DialogContent className="sm:max-w-[600px] md:max-w-[800px] lg:max-w-[1000px] max-h-[90vh] flex flex-col">
          <DialogHeader>
            <DialogTitle>Applications for "{selectedOpp?.title}"</DialogTitle>
            <DialogDescription>Review the applications submitted for this opportunity.</DialogDescription>
          </DialogHeader>

          {/* Error specific to loading applications inside the dialog */}
          {error && !isLoadingApps && (
            <Alert variant="destructive" className="my-4">
              <Inbox className="h-4 w-4" />
              <AlertTitle>Error Loading Applications</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {/* Loading state for applications inside the dialog */}
          {isLoadingApps && (
            <div className="flex justify-center items-center py-10">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
               <p className="ml-2 text-muted-foreground">Loading applications...</p>
            </div>
          )}

          {/* Display applications inside the dialog */}
          {!isLoadingApps && !error && (
            <ScrollArea className="flex-grow my-4"> {/* Make content scrollable */}
              <div className="pr-4"> {/* Padding for scrollbar */}
                 {applications.length === 0 ? (
                   <Card className="text-center py-8 border-dashed">
                     <CardContent className="flex flex-col items-center gap-2">
                       <Inbox className="h-10 w-10 text-muted-foreground" />
                       <p className="text-muted-foreground">No applications received yet.</p>
                     </CardContent>
                   </Card>
                 ) : (
                   <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                     {applications.map((app) => (
                       <Card key={app.id}>
                         <CardHeader>
                           <CardTitle className="text-base flex items-center gap-2">
                             <User className="h-4 w-4 text-muted-foreground" /> {app.name || 'Unknown Applicant'}
                           </CardTitle>
                           <CardDescription className="flex items-center gap-1 text-xs">
                             <Mail className="h-3 w-3" /> {app.email || 'No email'}
                           </CardDescription>
                         </CardHeader>
                         <CardContent className="space-y-2">
                           {app.resumeUrl ? (
                             <Button variant="link" size="sm" asChild className="p-0 h-auto">
                               <a href={app.resumeUrl} target="_blank" rel="noopener noreferrer" className="text-sm flex items-center gap-1">
                                 <ExternalLink className="h-4 w-4" /> View Portfolio/Resume
                               </a>
                             </Button>
                           ) : (
                             <p className="text-sm text-muted-foreground italic">No portfolio/resume link provided.</p>
                           )}
                           <p className="text-xs text-muted-foreground flex items-center gap-1 pt-2">
                             <CalendarDays className="h-3 w-3" /> Applied on: {formatDate(app.applicationDate)}
                           </p>
                           {/* Placeholder for viewing applicant profile or actions */}
                            {/* <Button variant="outline" size="sm" className="mt-2" disabled>View Applicant Profile (TBD)</Button> */}
                         </CardContent>
                       </Card>
                     ))}
                   </div>
                 )}
               </div>
             </ScrollArea>
          )}

           <DialogFooter className="mt-auto pt-4 border-t">
             <DialogClose asChild>
               <Button type="button" variant="outline">
                 Close
               </Button>
             </DialogClose>
           </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
