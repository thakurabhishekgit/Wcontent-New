'use client';

import React, { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger, DialogFooter, DialogClose } from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Inbox, Mail, MessageSquare, CalendarDays, User, Loader2, Clock, FileText, Eye, Users, PlusCircle } from "lucide-react"; // Import icons, added PlusCircle
import Link from "next/link";

export default function MyCollabsPage() {
  const [collaborations, setCollaborations] = useState([]);
  const [selectedCollab, setSelectedCollab] = useState(null); // Collab whose requests are being viewed
  const [collabRequests, setCollabRequests] = useState([]);
  const [isLoadingCollabs, setIsLoadingCollabs] = useState(true);
  const [isLoadingRequests, setIsLoadingRequests] = useState(false);
  const [error, setError] = useState(null);
  const [isClient, setIsClient] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  useEffect(() => {
    setIsClient(true); // Component has mounted
  }, []);

  // Fetch user's collaborations on mount
  useEffect(() => {
    if (isClient) {
      const userId = localStorage.getItem("id");
      const token = localStorage.getItem("token");

      if (!userId || !token) {
        setError("User not logged in. Please login again.");
        setIsLoadingCollabs(false);
        return;
      }

      fetchCollaborations(userId, token);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isClient]);

  const fetchCollaborations = async (userId, token) => {
    setIsLoadingCollabs(true);
    setError(null);
    try {
      const response = await fetch(
        `http://localhost:3001/api/users/collabration/getCollabOfUser/${userId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (response.ok) {
        const data = await response.json();
         // Ensure data is an array and use _id from MongoDB
        setCollaborations(Array.isArray(data) ? data.map(c => ({ ...c, id: c._id })) : []);
      } else {
         const errorData = await response.json().catch(() => ({ message: "Failed to fetch collaborations." }));
        setError(errorData.message || "Failed to fetch collaborations.");
         setCollaborations([]);
      }
    } catch (error) {
      console.error("Error fetching collaborations:", error);
      setError("Error fetching collaborations. Please try again.");
       setCollaborations([]);
    } finally {
      setIsLoadingCollabs(false);
    }
  };

  // Fetch requests for the selected collaboration
  const fetchCollabRequests = async (collabId) => {
     const token = localStorage.getItem("token");
     if (!collabId || !token) return;

    setIsLoadingRequests(true);
    setCollabRequests([]); // Clear previous requests
    // Clear previous errors specific to requests - keep general errors if any
    // setError(null);

    try {
      const response = await fetch(
        `http://localhost:3001/api/users/collabration/getCollabRequests/${collabId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (response.ok) {
        const data = await response.json();
         // Ensure data is an array and handle potential _id mapping if needed
         setCollabRequests(Array.isArray(data) ? data.map(r => ({...r, id: r._id || r.requesterId})) : []);
      } else {
        const errorData = await response.json().catch(() => ({ message: "Failed to fetch collaboration requests." }));
         setError(errorData.message || "Failed to fetch collaboration requests."); // Set specific error
         setCollabRequests([]);
      }
    } catch (error) {
      console.error("Error fetching collaboration requests:", error);
      setError("Error fetching collaboration requests. Please try again."); // Set specific error
       setCollabRequests([]);
    } finally {
      setIsLoadingRequests(false);
    }
  };

  // Called when the "View Requests" button (DialogTrigger) is clicked
  const handleViewRequestsClick = (collab) => {
    setSelectedCollab(collab);
    setIsDialogOpen(true); // Open the dialog
    fetchCollabRequests(collab.id); // Fetch requests when dialog opens
  };

  const handleDialogClose = () => {
     setIsDialogOpen(false);
     setSelectedCollab(null); // Clear selected collab when closing
     setCollabRequests([]); // Clear requests
     setError(null); // Clear errors related to requests fetch
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


  // Render Loading Skeletons for Collaborations
  if (isLoadingCollabs) {
    return (
      <div className="space-y-6">
        <h1 className="text-2xl font-bold">My Collaborations</h1>
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

  // Render General Error State (if loading collabs failed)
   if (!isLoadingCollabs && error && !selectedCollab) { // Show general error if loading done and no collab selected for dialog
     return (
        <div className="space-y-6">
          <h1 className="text-2xl font-bold">My Collaborations</h1>
           <Alert variant="destructive">
             <Inbox className="h-4 w-4" />
             <AlertTitle>Error</AlertTitle>
             <AlertDescription>{error}</AlertDescription>
             {/* Optional retry button */}
             <Button variant="outline" size="sm" className="mt-2" onClick={() => {
                  const userId = localStorage.getItem("id");
                  const token = localStorage.getItem("token");
                  if(userId && token) fetchCollaborations(userId, token);
             }}>Retry</Button>
           </Alert>
        </div>
     );
   }


  return (
    <div className="space-y-8">
      <h1 className="text-2xl font-bold">My Collaborations</h1>

       {/* Collaborations List */}
       {collaborations.length === 0 && !isLoadingCollabs && !error && (
           <Card className="text-center py-8 border-dashed">
              <CardContent className="flex flex-col items-center gap-3"> {/* Increased gap */}
                 <Inbox className="h-12 w-12 text-muted-foreground" />
                 <p className="text-muted-foreground">You haven't posted any collaborations yet.</p>
                 {/* Updated Button */}
                 <Button variant="default" size="sm" asChild>
                     <Link href="/dashboard/collabs/new" className="flex items-center gap-1">
                         <PlusCircle className="h-4 w-4" /> Post Your First Collab
                     </Link>
                 </Button>
               </CardContent>
           </Card>
       )}

       {collaborations.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {collaborations.map((collab) => (
              <Card key={collab.id} className="flex flex-col">
                <CardHeader>
                  <CardTitle className="text-lg">{collab.title}</CardTitle>
                   <div className="flex flex-wrap gap-1 pt-1">
                      <Badge variant="secondary">{collab.contentCategory || 'N/A'}</Badge>
                      <Badge variant="outline">{collab.collaborationType || 'N/A'}</Badge>
                   </div>
                </CardHeader>
                <CardContent className="flex-grow">
                  <p className="text-sm text-muted-foreground line-clamp-3">{collab.description || 'No description.'}</p>
                   <p className="text-xs text-muted-foreground mt-2 flex items-center"><Clock className="h-3 w-3 mr-1"/>Timeline: {collab.timeline || 'N/A'}</p>
                </CardContent>
                <CardFooter>
                   {/* Use Button to trigger Dialog */}
                  <Button
                     variant="outline"
                    className="w-full"
                    onClick={() => handleViewRequestsClick(collab)}
                     disabled={isLoadingRequests && selectedCollab?.id === collab.id} // Disable while loading requests for THIS collab
                  >
                     <Users className="mr-2 h-4 w-4" />
                     View Requests
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
       )}


       {/* Dialog for Viewing Collaboration Requests */}
       <Dialog open={isDialogOpen} onOpenChange={handleDialogClose}>
          {/* DialogTrigger is handled by the button click */}
          <DialogContent className="sm:max-w-[600px] md:max-w-[800px] lg:max-w-[1000px] max-h-[90vh] flex flex-col">
             <DialogHeader>
               <DialogTitle>Requests for "{selectedCollab?.title}"</DialogTitle>
               <DialogDescription>Review collaboration requests received for this post.</DialogDescription>
             </DialogHeader>

             {/* Display error specific to loading requests inside the dialog */}
             {error && !isLoadingRequests && (
                <Alert variant="destructive" className="my-4">
                  <Inbox className="h-4 w-4" />
                  <AlertTitle>Error Loading Requests</AlertTitle>
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
             )}

            {/* Loading state for requests inside the dialog */}
            {isLoadingRequests && (
             <div className="flex justify-center items-center py-10">
               <Loader2 className="h-8 w-8 animate-spin text-primary" />
               <p className="ml-2 text-muted-foreground">Loading requests...</p>
             </div>
            )}

           {/* Display Requests */}
           {!isLoadingRequests && !error && (
             <ScrollArea className="flex-grow my-4"> {/* Make content scrollable */}
               <div className="pr-4"> {/* Padding for scrollbar */}
                  {collabRequests.length === 0 ? (
                     <Card className="text-center py-8 border-dashed">
                       <CardContent className="flex flex-col items-center gap-2">
                         <Inbox className="h-10 w-10 text-muted-foreground" />
                         <p className="text-muted-foreground">No requests received yet.</p>
                       </CardContent>
                     </Card>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {collabRequests.map((request) => (
                        <Card key={request.id}>
                          <CardHeader>
                            <CardTitle className="text-base flex items-center gap-2">
                              <User className="h-4 w-4 text-muted-foreground" /> {request.requesterName || 'Unknown Applicant'}
                            </CardTitle>
                            <CardDescription className="flex items-center gap-1 text-xs">
                              <Mail className="h-3 w-3" /> {request.requesterEmail || 'No email'}
                            </CardDescription>
                          </CardHeader>
                          <CardContent className="space-y-2">
                            <p className="text-sm flex items-start gap-2">
                                <MessageSquare className="h-4 w-4 text-muted-foreground mt-0.5 shrink-0" />
                                <span className="flex-1">{request.message || 'No message provided.'}</span>
                            </p>
                            <p className="text-xs text-muted-foreground flex items-center gap-1 pt-2">
                                <CalendarDays className="h-3 w-3" /> Applied on: {formatDate(request.appliedDate)}
                            </p>
                            <Badge variant={request.status === 'Approved' ? 'default' : request.status === 'Rejected' ? 'destructive' : 'secondary'}>
                              Status: {request.status || 'Pending'}
                            </Badge>
                            {/* Add Action Buttons Here (Approve/Reject) - TBD */}
                            <div className="pt-2 flex gap-2">
                               <Button size="sm" variant="outline" disabled>Approve (TBD)</Button>
                               <Button size="sm" variant="destructive" disabled>Reject (TBD)</Button>
                               {/* <Button variant="link" size="sm" className="p-0 h-auto" disabled>View Profile (TBD)</Button> */}
                            </div>
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
