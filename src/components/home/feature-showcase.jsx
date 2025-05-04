'use client';

import React from 'react';
import Image from 'next/image';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel';
import { Zap, BarChart, Award, Users } from 'lucide-react';
import Autoplay from "embla-carousel-autoplay" // Import autoplay plugin

// Feature data (can be passed as props or defined here)
const features = [
  { icon: Zap, title: 'AI Content Ideas', description: 'Break through creative blocks with AI-generated content suggestions.', hint: 'artificial intelligence brain creativity', imageSeed: 10 },
  { icon: BarChart, title: 'Predictive Analytics', description: 'Gain insights into potential content performance (feature coming soon!).', hint: 'chart graph data analytics', imageSeed: 11 },
  { icon: Award, title: 'Opportunity Hub', description: 'Find paid gigs and exciting projects posted by brands and businesses.', hint: 'job board opportunity handshake', imageSeed: 12 },
  { icon: Users, title: 'Collaboration Platform', description: 'Connect with fellow creators for joint ventures and cross-promotions.', hint: 'teamwork collaboration people connect', imageSeed: 13 },
];

export default function FeatureShowcase() {
  const plugin = React.useRef(
    Autoplay({ delay: 4000, stopOnInteraction: true }) // Autoplay every 4 seconds
  )

  return (
    <Carousel
      plugins={[plugin.current]}
      className="w-full max-w-4xl mx-auto" // Adjust max-width as needed
      onMouseEnter={plugin.current.stop}
      onMouseLeave={plugin.current.reset}
      opts={{
        loop: true, // Loop the carousel
      }}
    >
      <CarouselContent>
        {features.map((feature, index) => (
          <CarouselItem key={index} className="md:basis-1/2 lg:basis-1/3"> {/* Show 1, 2, or 3 items based on screen size */}
            <div className="p-1">
              <Card className="flex flex-col h-full overflow-hidden hover:shadow-lg transition-shadow duration-300">
                <CardHeader>
                  <feature.icon className="h-8 w-8 mb-2 text-primary" />
                  <CardTitle>{feature.title}</CardTitle>
                  <CardDescription>{feature.description}</CardDescription>
                </CardHeader>
                <CardContent className="flex-grow flex items-end mt-auto"> {/* Use flex-grow and items-end */}
                  <Image
                    src={`https://picsum.photos/400/250?random=${feature.imageSeed}`} // Use picsum photos with seeds
                    alt={feature.title}
                    data-ai-hint={feature.hint}
                    width={400}
                    height={250}
                    className="rounded-md object-cover w-full h-auto mt-4" // Ensure image scales well
                  />
                </CardContent>
              </Card>
            </div>
          </CarouselItem>
        ))}
      </CarouselContent>
      <CarouselPrevious className="hidden sm:flex" /> {/* Hide controls on very small screens */}
      <CarouselNext className="hidden sm:flex" />
    </Carousel>
  );
}