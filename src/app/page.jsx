
'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { ArrowRight, Zap, BarChart2, Users, Briefcase, Lightbulb, Star, Brain, TrendingUp, DollarSign, Share2, CheckCircle, Search } from 'lucide-react';
import WcontentLogo from '@/components/icons/wcontent-logo';

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
    <div className="space-y-20 md:space-y-32">
      {/* Hero Section */}
      <section className="relative text-center py-20 md:py-32 min-h-[70vh] flex flex-col justify-center items-center text-white overflow-hidden">
        <Image
          src="https://picsum.photos/1600/900?random=hero&grayscale&blur=2"
          alt="Abstract background for Wcontent hero section"
          data-ai-hint="abstract dark tech background"
          fill
          priority
          className="object-cover -z-10"
        />
        <div className="absolute inset-0 bg-black/60 -z-[5]"></div>

        <div className="container mx-auto px-4 z-10 animate-fade-in">
          <div className="flex justify-center mb-6">
            <WcontentLogo className="h-16 w-16 md:h-20 md:w-20 text-primary" />
          </div>
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-6">
            Wcontent: Your AI Co-Pilot for Content Creation Success
          </h1>
          <p className="text-lg md:text-xl text-white/90 max-w-3xl mx-auto mb-10">
            Generate ideas, predict performance, find opportunities, and collaborate with ease. Elevate your content game.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Button asChild size="lg" className="bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg transform hover:scale-105 transition-transform">
              <Link href="/generate">
                Get Started Free <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="bg-white/10 border-white/50 backdrop-blur-sm hover:bg-white/20 text-white">
              <Link href="/dashboard">Go to Dashboard</Link>
            </Button>
          </div>
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
            <Card key={index} className="text-center p-6 hover:shadow-xl transition-shadow duration-300">
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
        imageSrc="https://picsum.photos/600/400?random=generate&grayscale&blur=1"
        imageHint="ai brain idea generation abstract"
        ctaText="Try Our Idea Generator"
        ctaLink="/generate"
      />

      <FeatureSectionCard
        icon={TrendingUp}
        title="Understand Your Audience, Predict Your Success"
        description="Analyze YouTube comment sentiment to gauge audience reaction and get AI-driven suggestions. Forecast potential audience growth and retention for your upcoming content strategies."
        imageSrc="https://picsum.photos/600/400?random=predict&grayscale&blur=1"
        imageHint="data analytics chart graph arrow"
        ctaText="Analyze Your Content"
        ctaLink="/predict"
        reverse={true}
      />

      <FeatureSectionCard
        icon={Briefcase}
        title="Find Your Next Paid Gig or Project"
        description="Explore a curated marketplace of opportunities from brands and businesses looking for content creators. Filter by type, location, and budget to find your perfect match."
        imageSrc="https://picsum.photos/600/400?random=opportunities&grayscale&blur=1"
        imageHint="job board opportunity network briefcase"
        ctaText="Browse Opportunities"
        ctaLink="/opportunities"
      />

      <FeatureSectionCard
        icon={Users}
        title="Connect and Create with Fellow Creators"
        description="Join our Collaboration Hub to find like-minded creators for joint videos, podcast guest swaps, social media campaigns, and more. Expand your reach and create amazing content together."
        imageSrc="https://picsum.photos/600/400?random=collabs&grayscale&blur=1"
        imageHint="team collaboration network people connect"
        ctaText="Find Collaborators"
        ctaLink="/collabs"
        reverse={true}
      />
      
      {/* How It Works Section */}
      <section className="container mx-auto px-4 py-16 bg-muted/30 rounded-lg">
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

      {/* Testimonials Section */}
      <section className="container mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold">Loved by Creators Worldwide</h2>
          <p className="text-lg text-muted-foreground mt-2 max-w-xl mx-auto">Hear what our community says about Wcontent.</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            { quote: "Wcontent's AI tools are a game-changer for brainstorming. I'm never stuck for ideas anymore!", name: "Alex R.", role: "Tech YouTuber", stars: 5 },
            { quote: "Found an amazing brand deal through the Opportunity Hub. The process was seamless.", name: "Maria G.", role: "Lifestyle Blogger", stars: 5 },
            { quote: "Collaborating with another creator I met on Wcontent doubled my video's reach!", name: "Sam K.", role: "Gaming Streamer", stars: 4 },
          ].map((testimonial, index) => (
            <Card key={index} className="flex flex-col p-6 hover:shadow-xl transition-shadow duration-300">
              <CardHeader className="p-0 mb-4">
                <div className="flex">
                  {[...Array(testimonial.stars)].map((_, i) => <Star key={i} className="h-5 w-5 text-primary fill-primary" />)}
                  {[...Array(5-testimonial.stars)].map((_, i) => <Star key={i+testimonial.stars} className="h-5 w-5 text-muted-foreground/50 fill-muted-foreground/30" />)}
                </div>
              </CardHeader>
              <CardContent className="p-0 flex-grow">
                <p className="italic text-lg text-foreground/90 mb-4">"{testimonial.quote}"</p>
              </CardContent>
              <CardFooter className="p-0 mt-auto">
                <div>
                  <p className="font-semibold">{testimonial.name}</p>
                  <p className="text-sm text-muted-foreground">{testimonial.role}</p>
                </div>
              </CardFooter>
            </Card>
          ))}
        </div>
      </section>

      {/* Final Call to Action Section */}
      <section className="container mx-auto px-4 py-16 text-center bg-gradient-to-br from-primary/10 via-background to-primary/20 rounded-lg border border-primary/30">
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
