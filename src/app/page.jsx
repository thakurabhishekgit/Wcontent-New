'use client'; // Required for useState and useEffect

import React, { useState, useEffect } from 'react'; // Import hooks
import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { ArrowRight, Zap, BarChart, Users, Award, Star } from 'lucide-react';
import { cn } from '@/lib/utils'; // Import cn utility function
import WcontentLogo from '@/components/icons/wcontent-logo'; // Import the logo
import FeatureShowcase from '@/components/home/feature-showcase'; // Import the new FeatureShowcase component


// Define content for the hero slider using picsum images
const heroSlides = [
  {
    imageUrl: 'https://picsum.photos/1200/800?random=1&grayscale&blur=2', // Blurred grayscale
    imageHint: 'abstract dark texture background',
    title: 'Empower Your Content Creation with Wcontent', // Updated title
    description: 'Wcontent is the ultimate platform for creators, providing AI-powered tools to streamline your workflow, generate fresh ideas, and connect with collaborators.', // Updated description
  },
  {
    imageUrl: 'https://picsum.photos/1200/800?random=2&grayscale&blur=2', // Blurred grayscale
    imageHint: 'abstract dark blue texture background',
    title: 'Generate Ideas Instantly',
    description: 'Break through creative blocks using our AI idea generator for videos, blogs, and social media.',
  },
  {
    imageUrl: 'https://picsum.photos/1200/800?random=3&grayscale&blur=2', // Blurred grayscale
    imageHint: 'abstract dark network connection background',
    title: 'Connect & Collaborate',
    description: 'Find opportunities and collaborate with other creators to expand your reach and impact.',
  },
];


export default function Home() {
  const [activeIndex, setActiveIndex] = useState(0);

  // Effect to handle automatic slide change
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveIndex((prevIndex) => (prevIndex + 1) % heroSlides.length);
    }, 5000); // Change slide every 5 seconds

    return () => clearInterval(interval); // Cleanup interval on component unmount
  }, []); // Empty dependency array means this runs once on mount

  const currentSlide = heroSlides[activeIndex];

  return (
    // Removed container mx-auto to allow full-width hero
    <div className="space-y-16 md:space-y-24">
      {/* Hero Section - Modified for Slider */}
      <section className="relative text-center pt-24 pb-16 md:pt-32 md:pb-24 overflow-hidden min-h-[60vh] md:min-h-[70vh] flex flex-col justify-center items-center text-white">
        {/* Background Image Slider */}
        {heroSlides.map((slide, index) => (
          <Image
            key={index}
            src={slide.imageUrl}
            alt={`Hero background ${index + 1}`}
            data-ai-hint={slide.imageHint}
            fill
            priority={index === 0} // Prioritize loading the first image
            className={cn(
              'object-cover transition-opacity duration-1000 ease-in-out -z-10', // Use z-index -10
              index === activeIndex ? 'opacity-100' : 'opacity-0'
            )}
          />
        ))}
        {/* Overlay for text readability */}
        <div className="absolute inset-0 bg-black/50 z-[-5]"></div> {/* Slightly darker overlay */}

        {/* Content Overlay - Constrained width */}
        <div className="container mx-auto px-4 z-10">
           {/* Animated Text Content */}
           <div key={activeIndex} className="animate-fade-in"> {/* Add key to force re-render/animation */}
             <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-4 flex items-center justify-center gap-3">
                <WcontentLogo className="h-10 w-10 md:h-14 md:w-14" /> {currentSlide.title} {/* Add logo to title */}
             </h1>
             <p className="text-lg md:text-xl text-white/90 max-w-3xl mx-auto mb-8">
               {currentSlide.description}
             </p>
           </div>

          <div className="flex justify-center gap-4 mb-12">
            <Button asChild size="lg">
              <Link href="/generate">
                Get Started <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="bg-white/10 border-white/50 backdrop-blur-sm hover:bg-white/20 text-white">
              <Link href="/dashboard">Go to Dashboard</Link>
            </Button>
          </div>
          {/* Moved Accordion inside Hero but after buttons */}
          <div className="mt-12 max-w-2xl mx-auto bg-background/70 dark:bg-background/80 backdrop-blur-md rounded-lg p-4 border border-white/20 text-foreground dark:text-foreground"> {/* Accordion background */}
            <Accordion type="single" collapsible className="w-full text-left">
              <AccordionItem value="item-1" className="border-white/20">
                <AccordionTrigger className="text-lg font-semibold hover:no-underline text-white dark:text-white">What is Wcontent?</AccordionTrigger> {/* Updated name */}
                <AccordionContent className="text-white/80 dark:text-white/80">
                  Wcontent is the ultimate platform for creators, offering tools like AI-powered idea generation, content prediction insights, and opportunities to collaborate with others. We aim to simplify your creative process and help you grow. {/* Updated description */}
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="item-2" className="border-white/20">
                <AccordionTrigger className="text-lg font-semibold hover:no-underline text-white dark:text-white">Who is it for?</AccordionTrigger>
                <AccordionContent className="text-white/80 dark:text-white/80">
                  Whether you're a blogger, YouTuber, social media influencer, or any kind of digital creator, Wcontent provides valuable tools to enhance your productivity and reach. {/* Updated name */}
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="item-3" className="border-b-0">
                <AccordionTrigger className="text-lg font-semibold hover:no-underline text-white dark:text-white">How does the AI generation work?</AccordionTrigger>
                <AccordionContent className="text-white/80 dark:text-white/80">
                  Our AI uses advanced language models. Simply provide a prompt or topic, and it will generate relevant content ideas, headlines, or outlines to kickstart your creative process.
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>
        </div>
      </section>

      {/* Add container back for the rest of the content */}
      <div className="container mx-auto space-y-16 md:space-y-24">

        {/* Features Section */}
        <section className="space-y-12">
          <div className="text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-3">Core Features</h2>
            <p className="text-muted-foreground max-w-xl mx-auto">Tools designed to boost your content creation journey.</p>
          </div>
           {/* Replace the old grid with the FeatureShowcase carousel */}
           <div className="mt-12">
             <FeatureShowcase />
           </div>
        </section>

        {/* Testimonials Section */}
        <section className="text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-3">What Creators Say</h2>
          <p className="text-muted-foreground max-w-xl mx-auto mb-12">Hear directly from creators using Wcontent.</p> {/* Updated name */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {[
              { quote: "Wcontent's idea generator saved me hours of brainstorming!", name: "Alex R.", role: "Blogger" }, // Updated name
              { quote: "Finding collaboration opportunities used to be tough. This platform makes it easy.", name: "Maria G.", role: "YouTuber" },
              { quote: "The dashboard helps me keep everything organized. Love the dark theme!", name: "Sam K.", role: "Podcast Host" }
            ].map((testimonial, index) => (
              <Card key={index} className="bg-card/80 border border-border/60 text-left">
                <CardContent className="pt-6">
                  <div className="flex mb-2">
                    {[...Array(5)].map((_, i) => <Star key={i} className="h-4 w-4 text-primary fill-primary" />)}
                  </div>
                  <p className="italic mb-4 text-foreground/90">"{testimonial.quote}"</p>
                  <p className="font-semibold">{testimonial.name}</p>
                  <p className="text-xs text-foreground/60">{testimonial.role}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Call to Action Section */}
        <section className="text-center bg-gradient-to-r from-teal-900/30 via-background to-teal-900/30 py-16 rounded-lg border border-teal-800/50">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Ready to Elevate Your Content?</h2>
          <p className="text-lg text-foreground/80 mb-8 max-w-2xl mx-auto">
            Join Wcontent today and unlock powerful tools to boost your creativity and growth. {/* Updated name */}
          </p>
          <Button asChild size="lg" className="bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg transform hover:scale-105 transition-transform">
             <Link href="/dashboard">
                 Explore Your Dashboard <ArrowRight className="ml-2 h-5 w-5" />
             </Link>
          </Button>
        </section>
      </div>
    </div>
  );
}
