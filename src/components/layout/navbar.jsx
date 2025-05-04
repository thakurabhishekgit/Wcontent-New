'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation'; // Import useRouter
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Menu, LogOut } from 'lucide-react'; // Added LogOut
import { useState, useEffect } from 'react'; // Import useEffect
import WcontentLogo from '@/components/icons/wcontent-logo'; // Import the new logo
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"; // Import AlertDialog components

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
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false); // State for logout confirmation

  // Function to check login status
  const checkLoginStatus = () => {
     if (typeof window !== 'undefined') {
       const token = localStorage.getItem('token');
       setIsLoggedIn(!!token);
     }
   };


  useEffect(() => {
    setIsClient(true); // Indicate component has mounted
    checkLoginStatus(); // Initial check

    // Listen for custom 'authChange' event
    const handleAuthChange = () => {
       console.log("Auth change detected, updating navbar state..."); // Debug log
      checkLoginStatus();
    };

    window.addEventListener('authChange', handleAuthChange);

    // Cleanup listener on component unmount
    return () => {
      window.removeEventListener('authChange', handleAuthChange);
    };

  }, []); // Run only once on mount


  // Function to perform the actual logout action
  const confirmLogout = () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('token');
      localStorage.removeItem('id');
      localStorage.removeItem('username');
      // Dispatch custom event to notify navbar (and potentially other components)
      window.dispatchEvent(new CustomEvent('authChange'));
    }
    setShowLogoutConfirm(false); // Close dialog
    setIsMobileMenuOpen(false); // Close mobile menu if open
    router.push('/auth'); // Redirect to login page
  };


  // Don't render navbar content on the server to prevent hydration mismatch for login status
  if (!isClient) {
    // You can return a placeholder or null during server render / initial hydration
    return (
      <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-14 items-center">
          {/* Basic structure without dynamic elements */}
          <Link href="/" className="mr-6 flex items-center space-x-2">
            <WcontentLogo className="h-6 w-6" /> {/* Use new logo */}
            <span className="font-bold sm:inline-block">Wcontent</span> {/* Use new name */}
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
    <>
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center">
        <Link href="/" className="mr-6 flex items-center space-x-2">
          <WcontentLogo className="h-6 w-6" /> {/* Use new logo */}
          <span className="font-bold sm:inline-block">Wcontent</span> {/* Use new name */}
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
        </nav>
         {/* Desktop Login/Logout Button - Moved to the end */}
        <div className="hidden md:flex items-center ml-auto">
           {isLoggedIn ? (
             <AlertDialogTrigger asChild>
                <Button
                  variant="ghost"
                  className="text-sm font-medium transition-colors hover:text-primary text-foreground/60"
                  // onClick={handleLogoutClick} // Now handled by AlertDialogTrigger
                >
                  <LogOut className="mr-2 h-4 w-4" /> Logout
                </Button>
              </AlertDialogTrigger>
           ) : (
             <Button asChild variant="outline" size="sm">
                 <Link href="/auth">
                    Login / Sign Up
                 </Link>
             </Button>
           )}
         </div>
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
                 <WcontentLogo className="h-6 w-6" /> {/* Use new logo */}
                 <span className="font-bold">Wcontent</span> {/* Use new name */}
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
                   <AlertDialogTrigger asChild>
                      <Button
                        variant="ghost"
                        className="justify-start px-0 text-sm font-medium transition-colors hover:text-primary text-foreground/80"
                        // onClick={handleLogoutClick} // Handled by trigger
                      >
                        <LogOut className="mr-2 h-4 w-4" /> Logout
                      </Button>
                   </AlertDialogTrigger>
                ) : (
                  <Link
                    href="/auth"
                    className="text-sm font-medium transition-colors hover:text-primary text-foreground/80"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Login / Sign Up
                  </Link>
                )}
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>

     {/* Logout Confirmation Dialog - Place outside header but within component */}
     <AlertDialog open={showLogoutConfirm} onOpenChange={setShowLogoutConfirm}>
       <AlertDialogContent>
         <AlertDialogHeader>
           <AlertDialogTitle>Are you sure you want to logout?</AlertDialogTitle>
           <AlertDialogDescription>
             You will be returned to the login page.
           </AlertDialogDescription>
         </AlertDialogHeader>
         <AlertDialogFooter>
           <AlertDialogCancel>Cancel</AlertDialogCancel>
           <AlertDialogAction onClick={confirmLogout}>Logout</AlertDialogAction>
         </AlertDialogFooter>
       </AlertDialogContent>
     </AlertDialog>
    </>
  );
}
