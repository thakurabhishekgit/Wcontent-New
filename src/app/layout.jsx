
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
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="dark">{/* Ensure html has lang and dark class */}
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
            {/* Removed 'container mx-auto' to allow full-width layouts like the dashboard */}
            <main className="flex flex-col flex-1"> {/* Remove padding here */}
              <div className="flex-1 px-4 py-8"> {/* Add padding to this inner div */}
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
