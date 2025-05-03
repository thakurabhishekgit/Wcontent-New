'use client';

import { useParams } from 'next/navigation';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Briefcase, MapPin, Clock, DollarSign, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { Skeleton } from '@/components/ui/skeleton'; // For loading state

// Placeholder data fetch function - replace with actual data fetching
async function getOpportunityDetails(id: string) {
  console.log(`Fetching details for opportunity ID: ${id}`);
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 500));

  // Find the opportunity in the placeholder data (from opportunities/page.tsx)
   const opportunities = [
    { id: 1, title: 'Tech Gadget Review Video', company: 'GadgetCo', type: 'Paid Gig', location: 'Remote', postedDate: '2 days ago', budget: '$500 - $1000', description: 'Looking for a tech reviewer to create a 5-minute YouTube video showcasing our new smart watch. Responsibilities include unboxing, feature demonstration, and honest review. Must have own recording equipment and editing skills. Link to previous work required.' },
    { id: 2, title: 'Sponsored Blog Post - Sustainable Fashion', company: 'EcoThreads', type: 'Paid Gig', location: 'Remote', postedDate: '5 days ago', budget: '$300', description: 'Write an engaging blog post (800-1200 words) about sustainable fashion choices, featuring our latest collection. Include high-quality photos (product samples can be provided). SEO knowledge is a plus.' },
    { id: 3, title: 'Travel Vlogger for Destination Marketing', company: 'VisitParadise Agency', type: 'Travel Opp', location: 'Bali, Indonesia (Travel Provided)', postedDate: '1 week ago', budget: 'Expenses Covered + Fee', description: 'Seeking an experienced travel vlogger (min. 20k subs) to capture the beauty of Bali for a 1-week tourism campaign. Deliverables include 2 vlogs and 10 high-res photos. Flights and accommodation covered.' },
    { id: 4, title: 'Recipe Development - Vegan Snacks', company: 'HealthyBites', type: 'Paid Gig', location: 'Remote', postedDate: '1 week ago', budget: '$150 per recipe', description: 'Develop and photograph 3 unique vegan snack recipes using our new plant-based protein powder. Recipes should be easy to follow and visually appealing. Final deliverables: recipe text + 5 photos per recipe.' },
    { id: 5, title: 'Instagram Campaign - Fitness Apparel', company: 'FitGear', type: 'Paid Gig', location: 'Remote', postedDate: '10 days ago', budget: 'Negotiable (based on reach)', description: 'Collaborate on an Instagram campaign (3 posts + 2 stories) promoting our new activewear line. Must have a fitness or lifestyle focus with an engaged audience. Provide media kit/rate card.' },
  ];
  const opportunity = opportunities.find(opp => opp.id.toString() === id);
  return opportunity; // Returns undefined if not found
}


export default function OpportunityDetailPage() {
  const params = useParams();
  const id = params.id as string;
  const [opportunity, setOpportunity] = React.useState<any>(null); // Use specific type later
  const [isLoading, setIsLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);

   React.useEffect(() => {
    if (id) {
      setIsLoading(true);
      setError(null);
      getOpportunityDetails(id)
        .then(data => {
          if (data) {
            setOpportunity(data);
          } else {
             setError('Opportunity not found.');
          }
        })
        .catch(err => {
          console.error("Failed to fetch opportunity:", err);
          setError('Failed to load opportunity details.');
        })
        .finally(() => {
          setIsLoading(false);
        });
    }
  }, [id]);


  if (isLoading) {
    return <OpportunityDetailSkeleton />;
  }

  if (error) {
    return (
       <div className="text-center py-10">
         <p className="text-destructive text-lg mb-4">{error}</p>
         <Button variant="outline" asChild>
           <Link href="/opportunities"><ArrowLeft className="mr-2 h-4 w-4" /> Back to Opportunities</Link>
         </Button>
       </div>
     );
  }

   if (!opportunity) {
     // Should be caught by error state, but as a fallback
     return <p>Opportunity details could not be loaded.</p>;
   }

  return (
    <div className="space-y-6">
       <Button variant="outline" size="sm" asChild className="mb-4">
          <Link href="/opportunities"><ArrowLeft className="mr-2 h-4 w-4" /> Back to Opportunities</Link>
       </Button>

       <Card>
        <CardHeader>
           <div className="flex justify-between items-start mb-2">
              <Badge variant={opportunity.type === 'Paid Gig' ? 'default' : 'secondary'}>{opportunity.type}</Badge>
              <span className="text-xs text-foreground/60 flex items-center">
                <Clock className="h-3 w-3 mr-1" /> {opportunity.postedDate}
              </span>
           </div>
           <CardTitle className="text-2xl md:text-3xl">{opportunity.title}</CardTitle>
           <div className="flex flex-wrap gap-x-4 gap-y-1 pt-2 text-sm">
             <CardDescription className="flex items-center">
                <Briefcase className="h-4 w-4 mr-1.5 text-foreground/70" /> {opportunity.company}
             </CardDescription>
             <CardDescription className="flex items-center">
                <MapPin className="h-4 w-4 mr-1.5 text-foreground/70" /> {opportunity.location}
             </CardDescription>
              <CardDescription className="flex items-center font-medium">
                <DollarSign className="h-4 w-4 mr-1.5 text-primary" /> {opportunity.budget}
              </CardDescription>
           </div>
        </CardHeader>
        <CardContent className="prose prose-invert max-w-none dark:prose-invert prose-sm md:prose-base">
           <h3 className="text-lg font-semibold mb-2 text-foreground">Description</h3>
           {/* Render description safely. If it contains markdown, use a markdown renderer */}
           <p>{opportunity.description}</p>
           {/* Add more sections like Responsibilities, Requirements etc. if available */}
        </CardContent>
        <CardFooter>
           <Button size="lg" disabled>Apply Now (TBD)</Button>
        </CardFooter>
       </Card>
    </div>
  );
}


// Skeleton component for loading state
function OpportunityDetailSkeleton() {
  return (
    <div className="space-y-6">
      <Skeleton className="h-8 w-48 mb-4" /> {/* Back button */}
      <Card>
        <CardHeader>
          <div className="flex justify-between items-start mb-2">
            <Skeleton className="h-6 w-20" /> {/* Badge */}
            <Skeleton className="h-4 w-24" /> {/* Date */}
          </div>
          <Skeleton className="h-8 w-3/4 mb-2" /> {/* Title */}
          <div className="flex flex-wrap gap-x-4 gap-y-1 pt-2">
             <Skeleton className="h-5 w-32" /> {/* Company */}
             <Skeleton className="h-5 w-28" /> {/* Location */}
             <Skeleton className="h-5 w-36" /> {/* Budget */}
          </div>
        </CardHeader>
        <CardContent>
          <Skeleton className="h-5 w-40 mb-4" /> {/* Description heading */}
          <Skeleton className="h-4 w-full mb-2" />
          <Skeleton className="h-4 w-full mb-2" />
          <Skeleton className="h-4 w-5/6 mb-2" />
           <Skeleton className="h-4 w-4/6" />
        </CardContent>
        <CardFooter>
          <Skeleton className="h-12 w-36" /> {/* Apply button */}
        </CardFooter>
      </Card>
    </div>
  );
}

