
'use client';

import React from 'react';
import { useParams } from 'next/navigation';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Users, Zap, Target, Clock, ArrowLeft, Link as LinkIcon } from 'lucide-react';
import Link from 'next/link';
import { Skeleton } from '@/components/ui/skeleton'; // For loading state

// Placeholder data fetch function - replace with actual data fetching
async function getCollabDetails(id) {
  console.log(`Fetching details for collab ID: ${id}`);
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 500));

  // Find the collab in the placeholder data (from collabs/page.jsx)
   const collabs = [
    { id: 1, title: 'Joint YouTube Video - Comedy Skit', creatorName: 'FunnyFolks', niche: 'Comedy', goal: 'Cross-promotion, Audience Growth', platform: 'YouTube', postedDate: '3 days ago', lookingFor: 'Another comedy channel with 10k+ subs', details: 'Looking to create a hilarious collaborative skit video. We have a few script ideas but are open to brainstorming. Our audience loves relatable humor and parody. Link your channel when applying!', creatorProfileLink: '#', channelLink: '#' },
    { id: 2, title: 'Instagram Live Q&A - Mental Wellness', creatorName: 'MindfulMinds', niche: 'Wellness', goal: 'Share expertise, Community building', platform: 'Instagram', postedDate: '6 days ago', lookingFor: 'Therapist or wellness coach', details: 'Host a joint Instagram Live session discussing practical mental wellness tips for creatives. Session duration approx. 30-45 mins. We aim to provide actionable advice to our combined audiences.', creatorProfileLink: '#', channelLink: '#' },
    { id: 3, title: 'Podcast Guest Swap - Indie Music Scene', creatorName: 'MusicMavens Pod', niche: 'Music', goal: 'Introduce audiences to new artists', platform: 'Podcast', postedDate: '1 week ago', lookingFor: 'Indie musicians or band members', details: 'We feature indie artists on our podcast. Looking for musicians to interview (approx. 45 min episode) and potentially swap guest appearances on each other\'s platforms if applicable.', creatorProfileLink: '#', channelLink: '#' },
    { id: 4, title: 'Blog Post Collaboration - Sustainable Travel', creatorName: 'EcoWanderer', niche: 'Travel', goal: 'Co-author a guide', platform: 'Blog', postedDate: '1 week ago', lookingFor: 'Travel blogger focused on sustainability', details: 'Let\'s co-author a comprehensive guide on "Top 10 Sustainable Travel Tips for 2024". We can split sections and promote the final piece on both our blogs and social media.', creatorProfileLink: '#', channelLink: '#' },
    { id: 5, title: 'TikTok Challenge Collab', creatorName: 'DanceMovesDaily', niche: 'Dance/Entertainment', goal: 'Create a viral challenge', platform: 'TikTok', postedDate: '12 days ago', lookingFor: 'Dancer or choreographer', details: 'Seeking a creative dancer/choreographer to collaborate on creating and launching a new TikTok dance challenge. Let\'s brainstorm a catchy routine and sound!', creatorProfileLink: '#', channelLink: '#' },
  ];
  const collab = collabs.find(c => c.id.toString() === id);
  return collab; // Returns undefined if not found
}

export default function CollabDetailPage() {
  const params = useParams();
  const id = params.id;
  const [collab, setCollab] = React.useState(null); // Use specific type later
  const [isLoading, setIsLoading] = React.useState(true);
  const [error, setError] = React.useState(null);

   React.useEffect(() => {
    if (id) {
      setIsLoading(true);
      setError(null);
      getCollabDetails(id)
        .then(data => {
          if (data) {
            setCollab(data);
          } else {
             setError('Collaboration not found.');
          }
        })
        .catch(err => {
          console.error("Failed to fetch collab:", err);
          setError('Failed to load collaboration details.');
        })
        .finally(() => {
          setIsLoading(false);
        });
    }
  }, [id]);

  if (isLoading) {
    return <CollabDetailSkeleton />;
  }

  if (error) {
     return (
        <div className="text-center py-10">
          <p className="text-destructive text-lg mb-4">{error}</p>
          <Button variant="outline" asChild>
            <Link href="/collabs"><ArrowLeft className="mr-2 h-4 w-4" /> Back to Collaborations</Link>
          </Button>
        </div>
      );
   }

   if (!collab) {
     return <p>Collaboration details could not be loaded.</p>;
   }


  return (
    <div className="space-y-6">
       <Button variant="outline" size="sm" asChild className="mb-4">
          <Link href="/collabs"><ArrowLeft className="mr-2 h-4 w-4" /> Back to Collaborations</Link>
       </Button>

       <Card>
        <CardHeader>
            <div className="flex justify-between items-start mb-3">
                <div className="flex items-center space-x-3">
                   <Avatar className="h-10 w-10">
                     <AvatarImage src={`https://i.pravatar.cc/40?u=${collab.creatorName}`} alt={collab.creatorName} />
                     <AvatarFallback>{collab.creatorName.substring(0, 1)}</AvatarFallback>
                   </Avatar>
                    <div>
                      <p className="text-sm font-medium">{collab.creatorName}</p>
                      {/* Add link to creator profile later */}
                      <Link href={collab.creatorProfileLink || '#'} className="text-xs text-primary hover:underline flex items-center" target="_blank" rel="noopener noreferrer">
                        View Profile <LinkIcon className="h-3 w-3 ml-1"/>
                      </Link>
                    </div>
                 </div>
                 <span className="text-xs text-foreground/60 flex items-center pt-1">
                   <Clock className="h-3 w-3 mr-1" /> {collab.postedDate}
                 </span>
              </div>
              <CardTitle className="text-2xl md:text-3xl pt-2">{collab.title}</CardTitle>
               <div className="flex flex-wrap gap-2 pt-2">
                <Badge variant="outline">{collab.niche}</Badge>
                <Badge variant="outline">{collab.platform}</Badge>
               </div>
        </CardHeader>
        <CardContent className="space-y-4">
             <div className="flex items-start text-sm md:text-base">
                <Target className="h-5 w-5 mr-3 mt-0.5 text-primary shrink-0" />
                <p className="text-foreground/80"><strong className="font-semibold text-foreground/95 block mb-0.5">Collaboration Goal:</strong> {collab.goal}</p>
              </div>
              <div className="flex items-start text-sm md:text-base">
                 <Zap className="h-5 w-5 mr-3 mt-0.5 text-primary shrink-0" />
                 <p className="text-foreground/80"><strong className="font-semibold text-foreground/95 block mb-0.5">Looking for:</strong> {collab.lookingFor}</p>
              </div>

               <div className="prose prose-invert max-w-none dark:prose-invert prose-sm md:prose-base pt-2">
                   <h3 className="text-lg font-semibold mb-2 text-foreground">Details</h3>
                   <p>{collab.details}</p>
                   {/* Add link to creator's channel/platform */}
                    {collab.channelLink && (
                      <p>
                        <Link href={collab.channelLink} className="text-primary hover:underline flex items-center" target="_blank" rel="noopener noreferrer">
                           View Creator's {collab.platform} <LinkIcon className="h-4 w-4 ml-1"/>
                        </Link>
                      </p>
                    )}
               </div>

        </CardContent>
        <CardFooter>
           <Button size="lg" disabled>Request Collaboration (TBD)</Button>
        </CardFooter>
       </Card>
    </div>
  );
}


// Skeleton component for loading state
function CollabDetailSkeleton() {
  return (
    <div className="space-y-6">
       <Skeleton className="h-8 w-48 mb-4" /> {/* Back button */}
      <Card>
        <CardHeader>
          <div className="flex justify-between items-start mb-3">
            <div className="flex items-center space-x-3">
               <Skeleton className="h-10 w-10 rounded-full" />
               <div className="space-y-1.5">
                 <Skeleton className="h-4 w-28" />
                 <Skeleton className="h-3 w-20" />
               </div>
            </div>
             <Skeleton className="h-4 w-24" /> {/* Date */}
          </div>
          <Skeleton className="h-8 w-3/4 mt-2 mb-3" /> {/* Title */}
          <div className="flex flex-wrap gap-2 pt-2">
             <Skeleton className="h-5 w-20" /> {/* Niche badge */}
             <Skeleton className="h-5 w-24" /> {/* Platform badge */}
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
           <div className="flex items-start">
             <Skeleton className="h-5 w-5 mr-3 rounded-full" />
             <div className="space-y-1.5 flex-1">
                <Skeleton className="h-4 w-36 mb-1" /> {/* Goal Label */}
                <Skeleton className="h-4 w-full" /> {/* Goal Content */}
             </div>
           </div>
            <div className="flex items-start">
             <Skeleton className="h-5 w-5 mr-3 rounded-full" />
             <div className="space-y-1.5 flex-1">
                <Skeleton className="h-4 w-32 mb-1" /> {/* Looking For Label */}
                <Skeleton className="h-4 w-5/6" /> {/* Looking For Content */}
             </div>
           </div>
           <div className="pt-2">
             <Skeleton className="h-5 w-28 mb-3" /> {/* Details heading */}
             <Skeleton className="h-4 w-full mb-2" />
             <Skeleton className="h-4 w-full mb-2" />
             <Skeleton className="h-4 w-4/6" />
           </div>
        </CardContent>
         <CardFooter>
          <Skeleton className="h-12 w-48" /> {/* Request button */}
        </CardFooter>
      </Card>
    </div>
  );
}
