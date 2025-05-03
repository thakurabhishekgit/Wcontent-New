import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { ArrowRight, Zap, BarChart, Users, Award } from 'lucide-react';

export default function Home() {
  return (
    <div className="space-y-16 md:space-y-24">
      {/* Hero Section */}
      <section className="text-center pt-16 pb-12 md:pt-24 md:pb-16">
        <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-4 bg-gradient-to-r from-primary via-teal-400 to-teal-600 bg-clip-text text-transparent">
          Empower Your Content Creation
        </h1>
        <p className="text-lg md:text-xl text-foreground/80 max-w-3xl mx-auto mb-8">
          WContent Lite provides AI-powered tools to streamline your workflow, generate fresh ideas, and connect with collaborators.
        </p>
        <div className="flex justify-center gap-4">
          <Button asChild size="lg">
            <Link href="/generate">
              Get Started <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </Button>
          <Button asChild variant="outline" size="lg">
            <Link href="/dashboard">Go to Dashboard</Link>
          </Button>
        </div>
        <div className="mt-12 max-w-2xl mx-auto">
         <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="item-1">
              <AccordionTrigger className="text-lg font-semibold">What is WContent Lite?</AccordionTrigger>
              <AccordionContent className="text-left text-foreground/70">
                WContent Lite is a platform designed for content creators, offering tools like AI-powered idea generation, content prediction insights (coming soon!), and opportunities to collaborate with others. We aim to simplify your creative process and help you grow.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-2">
              <AccordionTrigger className="text-lg font-semibold">Who is it for?</AccordionTrigger>
              <AccordionContent className="text-left text-foreground/70">
                Whether you're a blogger, YouTuber, social media influencer, or any kind of digital creator, WContent Lite provides valuable tools to enhance your productivity and reach.
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
      </section>

      {/* Features Section */}
      <section className="space-y-12">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">Features</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <Card className="hover:shadow-lg hover:border-primary/50 transition-all duration-300">
            <CardHeader>
              <Zap className="h-8 w-8 mb-2 text-primary" />
              <CardTitle>AI Content Ideas</CardTitle>
              <CardDescription>Break through creative blocks with AI-generated content suggestions.</CardDescription>
            </CardHeader>
            <CardContent>
              <Image
                src="https://picsum.photos/400/250?random=1"
                alt="AI Content Ideas"
                data-ai-hint="artificial intelligence brain creativity"
                width={400}
                height={250}
                className="rounded-md object-cover"
              />
            </CardContent>
          </Card>
          <Card className="hover:shadow-lg hover:border-primary/50 transition-all duration-300">
            <CardHeader>
              <BarChart className="h-8 w-8 mb-2 text-primary" />
              <CardTitle>Predictive Analytics</CardTitle>
              <CardDescription>Gain insights into potential content performance (feature coming soon!).</CardDescription>
            </CardHeader>
            <CardContent>
              <Image
                src="https://picsum.photos/400/250?random=2"
                alt="Predictive Analytics"
                data-ai-hint="chart graph data analytics"
                width={400}
                height={250}
                className="rounded-md object-cover"
              />
            </CardContent>
          </Card>
          <Card className="hover:shadow-lg hover:border-primary/50 transition-all duration-300">
            <CardHeader>
              <Award className="h-8 w-8 mb-2 text-primary" />
              <CardTitle>Opportunity Hub</CardTitle>
              <CardDescription>Find paid gigs and exciting projects posted by brands and businesses.</CardDescription>
            </CardHeader>
            <CardContent>
              <Image
                 src="https://picsum.photos/400/250?random=3"
                 alt="Opportunity Hub"
                 data-ai-hint="job board opportunity handshake"
                 width={400}
                 height={250}
                 className="rounded-md object-cover"
              />
            </CardContent>
          </Card>
          <Card className="hover:shadow-lg hover:border-primary/50 transition-all duration-300">
            <CardHeader>
              <Users className="h-8 w-8 mb-2 text-primary" />
              <CardTitle>Collaboration Platform</CardTitle>
              <CardDescription>Connect with fellow creators for joint ventures and cross-promotions.</CardDescription>
            </CardHeader>
             <CardContent>
              <Image
                src="https://picsum.photos/400/250?random=4"
                alt="Collaboration Platform"
                data-ai-hint="teamwork collaboration people connect"
                width={400}
                height={250}
                className="rounded-md object-cover"
               />
            </CardContent>
          </Card>
        </div>
        {/* Simple Slider placeholder - implement with a library later if needed */}
        {/* <div className="mt-16 text-center text-foreground/60 italic">
          (Feature Showcase Slider Coming Soon)
        </div> */}
      </section>

       {/* Testimonials Section (Placeholder) */}
       <section className="text-center">
         <h2 className="text-3xl md:text-4xl font-bold mb-8">What Creators Say</h2>
         <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
           <Card className="bg-card/80">
             <CardContent className="pt-6">
               <p className="italic mb-4 text-foreground/90">"WContent's idea generator saved me hours of brainstorming!"</p>
               <p className="font-semibold">- Alex R.</p>
               <p className="text-xs text-foreground/60">Blogger</p>
             </CardContent>
           </Card>
            <Card className="bg-card/80">
             <CardContent className="pt-6">
               <p className="italic mb-4 text-foreground/90">"Finding collaboration opportunities used to be tough. This platform makes it easy."</p>
               <p className="font-semibold">- Maria G.</p>
               <p className="text-xs text-foreground/60">YouTuber</p>
             </CardContent>
           </Card>
           <Card className="bg-card/80">
             <CardContent className="pt-6">
               <p className="italic mb-4 text-foreground/90">"The dashboard helps me keep everything organized. Love the dark theme!"</p>
               <p className="font-semibold">- Sam K.</p>
               <p className="text-xs text-foreground/60">Podcast Host</p>
             </CardContent>
           </Card>
         </div>
       </section>

      {/* Call to Action Section */}
      <section className="text-center bg-gradient-to-r from-teal-900/30 via-background to-teal-900/30 py-16 rounded-lg">
        <h2 className="text-3xl md:text-4xl font-bold mb-4">Ready to Elevate Your Content?</h2>
        <p className="text-lg text-foreground/80 mb-8 max-w-2xl mx-auto">
          Join WContent Lite today and unlock powerful tools to boost your creativity and growth.
        </p>
        <Button asChild size="lg">
          <Link href="/dashboard">
            Explore Your Dashboard <ArrowRight className="ml-2 h-5 w-5" />
          </Link>
        </Button>
      </section>
    </div>
  );
}
