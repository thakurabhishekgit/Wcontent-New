'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation'; // Import useRouter
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Menu, Feather } from 'lucide-react';
import { useState, useEffect } from 'react'; // Import useEffect

const navLinks = [
  { href: '/', label: 'Home' },
  { href: '/generate', label: 'Generate' },
  { href: '/predict', label: 'Predict' },
  { href: '/opportunities', label: 'Opportunities' },
  { href: '/collabs', label: 'Collabs' },
  { href: '/dashboard', label: 'Dashboard' },
];

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter(); // Initialize useRouter
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isClient, setIsClient] = useState(false); // Track client-side mount

  useEffect(() => {
    setIsClient(true); // Indicate component has mounted
    // Check login status only on the client-side after mount
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('token');
      setIsLoggedIn(!!token); // Set logged in status based on token presence
    }
  }, []); // Run only once on mount

  // Handle logout
  const handleLogout = () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('token');
      localStorage.removeItem('id');
      localStorage.removeItem('username');
    }
    setIsLoggedIn(false); // Update state
    setIsMobileMenuOpen(false); // Close mobile menu if open
    router.push('/auth'); // Redirect to login page
    // Optionally, force refresh or use state management to update globally
    // window.location.reload(); // Avoid full page reload if possible
  };


  // Don't render navbar content on the server to prevent hydration mismatch for login status
  if (!isClient) {
    // You can return a placeholder or null during server render / initial hydration
    return (
      <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-14 items-center">
          {/* Basic structure without dynamic elements */}
          <Link href="/" className="mr-6 flex items-center space-x-2">
            <Feather className="h-6 w-6 text-primary" />
            <span className="font-bold sm:inline-block">WContent Lite</span>
          </Link>
          {/* Placeholder for nav items or just the mobile trigger */}
           <div className="flex flex-1 items-center justify-end space-x-4 md:hidden">
             {/* Mobile trigger placeholder */}
             <Button variant="ghost" size="icon" disabled>
                <Menu className="h-5 w-5" />
             </Button>
           </div>
           <nav className="hidden flex-1 items-center space-x-4 md:flex justify-end">
             {/* Placeholder Login Button */}
              <Button variant="outline" disabled>Loading...</Button>
           </nav>
        </div>
      </header>
    );
  }


  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center">
        <Link href="/" className="mr-6 flex items-center space-x-2">
          <Feather className="h-6 w-6 text-primary" />
          <span className="font-bold sm:inline-block">WContent Lite</span>
        </Link>
        <nav className="hidden flex-1 items-center space-x-4 md:flex">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                'text-sm font-medium transition-colors hover:text-primary',
                pathname === link.href ? 'text-primary' : 'text-foreground/60'
              )}
            >
              {link.label}
            </Link>
          ))}
          {/* Conditionally render Login or Logout */}
          {isLoggedIn ? (
            <Button
              variant="ghost"
              className="text-sm font-medium transition-colors hover:text-primary"
              onClick={handleLogout}
            >
              Logout
            </Button>
          ) : (
            <Link href="/auth" className="text-sm font-medium transition-colors hover:text-primary text-foreground/60">
              Login
            </Link>
          )}
        </nav>
        <div className="flex flex-1 items-center justify-end space-x-4 md:hidden">
           <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon">
                <Menu className="h-5 w-5" />
                <span className="sr-only">Toggle Menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="pr-0">
              <Link href="/" className="mr-6 flex items-center space-x-2 p-4 border-b" onClick={() => setIsMobileMenuOpen(false)}>
                 <Feather className="h-6 w-6 text-primary" />
                 <span className="font-bold">WContent Lite</span>
              </Link>
              <div className="flex flex-col space-y-3 p-4">
                {navLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={cn(
                      'text-sm font-medium transition-colors hover:text-primary',
                      pathname === link.href ? 'text-primary' : 'text-foreground/80'
                    )}
                  >
                    {link.label}
                  </Link>
                ))}
                {/* Conditional Login/Logout in Mobile Menu */}
                {isLoggedIn ? (
                  <Button
                    variant="ghost"
                    className="justify-start px-0 text-sm font-medium transition-colors hover:text-primary text-foreground/80"
                    onClick={handleLogout}
                  >
                    Logout
                  </Button>
                ) : (
                  <Link
                    href="/auth"
                    className="text-sm font-medium transition-colors hover:text-primary text-foreground/80"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Login
                  </Link>
                )}
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
