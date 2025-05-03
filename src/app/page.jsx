
import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { ArrowRight, Zap, BarChart, Users, Award, Star } from 'lucide-react';

// Placeholder for a future Carousel component
const FeatureShowcaseSlider = () => (
  <div className="bg-muted/50 rounded-lg p-8 text-center border border-dashed border-border">
    <h3 className="text-xl font-semibold mb-4">Dynamic Feature Showcase</h3>
    <p className="text-muted-foreground mb-4">
      (Placeholder: A carousel/slider component could go here to dynamically showcase features, testimonials, or success stories. Consider using libraries like Embla Carousel with Shadcn UI integration.)
    </p>
    <div className="flex justify-center space-x-4">
      <div className="w-24 h-16 bg-border rounded animate-pulse"></div>
      <div className="w-24 h-16 bg-border rounded animate-pulse delay-150"></div>
      <div className="w-24 h-16 bg-border rounded animate-pulse delay-300"></div>
    </div>
  </div>
);

export default function Home() {
  return (
    // Add container mx-auto here to constrain content width on this page
    <div className="container mx-auto space-y-16 md:space-y-24">
      {/* Hero Section */}
      <section className="text-center pt-16 pb-12 md:pt-24 md:pb-16">
        <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-4 bg-gradient-to-r from-primary via-teal-400 to-teal-600 bg-clip-text text-transparent">
          Empower Your Content Creation
        </h1>
        <p className="text-lg md:text-xl text-foreground/80 max-w-3xl mx-auto mb-8">
          WContent Lite provides AI-powered tools to streamline your workflow, generate fresh ideas, and connect with collaborators.
        </p>
        <div className="flex justify-center gap-4 mb-12">
          <Button asChild size="lg">
            <Link href="/generate">
              Get Started <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </Button>
          <Button asChild variant="outline" size="lg">
            <Link href="/dashboard">Go to Dashboard</Link>
          </Button>
        </div>
        {/* Moved Accordion inside Hero but after buttons */}
        <div className="mt-12 max-w-2xl mx-auto">
         <Accordion type="single" collapsible className="w-full text-left border-t border-b">
            <AccordionItem value="item-1">
              <AccordionTrigger className="text-lg font-semibold hover:no-underline">What is WContent Lite?</AccordionTrigger>
              <AccordionContent className="text-foreground/70">
                WContent Lite is a platform designed for content creators, offering tools like AI-powered idea generation, content prediction insights (coming soon!), and opportunities to collaborate with others. We aim to simplify your creative process and help you grow.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-2" className="border-b-0">
              <AccordionTrigger className="text-lg font-semibold hover:no-underline">Who is it for?</AccordionTrigger>
              <AccordionContent className="text-foreground/70">
                Whether you're a blogger, YouTuber, social media influencer, or any kind of digital creator, WContent Lite provides valuable tools to enhance your productivity and reach.
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
      </section>

      {/* Features Section */}
      <section className="space-y-12">
        <div className="text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-3">Core Features</h2>
          <p className="text-muted-foreground max-w-xl mx-auto">Tools designed to boost your content creation journey.</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Feature Cards */}
          {[
            { icon: Zap, title: 'AI Content Ideas', description: 'Break through creative blocks with AI-generated content suggestions.', img: 'https://picsum.photos/400/250?random=1', hint: 'artificial intelligence brain creativity' },
            { icon: BarChart, title: 'Predictive Analytics', description: 'Gain insights into potential content performance (feature coming soon!).', img: 'https://picsum.photos/400/250?random=2', hint: 'chart graph data analytics' },
            { icon: Award, title: 'Opportunity Hub', description: 'Find paid gigs and exciting projects posted by brands and businesses.', img: 'https://picsum.photos/400/250?random=3', hint: 'job board opportunity handshake' },
            { icon: Users, title: 'Collaboration Platform', description: 'Connect with fellow creators for joint ventures and cross-promotions.', img: 'https://picsum.photos/400/250?random=4', hint: 'teamwork collaboration people connect' },
          ].map((feature, index) => (
            <Card key={index} className="flex flex-col overflow-hidden hover:shadow-xl hover:border-primary/50 transition-all duration-300 ease-in-out transform hover:-translate-y-1">
              <CardHeader>
                <feature.icon className="h-8 w-8 mb-2 text-primary" />
                <CardTitle>{feature.title}</CardTitle>
                <CardDescription>{feature.description}</CardDescription>
              </CardHeader>
              <CardContent className="flex-grow flex items-end"> {/* Use flex-grow and items-end */}
                <Image
                  src={feature.img}
                  alt={feature.title}
                  data-ai-hint={feature.hint}
                  width={400}
                  height={250}
                  className="rounded-md object-cover w-full h-auto mt-4" // Ensure image scales well
                />
              </CardContent>
            </Card>
          ))}
        </div>
        {/* Feature Showcase Slider Placeholder */}
        <div className="mt-16">
          <FeatureShowcaseSlider />
        </div>
      </section>

       {/* Testimonials Section */}
       <section className="text-center">
         <h2 className="text-3xl md:text-4xl font-bold mb-3">What Creators Say</h2>
         <p className="text-muted-foreground max-w-xl mx-auto mb-12">Hear directly from creators using WContent Lite.</p>
         <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
           {[
             { quote: "WContent's idea generator saved me hours of brainstorming!", name: "Alex R.", role: "Blogger" },
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
          Join WContent Lite today and unlock powerful tools to boost your creativity and growth.
        </p>
        <Button asChild size="lg" className="bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg transform hover:scale-105 transition-transform">
          <Link href="/dashboard">
            Explore Your Dashboard <ArrowRight className="ml-2 h-5 w-5" />
          </Link>
        </Button>
      </section>
    </div>
  );
}
