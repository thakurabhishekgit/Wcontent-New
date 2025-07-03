
'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { ArrowRight, Zap, Lightbulb, Star, Brain, TrendingUp, DollarSign, Share2, CheckCircle, Search, Users as UsersIcon, Briefcase, FileText, Video, MessageSquare, Target as TargetIcon, BarChart2, LayoutGrid, Layers } from 'lucide-react';
import WcontentLogo from '@/components/icons/wcontent-logo';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import Autoplay from "embla-carousel-autoplay";


// Reusable Feature Card component for detailed feature sections
const FeatureSectionCard = ({ icon: Icon, title, description, imageSrc, imageHint, ctaText, ctaLink, reverse = false }) => (
  <div className={`container mx-auto px-4 py-12 md:py-16`}>
    <div className={`flex flex-col md:flex-row items-center gap-8 md:gap-12 ${reverse ? 'md:flex-row-reverse' : ''}`}>
      <div className="md:w-1/2">
        <Image
          src={imageSrc}
          alt={title}
          data-ai-hint={imageHint}
          width={600}
          height={400}
          className="rounded-lg object-cover shadow-xl"
        />
      </div>
      <div className="md:w-1/2 text-center md:text-left">
        <Icon className="h-10 w-10 text-primary mb-4 mx-auto md:mx-0" />
        <h3 className="text-3xl font-bold mb-3">{title}</h3>
        <p className="text-lg text-muted-foreground mb-6">{description}</p>
        <Button asChild variant="outline">
          <Link href={ctaLink}>
            {ctaText} <ArrowRight className="ml-2 h-5 w-5" />
          </Link>
        </Button>
      </div>
    </div>
  </div>
);

const HowItWorksStep = ({ step, title, description }) => (
  <Card className="text-center">
    <CardHeader>
      <CardTitle className="text-4xl font-bold text-primary mb-2">{step}</CardTitle>
      <CardDescription className="text-xl font-semibold">{title}</CardDescription>
    </CardHeader>
    <CardContent>
      <p className="text-muted-foreground">{description}</p>
    </CardContent>
  </Card>
);

const testimonials = [
  { quote: "Wcontent's AI tools are a game-changer for brainstorming. I'm never stuck for ideas anymore!", name: "Alex R.", role: "Tech YouTuber", stars: 5, image: "https://placehold.co/100x100.png" },
  { quote: "Found an amazing brand deal through the Opportunity Hub. The process was seamless.", name: "Maria G.", role: "Lifestyle Blogger", stars: 5, image: "https://placehold.co/100x100.png" },
  { quote: "Collaborating with another creator I met on Wcontent doubled my video's reach!", name: "Sam K.", role: "Gaming Streamer", stars: 4, image: "https://placehold.co/100x100.png" },
  { quote: "The prediction tools helped me understand my audience better. Highly recommend!", name: "Priya S.", role: "Educational Content Creator", stars: 5, image: "https://placehold.co/100x100.png" },
];


export default function Home() {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) {
    // Basic skeleton or null to prevent hydration mismatch during SSR
    return null;
  }

  return (
    <div className="space-y-20 md:space-y-32 overflow-x-hidden"> {/* Added overflow-x-hidden */}
      {/* Hero Section */}
      <section className="text-center py-20 md:py-32 min-h-[80vh] md:min-h-[90vh] flex flex-col justify-center items-center bg-gradient-to-b from-background via-primary/10 to-background animate-fade-in overflow-hidden">
        <div className="container mx-auto px-4 z-10">
          <div className="flex justify-center mb-6 animate-fade-in" style={{ animationDelay: '0.2s' }}>
            <WcontentLogo className="h-16 w-16 md:h-20 md:w-20 text-primary" />
          </div>
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-6 animate-fade-in text-foreground" style={{ animationDelay: '0.4s' }}>
            Wcontent: The Ultimate Platform for Creators
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto mb-10 animate-fade-in" style={{ animationDelay: '0.6s' }}>
            Generate ideas, predict performance, find opportunities, and collaborate with ease. Elevate your content game with AI-powered tools and a vibrant community.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4 animate-fade-in" style={{ animationDelay: '0.8s' }}>
            <Button asChild size="lg" className="bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg transform hover:scale-105 transition-transform">
              <Link href="/generate">
                Get Started Free <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="text-foreground hover:bg-accent hover:text-accent-foreground border-border">
              <Link href="/dashboard">Go to Dashboard</Link>
            </Button>
          </div>
        </div>
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 animate-bounce hidden md:block">
            <ArrowRight className="h-6 w-6 text-muted-foreground rotate-90" />
        </div>
      </section>

      {/* Key Benefits Section */}
      <section className="container mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold">Unlock Your Creative Potential</h2>
          <p className="text-lg text-muted-foreground mt-2 max-w-2xl mx-auto">Wcontent empowers you with the tools and connections you need to thrive.</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            { icon: Brain, title: 'AI-Driven Insights', description: 'Leverage artificial intelligence to generate fresh content ideas, headlines, and outlines in seconds.' },
            { icon: DollarSign, title: 'Monetize Your Talent', description: 'Discover paid gigs, sponsorships, and projects from brands actively seeking creators like you.' },
            { icon: Share2, title: 'Expand Your Network', description: 'Connect with fellow creators for collaborations, cross-promotions, and building valuable partnerships.' },
          ].map((benefit, index) => (
            <Card key={index} className="text-center p-6 hover:shadow-xl transition-shadow duration-300 bg-card/80 border-border/50">
              <div className="flex justify-center mb-4">
                <benefit.icon className="h-10 w-10 text-primary" />
              </div>
              <CardTitle className="text-xl font-semibold mb-2">{benefit.title}</CardTitle>
              <CardDescription>{benefit.description}</CardDescription>
            </Card>
          ))}
        </div>
      </section>

      {/* Detailed Feature Sections */}
      <FeatureSectionCard
        icon={Lightbulb}
        title="Never Run Out of Ideas Again"
        description="Our AI Content Generation Suite helps you brainstorm unique ideas, craft compelling headlines, and structure your content with comprehensive outlines. Say goodbye to creative blocks!"
        imageSrc="https://placehold.co/600x400.png"
        imageHint="vector idea generation"
        ctaText="Try Our Idea Generator"
        ctaLink="/generate"
      />

      <FeatureSectionCard
        icon={TrendingUp}
        title="Understand Your Audience, Predict Your Success"
        description="Analyze YouTube comment sentiment to gauge audience reaction and get AI-driven suggestions. Forecast potential audience growth and retention for your upcoming content strategies."
        imageSrc="https://placehold.co/600x400.png"
        imageHint="vector data analytics"
        ctaText="Analyze Your Content"
        ctaLink="/predict"
        reverse={true}
      />

      <FeatureSectionCard
        icon={Briefcase}
        title="Find Your Next Paid Gig or Project"
        description="Explore a curated marketplace of opportunities from brands and businesses looking for content creators. Filter by type, location, and budget to find your perfect match."
        imageSrc="https://placehold.co/600x400.png"
        imageHint="vector opportunity search"
        ctaText="Browse Opportunities"
        ctaLink="/opportunities"
      />

      <FeatureSectionCard
        icon={UsersIcon}
        title="Connect and Create with Fellow Creators"
        description="Join our Collaboration Hub to find like-minded creators for joint videos, podcast guest swaps, social media campaigns, and more. Expand your reach and create amazing content together."
        imageSrc="https://placehold.co/600x400.png"
        imageHint="vector collaboration network"
        ctaText="Find Collaborators"
        ctaLink="/collabs"
        reverse={true}
      />

      {/* How It Works Section */}
      <section className="container mx-auto px-4 py-16 bg-gradient-to-br from-card/50 via-muted/30 to-card/50 rounded-lg">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold">Get Started in 3 Simple Steps</h2>
          <p className="text-lg text-muted-foreground mt-2 max-w-xl mx-auto">Joining Wcontent and leveraging its power is quick and easy.</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <HowItWorksStep
            step="01"
            title="Sign Up & Create Profile"
            description="Quickly register and set up your creator profile to showcase your skills and channel."
          />
          <HowItWorksStep
            step="02"
            title="Explore & Generate"
            description="Dive into AI tools for ideas, browse opportunities, or post your collaboration needs."
          />
          <HowItWorksStep
            step="03"
            title="Connect & Grow"
            description="Apply for gigs, collaborate with creators, and watch your content journey flourish."
          />
        </div>
      </section>

      {/* Testimonials Section with Carousel */}
      <section className="container mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold">Loved by Creators Worldwide</h2>
          <p className="text-lg text-muted-foreground mt-2 max-w-xl mx-auto">Hear what our community says about Wcontent.</p>
        </div>
        <Carousel
          opts={{ align: "start", loop: true }}
          plugins={[ Autoplay({ delay: 5000, stopOnInteraction: true }) ]}
          className="w-full max-w-xs sm:max-w-lg md:max-w-2xl lg:max-w-4xl xl:max-w-6xl mx-auto"
        >
          <CarouselContent className="-ml-4">
            {testimonials.map((testimonial, index) => (
              <CarouselItem key={index} className="pl-4 md:basis-1/2 lg:basis-1/3">
                <div className="p-1">
                  <Card className="flex flex-col h-full p-6 hover:shadow-xl transition-shadow duration-300 bg-card/70 border-border/60">
                    <CardHeader className="p-0 mb-4 items-center">
                       <Image
                         src={testimonial.image}
                         alt={testimonial.name}
                         data-ai-hint="vector person avatar"
                         width={80}
                         height={80}
                         className="rounded-full mb-3 border-2 border-primary"
                       />
                      <div className="flex">
                        {[...Array(testimonial.stars)].map((_, i) => <Star key={i} className="h-5 w-5 text-primary fill-primary" />)}
                        {[...Array(5 - testimonial.stars)].map((_, i) => <Star key={i + testimonial.stars} className="h-5 w-5 text-muted-foreground/50 fill-muted-foreground/30" />)}
                      </div>
                    </CardHeader>
                    <CardContent className="p-0 flex-grow">
                      <p className="italic text-lg text-foreground/90 mb-4 text-center">"{testimonial.quote}"</p>
                    </CardContent>
                    <CardFooter className="p-0 mt-auto text-center flex flex-col items-center">
                      <p className="font-semibold">{testimonial.name}</p>
                      <p className="text-sm text-muted-foreground">{testimonial.role}</p>
                    </CardFooter>
                  </Card>
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious className="absolute left-0 top-1/2 -translate-y-1/2 z-10 disabled:opacity-30" />
          <CarouselNext className="absolute right-0 top-1/2 -translate-y-1/2 z-10 disabled:opacity-30" />
        </Carousel>
      </section>

      {/* Final Call to Action Section */}
      <section className="container mx-auto px-4 py-16 text-center bg-gradient-to-r from-primary/10 via-background to-primary/20 rounded-lg border border-primary/30">
        <CheckCircle className="h-16 w-16 text-primary mx-auto mb-6" />
        <h2 className="text-3xl md:text-5xl font-bold mb-6">Ready to Elevate Your Content Game?</h2>
        <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto mb-10">
          Join the Wcontent community today! Unlock powerful AI tools, discover exciting opportunities, and connect with fellow creators to accelerate your growth.
        </p>
        <Button asChild size="lg" className="bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg px-10 py-6 text-lg transform hover:scale-105 transition-transform">
          <Link href="/auth">
            Sign Up Now &amp; Get Started <ArrowRight className="ml-2 h-5 w-5" />
          </Link>
        </Button>
      </section>
    </div>
  );
}

    