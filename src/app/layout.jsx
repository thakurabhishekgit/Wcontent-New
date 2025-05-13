import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';
import { cn } from '@/lib/utils';
import Navbar from '@/components/layout/navbar';
import Footer from '@/components/layout/footer';
import { Toaster } from '@/components/ui/toaster';
import { Providers } from './providers';
import { TooltipProvider } from '@/components/ui/tooltip';


const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata = {
  title: 'Wcontent',
  description: 'ultimate platform for creators',
  icons: {
    icon: '/favicon.svg',
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="dark">
      <head>
        <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
      </head>
      <body
        className={cn(
          geistSans.variable,
          geistMono.variable,
          'antialiased flex flex-col min-h-screen'
        )}
      >
        <Providers>
          <TooltipProvider delayDuration={0}>
            <Navbar />
            <main className="flex flex-col flex-1">
               {/* Adjusted padding: pt-4 for top padding below navbar, pb-8 for bottom padding before footer */}
               <div className="flex-1 p-4 md:px-6 md:pt-6 md:pb-12">
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
