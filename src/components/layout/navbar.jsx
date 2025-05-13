'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription, SheetTrigger } from '@/components/ui/sheet';
import { Menu, LogOut, Loader2, User, Settings, LayoutDashboard, ChevronDown, PlusCircle, Briefcase, Inbox, Users as UsersIcon } from 'lucide-react'; // Added PlusCircle, Briefcase, Inbox, UsersIcon
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
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuGroup,
} from "@/components/ui/dropdown-menu";


const navLinks = [
  { href: '/', label: 'Home' },
  { href: '/generate', label: 'Generate' },
  { href: '/predict', label: 'Predict' },
  { href: '/opportunities', label: 'Opportunities' },
  { href: '/collabs', label: 'Collabs' },
];

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState('');
  const [isClient, setIsClient] = useState(false);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const checkLoginStatus = () => {
     if (typeof window !== 'undefined') {
       const token = localStorage.getItem('token');
       const user = localStorage.getItem('username');
       setIsLoggedIn(!!token);
       setUsername(user || '');
     }
   };


  useEffect(() => {
    setIsClient(true);
    checkLoginStatus();

    const handleAuthChange = () => {
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
        <div className="container flex h-16 items-center">
          <Link href="/" className="mr-6 flex items-center space-x-2">
            <WcontentLogo className="h-7 w-7" />
            <span className="font-semibold text-lg sm:inline-block">Wcontent</span>
          </Link>
           <div className="flex flex-1 items-center justify-end space-x-4 md:hidden">
             <Button variant="ghost" size="icon" disabled>
                <Menu className="h-5 w-5" />
             </Button>
           </div>
           <nav className="hidden flex-1 items-center justify-end md:flex">
              <Button variant="outline" disabled>Loading...</Button>
           </nav>
        </div>
      </header>
    );
  }


  return (
    <AlertDialog open={showLogoutConfirm} onOpenChange={setShowLogoutConfirm}>
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center">
        <Link href="/" className="mr-6 flex items-center space-x-2">
          <WcontentLogo className="h-7 w-7" />
          <span className="font-semibold text-lg sm:inline-block">Wcontent</span>
        </Link>
        
        {/* Desktop Navigation */}
        <nav className="hidden md:flex flex-1 items-center justify-center space-x-6">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                'text-sm font-medium transition-colors hover:text-primary',
                pathname === link.href ? 'text-primary' : 'text-foreground/70'
              )}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Desktop Auth/User Section */}
        <div className="hidden md:flex items-center ml-auto space-x-2"> {/* Adjusted space-x */}
           {isLoggedIn ? (
             <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="flex items-center gap-2 px-2 hover:bg-accent">
                        <Avatar className="h-8 w-8">
                        <AvatarImage src={`https://avatar.vercel.sh/${username || 'user'}.svg?size=40`} alt={username} />
                        <AvatarFallback>{username ? username.substring(0, 1).toUpperCase() : 'U'}</AvatarFallback>
                        </Avatar>
                        <span className="text-sm font-medium text-foreground/80 hidden lg:inline">{username}</span>
                        <ChevronDown className="h-4 w-4 text-foreground/60"/>
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-60"> {/* Increased width for more items */}
                    <DropdownMenuLabel>My Account</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuGroup>
                        <DropdownMenuItem asChild>
                            <Link href="/dashboard" className="flex items-center">
                                <LayoutDashboard className="mr-2 h-4 w-4" />
                                <span>Dashboard</span>
                            </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild>
                            <Link href="/dashboard/update" className="flex items-center">
                                <User className="mr-2 h-4 w-4" />
                                <span>Profile Settings</span>
                            </Link>
                        </DropdownMenuItem>
                    </DropdownMenuGroup>
                    <DropdownMenuSeparator />
                    <DropdownMenuGroup>
                        <DropdownMenuLabel>Opportunities</DropdownMenuLabel>
                        <DropdownMenuItem asChild>
                            <Link href="/dashboard/opportunities/new" className="flex items-center">
                                <PlusCircle className="mr-2 h-4 w-4" />
                                <span>Post Opportunity</span>
                            </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild>
                            <Link href="/dashboard/opportunities/myopportunities" className="flex items-center">
                                <Briefcase className="mr-2 h-4 w-4" />
                                <span>My Opportunities</span>
                            </Link>
                        </DropdownMenuItem>
                    </DropdownMenuGroup>
                    <DropdownMenuSeparator />
                     <DropdownMenuGroup>
                        <DropdownMenuLabel>Collaborations</DropdownMenuLabel>
                        <DropdownMenuItem asChild>
                            <Link href="/dashboard/collabs/new" className="flex items-center">
                                <PlusCircle className="mr-2 h-4 w-4" />
                                <span>Post Collaboration</span>
                            </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild>
                            <Link href="/dashboard/collabs/myrequests" className="flex items-center">
                                <UsersIcon className="mr-2 h-4 w-4" />
                                <span>My Collaborations</span>
                            </Link>
                        </DropdownMenuItem>
                    </DropdownMenuGroup>
                    <DropdownMenuSeparator />
                    <AlertDialogTrigger asChild>
                        <DropdownMenuItem className="text-destructive focus:bg-destructive/10 focus:text-destructive flex items-center cursor-pointer" disabled={isLoggingOut}>
                             {isLoggingOut ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <LogOut className="mr-2 h-4 w-4" />}
                            <span>Logout</span>
                        </DropdownMenuItem>
                    </AlertDialogTrigger>
                </DropdownMenuContent>
             </DropdownMenu>
           ) : (
            <>
             <Button variant="ghost" asChild size="sm">
               <Link href="/auth">Login</Link>
             </Button>
             <Button asChild size="sm">
               <Link href="/auth">Sign Up</Link>
             </Button>
            </>
           )}
         </div>

        {/* Mobile Menu Trigger */}
        <div className="flex flex-1 items-center justify-end space-x-4 md:hidden">
           <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon">
                <Menu className="h-5 w-5" />
                <span className="sr-only">Toggle Menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="pr-0 w-[280px] flex flex-col">
               <SheetHeader className="p-4 border-b">
                 <Link href="/" className="flex items-center space-x-2" onClick={() => setIsMobileMenuOpen(false)}>
                     <WcontentLogo className="h-6 w-6" />
                     <SheetTitle className="font-semibold text-md">Wcontent</SheetTitle>
                  </Link>
                 <SheetDescription className="sr-only">Mobile navigation menu</SheetDescription> {/* Added for accessibility */}
               </SheetHeader>

              <div className="flex-grow flex flex-col justify-between">
                <div className="flex flex-col space-y-2 p-4">
                    {navLinks.map((link) => (
                    <Link
                        key={link.href}
                        href={link.href}
                        onClick={() => setIsMobileMenuOpen(false)}
                        className={cn(
                        'block rounded-md px-3 py-2 text-base font-medium transition-colors hover:bg-accent hover:text-accent-foreground',
                        pathname === link.href ? 'bg-accent text-accent-foreground' : 'text-foreground/80'
                        )}
                    >
                        {link.label}
                    </Link>
                    ))}
                    <div className="pt-4 mt-4 border-t">
                    {isLoggedIn ? (
                        <>
                            <Link
                            href="/dashboard"
                            onClick={() => setIsMobileMenuOpen(false)}
                            className="flex items-center gap-2 rounded-md px-3 py-2 text-base font-medium transition-colors hover:bg-accent hover:text-accent-foreground text-foreground/80"
                            >
                            <LayoutDashboard className="h-5 w-5" /> Dashboard
                        </Link>
                            <Link
                            href="/dashboard/update"
                            onClick={() => setIsMobileMenuOpen(false)}
                            className="flex items-center gap-2 rounded-md px-3 py-2 text-base font-medium transition-colors hover:bg-accent hover:text-accent-foreground text-foreground/80"
                            >
                            <User className="h-5 w-5" /> {username || 'Profile'}
                        </Link>
                        {/* Mobile specific dashboard links */}
                        <Link href="/dashboard/opportunities/new" onClick={() => setIsMobileMenuOpen(false)} className="flex items-center gap-2 rounded-md px-3 py-2 text-base font-medium transition-colors hover:bg-accent hover:text-accent-foreground text-foreground/80"><PlusCircle className="mr-2 h-4 w-4" />Post Opportunity</Link>
                        <Link href="/dashboard/opportunities/myopportunities" onClick={() => setIsMobileMenuOpen(false)} className="flex items-center gap-2 rounded-md px-3 py-2 text-base font-medium transition-colors hover:bg-accent hover:text-accent-foreground text-foreground/80"><Briefcase className="mr-2 h-4 w-4" />My Opportunities</Link>
                        <Link href="/dashboard/collabs/new" onClick={() => setIsMobileMenuOpen(false)} className="flex items-center gap-2 rounded-md px-3 py-2 text-base font-medium transition-colors hover:bg-accent hover:text-accent-foreground text-foreground/80"><PlusCircle className="mr-2 h-4 w-4" />Post Collab</Link>
                        <Link href="/dashboard/collabs/myrequests" onClick={() => setIsMobileMenuOpen(false)} className="flex items-center gap-2 rounded-md px-3 py-2 text-base font-medium transition-colors hover:bg-accent hover:text-accent-foreground text-foreground/80"><UsersIcon className="mr-2 h-4 w-4" />My Collabs</Link>
                        
                        <AlertDialogTrigger asChild>
                            <Button
                            variant="ghost"
                            className="w-full justify-start px-3 py-2 text-base font-medium transition-colors hover:bg-destructive/10 text-destructive mt-2"
                            disabled={isLoggingOut}
                            >
                                {isLoggingOut ? <Loader2 className="mr-2 h-5 w-5 animate-spin" /> : <LogOut className="mr-2 h-5 w-5" />}
                                Logout
                            </Button>
                        </AlertDialogTrigger>
                        </>
                    ) : (
                    <Link
                        href="/auth"
                        className="block rounded-md px-3 py-2 text-base font-medium transition-colors bg-primary text-primary-foreground hover:bg-primary/90 text-center"
                        onClick={() => setIsMobileMenuOpen(false)}
                    >
                        Login / Sign Up
                    </Link>
                    )}
                    </div>
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you sure you want to logout?</AlertDialogTitle>
          <AlertDialogDescription>
            You will be returned to the login page.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isLoggingOut}>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={confirmLogout} disabled={isLoggingOut} className="bg-destructive hover:bg-destructive/90">
              {isLoggingOut && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Logout
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
