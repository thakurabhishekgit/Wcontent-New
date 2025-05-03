
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Briefcase, MapPin, Clock, DollarSign } from 'lucide-react';
import Link from 'next/link';

// Placeholder data - replace with actual data fetching later
const opportunities = [
  { id: 1, title: 'Tech Gadget Review Video', company: 'GadgetCo', type: 'Paid Gig', location: 'Remote', postedDate: '2 days ago', budget: '$500 - $1000', description: 'Looking for a tech reviewer to create a 5-minute YouTube video showcasing our new smart watch.' },
  { id: 2, title: 'Sponsored Blog Post - Sustainable Fashion', company: 'EcoThreads', type: 'Paid Gig', location: 'Remote', postedDate: '5 days ago', budget: '$300', description: 'Write an engaging blog post about sustainable fashion choices, featuring our latest collection.' },
  { id: 3, title: 'Travel Vlogger for Destination Marketing', company: 'VisitParadise Agency', type: 'Travel Opp', location: 'Bali, Indonesia (Travel Provided)', postedDate: '1 week ago', budget: 'Expenses Covered + Fee', description: 'Seeking an experienced travel vlogger to capture the beauty of Bali for a tourism campaign.' },
  { id: 4, title: 'Recipe Development - Vegan Snacks', company: 'HealthyBites', type: 'Paid Gig', location: 'Remote', postedDate: '1 week ago', budget: '$150 per recipe', description: 'Develop and photograph 3 unique vegan snack recipes using our new plant-based protein powder.' },
  { id: 5, title: 'Instagram Campaign - Fitness Apparel', company: 'FitGear', type: 'Paid Gig', location: 'Remote', postedDate: '10 days ago', budget: 'Negotiable', description: 'Collaborate on an Instagram campaign (3 posts + 2 stories) promoting our new activewear line.' },
];

export default function OpportunitiesPage() {
  return (
    <div className="space-y-8">
      <h1 className="text-3xl md:text-4xl font-bold">Opportunities Hub</h1>
      <p className="text-lg text-foreground/80">
        Discover paid gigs, brand collaborations, and exciting projects tailored for content creators.
      </p>

      {/* Filtering/Sorting Placeholder */}
      <div className="flex flex-wrap gap-2">
         {/* Add filter/sort components here later */}
         <Button variant="outline" size="sm" disabled>Filter by Type</Button>
         <Button variant="outline" size="sm" disabled>Sort by Date</Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {opportunities.map((opp) => (
          <Card key={opp.id} className="flex flex-col justify-between hover:shadow-md transition-shadow duration-200">
            <CardHeader>
              <div className="flex justify-between items-start mb-2">
                 <Badge variant={opp.type === 'Paid Gig' ? 'default' : 'secondary'}>{opp.type}</Badge>
                 <span className="text-xs text-foreground/60 flex items-center">
                   <Clock className="h-3 w-3 mr-1" /> {opp.postedDate}
                 </span>
              </div>
              <CardTitle className="text-xl">{opp.title}</CardTitle>
              <CardDescription className="flex items-center text-sm">
                 <Briefcase className="h-4 w-4 mr-1.5 text-foreground/70" /> {opp.company}
              </CardDescription>
               <CardDescription className="flex items-center text-sm">
                 <MapPin className="h-4 w-4 mr-1.5 text-foreground/70" /> {opp.location}
               </CardDescription>
               <CardDescription className="flex items-center text-sm pt-1 font-medium">
                 <DollarSign className="h-4 w-4 mr-1.5 text-primary" /> {opp.budget}
               </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-foreground/80 line-clamp-3">{opp.description}</p>
            </CardContent>
            <CardFooter>
              <Button variant="outline" size="sm" asChild>
                {/* Link to a detailed opportunity page later */}
                <Link href={`/opportunities/${opp.id}`}>View Details</Link>
              </Button>
               <Button size="sm" className="ml-auto" disabled>Apply Now (TBD)</Button>
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
