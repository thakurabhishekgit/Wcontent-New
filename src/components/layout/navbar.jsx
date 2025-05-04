'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Menu, LogOut, Loader2 } from 'lucide-react';
import { useState, useEffect } from 'react';
import WcontentLogo from '@/components/icons/wcontent-logo';
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
} from "@/components/ui/alert-dialog";
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'; // Import Avatar components

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
  const router = useRouter();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState(''); // Add state for username
  const [isClient, setIsClient] = useState(false);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const checkLoginStatus = () => {
     if (typeof window !== 'undefined') {
       const token = localStorage.getItem('token');
       const user = localStorage.getItem('username'); // Get username
       setIsLoggedIn(!!token);
       setUsername(user || ''); // Set username state
     }
   };


  useEffect(() => {
    setIsClient(true);
    checkLoginStatus();

    const handleAuthChange = () => {
       console.log("Auth change detected, updating navbar state...");
      checkLoginStatus();
    };

    window.addEventListener('authChange', handleAuthChange);

    return () => {
      window.removeEventListener('authChange', handleAuthChange);
    };

  }, []);


  const confirmLogout = () => {
    setIsLoggingOut(true);
    setTimeout(() => {
        if (typeof window !== 'undefined') {
        localStorage.removeItem('token');
        localStorage.removeItem('id');
        localStorage.removeItem('username');
        window.dispatchEvent(new CustomEvent('authChange'));
        }
        setShowLogoutConfirm(false);
        setIsMobileMenuOpen(false);
        setIsLoggingOut(false);
        router.push('/auth');
    }, 500);
  };


  if (!isClient) {
    return (
      <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-14 items-center">
          <Link href="/" className="mr-6 flex items-center space-x-2">
            <WcontentLogo className="h-6 w-6" />
            <span className="font-bold sm:inline-block">Wcontent</span>
          </Link>
           <div className="flex flex-1 items-center justify-end space-x-4 md:hidden">
             <Button variant="ghost" size="icon" disabled>
                <Menu className="h-5 w-5" />
             </Button>
           </div>
           <nav className="hidden flex-1 items-center space-x-4 md:flex justify-end">
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
          <WcontentLogo className="h-6 w-6" />
          <span className="font-bold sm:inline-block">Wcontent</span>
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

        <div className="hidden md:flex items-center ml-auto space-x-4"> {/* Added space-x-4 */}
           {/* Wrap the trigger and content in AlertDialog */}
           <AlertDialog open={showLogoutConfirm} onOpenChange={setShowLogoutConfirm}>
             {isLoggedIn ? (
               <>
                 {/* Avatar */}
                 <Link href="/dashboard" className="flex items-center gap-2"> {/* Link avatar to dashboard */}
                   <Avatar className="h-8 w-8">
                     {/* Use Vercel Avatars (geometric) */}
                     <AvatarImage src={`https://avatar.vercel.sh/${username}.svg?size=40`} alt={username} />
                     <AvatarFallback>{username.substring(0, 1).toUpperCase()}</AvatarFallback>
                   </Avatar>
                   <span className="text-sm font-medium text-foreground/80 hidden lg:inline">{username}</span> {/* Optionally show username */}
                 </Link>

                 {/* Logout Button */}
                 <AlertDialogTrigger asChild>
                   <Button
                     variant="ghost"
                     className="text-sm font-medium transition-colors hover:text-primary text-foreground/60"
                     disabled={isLoggingOut}
                   >
                     {isLoggingOut ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <LogOut className="mr-2 h-4 w-4" />}
                      Logout
                   </Button>
                 </AlertDialogTrigger>
               </>
             ) : (
               <Button asChild variant="outline" size="sm">
                 <Link href="/auth">Login / Sign Up</Link>
               </Button>
             )}
              {/* Dialog Content is part of the AlertDialog */}
             <AlertDialogContent>
               <AlertDialogHeader>
                 <AlertDialogTitle>Are you sure you want to logout?</AlertDialogTitle>
                 <AlertDialogDescription>
                   You will be returned to the login page.
                 </AlertDialogDescription>
               </AlertDialogHeader>
               <AlertDialogFooter>
                 <AlertDialogCancel disabled={isLoggingOut}>Cancel</AlertDialogCancel>
                 <AlertDialogAction onClick={confirmLogout} disabled={isLoggingOut}>
                     {isLoggingOut && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                     Logout
                 </AlertDialogAction>
               </AlertDialogFooter>
             </AlertDialogContent>
           </AlertDialog>
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
                 <WcontentLogo className="h-6 w-6" />
                 <span className="font-bold">Wcontent</span>
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
                <AlertDialog open={showLogoutConfirm} onOpenChange={setShowLogoutConfirm}>
                    {isLoggedIn ? (
                        <AlertDialogTrigger asChild>
                            <Button
                            variant="ghost"
                            className="justify-start px-0 text-sm font-medium transition-colors hover:text-primary text-foreground/80"
                            disabled={isLoggingOut}
                            >
                             {isLoggingOut ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <LogOut className="mr-2 h-4 w-4" />}
                                Logout
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
                     <AlertDialogContent>
                        <AlertDialogHeader>
                            <AlertDialogTitle>Are you sure you want to logout?</AlertDialogTitle>
                            <AlertDialogDescription>
                            You will be returned to the login page.
                            </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                            <AlertDialogCancel disabled={isLoggingOut}>Cancel</AlertDialogCancel>
                            <AlertDialogAction onClick={confirmLogout} disabled={isLoggingOut}>
                                {isLoggingOut && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                Logout
                            </AlertDialogAction>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialog>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
    </>
  );
}
