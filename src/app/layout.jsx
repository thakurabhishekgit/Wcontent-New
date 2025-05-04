import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';
import { cn } from '@/lib/utils';
import Navbar from '@/components/layout/navbar';
import Footer from '@/components/layout/footer';
import { Toaster } from '@/components/ui/toaster';
import { Providers } from './providers'; // Import Providers
import { TooltipProvider } from '@/components/ui/tooltip'; // Import TooltipProvider


const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata = {
  title: 'Wcontent', // Updated title
  description: 'ultimate platform for creators', // Updated description
  // Add icon links for favicon
  icons: {
    icon: '/favicon.svg', // Link to the SVG favicon in the public directory
    // You can add other sizes/formats if needed
    // apple: '/apple-touch-icon.png',
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="dark"> {/* Ensure html has lang and dark class */}
      <head>
        {/* Manually link the SVG favicon for broader compatibility */}
        <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
      </head>
      <body
        className={cn(
          geistSans.variable,
          geistMono.variable,
          'antialiased flex flex-col min-h-screen' // Ensures body takes full height and uses flex column layout
        )}
      >
        <Providers> {/* Wrap content with Providers */}
          <TooltipProvider delayDuration={0}> {/* Wrap with TooltipProvider */}
            <Navbar />
            {/* flex-1 allows main content to grow and push footer down */}
            {/* overflow-y-auto allows content scrolling if it exceeds viewport */}
            <main className="flex flex-col flex-1">
               {/* Padding applied to the direct child of main */}
               <div className="flex-1 p-4 md:p-6"> {/* Adjust padding as needed */}
                 {children}
               </div>
            </main>
            <Footer />
            <Toaster />
          </TooltipProvider>
        </Providers>
      </body>
    </html>
  );
}
