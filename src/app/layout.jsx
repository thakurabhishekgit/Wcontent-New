
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';
import { cn } from '@/lib/utils';
import Navbar from '@/components/layout/navbar';
import Footer from '@/components/layout/footer';
import { Toaster } from '@/components/ui/toaster';
import { Providers } from './providers'; // Import Providers
// Removed SidebarProvider import

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata = {
  title: 'WContent Lite',
  description: 'AI-Powered Content Creation Platform',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="dark">
      <body
        className={cn(
          geistSans.variable,
          geistMono.variable,
          'antialiased flex flex-col min-h-screen' // Ensures body takes full height and uses flex column layout
        )}
      >
        <Providers> {/* Wrap content with Providers */}
          <Navbar />
          {/* Changed main to flex flex-col to contain its children properly */}
          <main className="flex flex-col flex-1 container mx-auto px-4 py-8">
             {/* Removed flex-grow from main, applied flex-1 */}
             <div className="flex-1"> {/* This div will grow to fill the space */}
               {children}
             </div>
          </main>
          <Footer />
          <Toaster />
        </Providers>
      </body>
    </html>
  );
}
