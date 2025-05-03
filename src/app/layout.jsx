
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
          'antialiased flex flex-col min-h-screen'
        )}
      >
        <Providers> {/* Wrap content with Providers */}
          {/* Removed SidebarProvider wrapping */}
          <Navbar />
          {/* The main content area can occupy the space between navbar and footer */}
          {/* The dashboard layout will handle its specific structure */}
          <main className="flex-grow container mx-auto px-4 py-8">
             {children}
          </main>
          <Footer />
          <Toaster />
        </Providers>
      </body>
    </html>
  );
}
