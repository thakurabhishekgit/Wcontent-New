'use client';

import React, { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Inbox, Mail, Briefcase, MapPin, DollarSign, CalendarDays, User, Loader2, FileText, ExternalLink } from "lucide-react"; // Import icons
import Link from "next/link";

export default function MyOpportunitiesPage() {
  const [opportunities, setOpportunities] = useState([]);
  const [selectedOpp, setSelectedOpp] = useState(null);
  const [applications, setApplications] = useState([]);
  const [isLoadingOpps, setIsLoadingOpps] = useState(true);
  const [isLoadingApps, setIsLoadingApps] = useState(false);
  const [error, setError] = useState(null);
  const [isClient, setIsClient] = useState(false);

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

      const fetchOpportunities = async () => {
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

      fetchOpportunities();
    }
  }, [isClient]);

  // Fetch applications for the selected opportunity
  const fetchApplications = async (oppDbId) => {
    const token = localStorage.getItem("token");
     if (!oppDbId || !token) return;

    setIsLoadingApps(true);
    setApplications([]); // Clear previous applications
    setError(null); // Clear previous errors specific to applications

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
        const errorData = await response.json().catch(() => ({ message: "Failed to fetch applications." }));
        setError(errorData.message || "Failed to fetch applications.");
         setApplications([]);
      }
    } catch (error) {
      console.error("Error fetching applications:", error);
      setError("Error fetching applications. Please try again.");
       setApplications([]);
    } finally {
      setIsLoadingApps(false);
    }
  };

  const handleSelectOpp = (opportunity) => {
    setSelectedOpp(opportunity);
    fetchApplications(opportunity.dbId); // Fetch using the database ID
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


   // Render Loading Skeletons
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

   // Render Error State
   if (!isLoadingOpps && error && !selectedOpp) { // Show general error if loading done and no opportunity selected
     return (
        <div className="space-y-6">
          <h1 className="text-2xl font-bold">My Posted Opportunities</h1>
           <Alert variant="destructive">
             <Inbox className="h-4 w-4" />
             <AlertTitle>Error</AlertTitle>
             <AlertDescription>{error}</AlertDescription>
           </Alert>
        </div>
     );
   }

  return (
    <div className="space-y-8">
      <h1 className="text-2xl font-bold">My Posted Opportunities</h1>

      {/* Opportunities List */}
       {opportunities.length === 0 && !isLoadingOpps && !error && (
           <Card className="text-center py-8">
              <CardContent className="flex flex-col items-center gap-2">
                 <Inbox className="h-12 w-12 text-muted-foreground" />
                 <p className="text-muted-foreground">You haven't posted any opportunities yet.</p>
                 <Button variant="outline" size="sm" onClick={() => router.push('/dashboard/opportunities/new')}>Post Your First Opportunity</Button>
               </CardContent>
           </Card>
       )}

      {opportunities.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {opportunities.map((opp) => (
            <Card key={opp.dbId} className={`flex flex-col ${selectedOpp?.dbId === opp.dbId ? 'border-primary ring-2 ring-primary' : ''}`}>
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
                 <Button
                    variant={selectedOpp?.dbId === opp.dbId ? "default" : "outline"}
                    className="w-full"
                    onClick={() => handleSelectOpp(opp)}
                    disabled={isLoadingApps && selectedOpp?.dbId === opp.dbId}
                  >
                    {isLoadingApps && selectedOpp?.dbId === opp.dbId ? (
                       <> <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Loading Apps... </>
                    ) : selectedOpp?.dbId === opp.dbId ? (
                       "Viewing Applications"
                    ) : (
                       "View Applications"
                    )}
                  </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}

      {/* Selected Opportunity Details & Applications */}
      {selectedOpp && (
        <div className="mt-8 space-y-6">
          <h2 className="text-xl font-semibold">Applications for "{selectedOpp.title}"</h2>

           {/* Display error specific to loading applications */}
           {error && isLoadingApps === false && (
             <Alert variant="destructive">
               <Inbox className="h-4 w-4" />
               <AlertTitle>Error Loading Applications</AlertTitle>
               <AlertDescription>{error}</AlertDescription>
             </Alert>
           )}


          {/* Applications Loading Skeleton */}
           {isLoadingApps && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[...Array(2)].map((_, i) => (
                 <Card key={i}>
                    <CardHeader><Skeleton className="h-5 w-1/3 mb-1" /><Skeleton className="h-4 w-1/2" /></CardHeader>
                    <CardContent className="space-y-2">
                       <Skeleton className="h-4 w-full" />
                       <Skeleton className="h-4 w-2/3" />
                       <Skeleton className="h-8 w-32 mt-2" />
                    </CardContent>
                 </Card>
              ))}
            </div>
           )}


          {/* Display Applications */}
          {!isLoadingApps && applications.length === 0 && !error && (
             <Card className="text-center py-8">
                <CardContent className="flex flex-col items-center gap-2">
                   <Inbox className="h-12 w-12 text-muted-foreground" />
                   <p className="text-muted-foreground">No applications received for this opportunity yet.</p>
                 </CardContent>
             </Card>
          )}

          {!isLoadingApps && applications.length > 0 && (
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
                    {app.resumeUrl && (
                       <Button variant="link" size="sm" asChild className="p-0 h-auto">
                          <a href={app.resumeUrl} target="_blank" rel="noopener noreferrer" className="text-sm flex items-center gap-1">
                             <ExternalLink className="h-4 w-4" /> View Portfolio/Resume
                          </a>
                       </Button>
                    )}
                     {!app.resumeUrl && (
                        <p className="text-sm text-muted-foreground italic">No portfolio/resume link provided.</p>
                     )}
                    <p className="text-xs text-muted-foreground flex items-center gap-1 pt-2">
                        <CalendarDays className="h-3 w-3" /> Applied on: {formatDate(app.applicationDate)}
                    </p>
                     {/* Add Status Indicator/Actions Here (TBD) */}
                     {/* <Badge variant="secondary">Status: Pending</Badge> */}
                     {/* <div className="pt-2 flex gap-2">
                        <Button size="sm" variant="outline" disabled>Review (TBD)</Button>
                     </div> */}
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
