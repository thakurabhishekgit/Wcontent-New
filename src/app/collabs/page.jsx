
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Users, Zap, Target, Clock } from 'lucide-react';
import Link from 'next/link';

// Placeholder data - replace with actual data fetching later
const collabs = [
  { id: 1, title: 'Joint YouTube Video - Comedy Skit', creatorName: 'FunnyFolks', niche: 'Comedy', goal: 'Cross-promotion, Audience Growth', platform: 'YouTube', postedDate: '3 days ago', lookingFor: 'Another comedy channel with 10k+ subs' },
  { id: 2, title: 'Instagram Live Q&A - Mental Wellness', creatorName: 'MindfulMinds', niche: 'Wellness', goal: 'Share expertise, Community building', platform: 'Instagram', postedDate: '6 days ago', lookingFor: 'Therapist or wellness coach' },
  { id: 3, title: 'Podcast Guest Swap - Indie Music Scene', creatorName: 'MusicMavens Pod', niche: 'Music', goal: 'Introduce audiences to new artists', platform: 'Podcast', postedDate: '1 week ago', lookingFor: 'Indie musicians or band members' },
  { id: 4, title: 'Blog Post Collaboration - Sustainable Travel', creatorName: 'EcoWanderer', niche: 'Travel', goal: 'Co-author a guide', platform: 'Blog', postedDate: '1 week ago', lookingFor: 'Travel blogger focused on sustainability' },
  { id: 5, title: 'TikTok Challenge Collab', creatorName: 'DanceMovesDaily', niche: 'Dance/Entertainment', goal: 'Create a viral challenge', platform: 'TikTok', postedDate: '12 days ago', lookingFor: 'Dancer or choreographer' },
];

export default function CollabsPage() {
  return (
    <div className="space-y-8">
      <h1 className="text-3xl md:text-4xl font-bold">Collaboration Hub</h1>
      <p className="text-lg text-foreground/80">
        Connect with fellow creators for joint projects, guest appearances, and cross-promotions.
      </p>

      {/* Filtering/Sorting Placeholder */}
      <div className="flex flex-wrap gap-2">
         <Button variant="outline" size="sm" disabled>Filter by Niche</Button>
         <Button variant="outline" size="sm" disabled>Filter by Platform</Button>
         <Button variant="outline" size="sm" disabled>Sort by Date</Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {collabs.map((collab) => (
          <Card key={collab.id} className="flex flex-col justify-between hover:shadow-md transition-shadow duration-200">
            <CardHeader>
               <div className="flex justify-between items-start mb-3">
                 <div className="flex items-center space-x-2">
                   <Avatar className="h-8 w-8">
                     {/* Placeholder image */}
                     <AvatarImage src={`https://i.pravatar.cc/40?u=${collab.creatorName}`} alt={collab.creatorName} />
                     <AvatarFallback>{collab.creatorName.substring(0, 1)}</AvatarFallback>
                   </Avatar>
                   <span className="text-sm font-medium">{collab.creatorName}</span>
                 </div>
                 <span className="text-xs text-foreground/60 flex items-center">
                   <Clock className="h-3 w-3 mr-1" /> {collab.postedDate}
                 </span>
              </div>
              <CardTitle className="text-xl">{collab.title}</CardTitle>
               <div className="flex flex-wrap gap-2 pt-1">
                <Badge variant="outline">{collab.niche}</Badge>
                <Badge variant="outline">{collab.platform}</Badge>
               </div>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="flex items-start text-sm">
                <Target className="h-4 w-4 mr-2 mt-0.5 text-primary shrink-0" />
                <span className="text-foreground/80"><strong className="font-medium text-foreground/90">Goal:</strong> {collab.goal}</span>
              </div>
              <div className="flex items-start text-sm">
                 <Zap className="h-4 w-4 mr-2 mt-0.5 text-primary shrink-0" />
                 <span className="text-foreground/80"><strong className="font-medium text-foreground/90">Looking for:</strong> {collab.lookingFor}</span>
              </div>
            </CardContent>
            <CardFooter>
              <Button variant="outline" size="sm" asChild>
                {/* Link to a detailed collab page later */}
                <Link href={`/collabs/${collab.id}`}>View Details</Link>
              </Button>
               <Button size="sm" className="ml-auto" disabled>Request Collab (TBD)</Button>
            </CardFooter>
          </Card>
        ))}
      </div>
       {/* Pagination Placeholder */}
       <div className="flex justify-center mt-8">
         <Button variant="outline" disabled>Load More</Button>
       </div>
    </div>
  );
}
