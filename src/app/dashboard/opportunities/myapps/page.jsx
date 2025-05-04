'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Inbox, Briefcase, MapPin, DollarSign, CalendarDays, Loader2, ExternalLink, FileText } from "lucide-react";
import Link from 'next/link';

export default function MyApplicationsPage() {
    const [applications, setApplications] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isClient, setIsClient] = useState(false);

    useEffect(() => {
        setIsClient(true); // Component has mounted
    }, []);

    useEffect(() => {
        if (isClient) {
            const userId = localStorage.getItem("id");
            const token = localStorage.getItem("token");

            if (!userId || !token) {
                setError("User not logged in. Please login again.");
                setIsLoading(false);
                return;
            }

            const fetchMyApplications = async () => {
                setIsLoading(true);
                setError(null);
                try {
                    // Adjust the endpoint if necessary - assuming an endpoint exists to get applications by applicant ID
                    const response = await fetch(`https://wcontent-app-latest.onrender.com/api/users/application/myApplications/${userId}`, {
                        headers: { Authorization: `Bearer ${token}` },
                    });

                    if (response.ok) {
                        const data = await response.json();
                        // The response should ideally include details of the opportunity applied to.
                        // Assuming data is an array of applications, each with an 'opportunity' object.
                        setApplications(Array.isArray(data) ? data.map(app => ({...app, id: app._id || app.opportunity?._id})) : []);
                    } else {
                        const errorData = await response.json().catch(() => ({ message: "Failed to fetch your applications." }));
                        setError(errorData.message || "Failed to fetch your applications.");
                        setApplications([]);
                    }
                } catch (err) {
                    console.error("Error fetching applications:", err);
                    let fetchErrorMessage = "Error fetching your applications. Please try again.";
                    if (isClient && err instanceof TypeError && err.message.includes('fetch')) {
                        fetchErrorMessage = `Error fetching applications. Could not connect to the server at https://wcontent-app-latest.onrender.com. Please ensure the backend is running and CORS is configured correctly.`;
                    }
                    setError(fetchErrorMessage);
                    setApplications([]);
                } finally {
                    setIsLoading(false);
                }
            };

            fetchMyApplications();
        }
    }, [isClient]);

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
    if (isLoading) {
        return (
            <div className="space-y-6">
                <h1 className="text-2xl font-bold">My Opportunity Applications</h1>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {[...Array(4)].map((_, i) => (
                        <Card key={i}>
                            <CardHeader>
                                <Skeleton className="h-6 w-3/4 mb-2" />
                                <Skeleton className="h-4 w-1/2" />
                            </CardHeader>
                            <CardContent className="space-y-2">
                                <Skeleton className="h-4 w-full" />
                                <Skeleton className="h-4 w-2/3" />
                                <Skeleton className="h-4 w-1/3 mt-2" />
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </div>
        );
    }

    // Render Error State
    if (error) {
        return (
            <div className="space-y-6">
                <h1 className="text-2xl font-bold">My Opportunity Applications</h1>
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
            <h1 className="text-2xl font-bold">My Opportunity Applications</h1>

            {applications.length === 0 && !isLoading && (
                <Card className="text-center py-8">
                    <CardContent className="flex flex-col items-center gap-2">
                        <Inbox className="h-12 w-12 text-muted-foreground" />
                        <p className="text-muted-foreground">You haven't applied for any opportunities yet.</p>
                        <Button variant="outline" size="sm" asChild>
                           <Link href="/opportunities">Browse Opportunities</Link>
                        </Button>
                    </CardContent>
                </Card>
            )}

            {applications.length > 0 && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {applications.map((app) => (
                        <Card key={app.id}>
                            <CardHeader>
                                {/* Assuming the backend returns opportunity details within the application object */}
                                <CardTitle className="text-lg">{app.opportunity?.title || 'Opportunity Title Missing'}</CardTitle>
                                <CardDescription className="flex items-center text-xs pt-1">
                                    <Briefcase className="h-3 w-3 mr-1"/> {app.opportunity?.company || 'Company Missing'}
                                    <span className="mx-2">|</span>
                                    <MapPin className="h-3 w-3 mr-1" /> {app.opportunity?.location || 'N/A'}
                                </CardDescription>
                                <div className="flex flex-wrap gap-1 pt-1">
                                    <Badge variant="secondary">{app.opportunity?.type || 'N/A'}</Badge>
                                    <Badge variant="outline" className="flex items-center"><DollarSign className="h-3 w-3 mr-1"/>{app.opportunity?.salaryRange || 'N/A'}</Badge>
                                </div>
                            </CardHeader>
                            <CardContent>
                                 <p className="text-sm text-muted-foreground flex items-center gap-1">
                                     <CalendarDays className="h-4 w-4" /> Applied on: {formatDate(app.applicationDate)}
                                 </p>
                                 {/* Optionally show application status if available */}
                                 {/* <Badge variant="outline" className="mt-2">Status: {app.status || 'Pending'}</Badge> */}
                                 {app.resumeUrl && (
                                    <Button variant="link" size="sm" asChild className="p-0 h-auto mt-2">
                                       <a href={app.resumeUrl} target="_blank" rel="noopener noreferrer" className="text-xs flex items-center gap-1">
                                          <ExternalLink className="h-3 w-3" /> View Submitted Portfolio/Resume
                                       </a>
                                    </Button>
                                 )}
                            </CardContent>
                            {/* Optionally add a footer link to the original opportunity */}
                             {app.opportunity?._id && (
                                <CardFooter>
                                    <Button variant="outline" size="sm" asChild>
                                        <Link href={`/opportunities/${app.opportunity._id}`}>View Opportunity</Link>
                                    </Button>
                                </CardFooter>
                             )}
                        </Card>
                    ))}
                </div>
            )}
        </div>
    );
}

    