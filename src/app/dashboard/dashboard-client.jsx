'use client';

import React, { useState, useEffect, useMemo } from 'react';
import {
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarFooter,
  SidebarTrigger,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarInset,
  SidebarContext,
  useSidebar,
} from '@/components/ui/sidebar';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Bell, Settings, User, Edit3, PlusCircle, Mail, FileText, LogOut, BarChart, Zap, Users as UsersIcon, ListChecks, Loader2, Inbox, Briefcase } from 'lucide-react'; // Added missing icons
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import { useIsMobile } from '@/hooks/use-mobile';
import { cn } from '@/lib/utils';
import { TooltipProvider } from '@/components/ui/tooltip';
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

// Updated sidebar links to include new pages
const sidebarLinks = [
    { id: '/dashboard', label: 'My Profile', icon: User },
    { id: '/dashboard/update', label: 'Update Profile', icon: Edit3 },
    { id: '/dashboard/opportunities/new', label: 'Post Opportunity', icon: PlusCircle },
    { id: '/dashboard/opportunities/myopportunities', label: 'My Opportunities', icon: Briefcase }, // View posted opportunities
    { id: '/dashboard/opportunities/myapps', label: 'My Applications', icon: FileText }, // View applications sent
    { id: '/dashboard/collabs/new', label: 'Post Collab', icon: PlusCircle },
    { id: '/dashboard/collabs/myrequests', label: 'My Collabs', icon: Inbox }, // View requests received for own collabs
    // Added '/dashboard/collabs/myapplications' - Link to view applications sent for others' collabs (Needs a page)
    // { id: '/dashboard/collabs/myapplications', label: 'Applied Collabs', icon: Mail },
    { id: '/generate', label: 'Generate Ideas', icon: Zap },
    // { id: '/predict', label: 'Predict Performance', icon: BarChart }, // Can be re-added if predict page is fixed/used
    { id: '/opportunities', label: 'Browse Opportunities', icon: Briefcase },
    { id: '/collabs', label: 'Browse Collabs', icon: UsersIcon },
];

export default function DashboardClient({ children }) {
  const router = useRouter();
  const pathname = usePathname();
  const [username, setUsername] = useState('User');
  const [isClient, setIsClient] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const isMobile = useIsMobile();
  const [open, setOpen] = useState(!isMobile); // Default open on desktop, closed on mobile
  const [openMobile, setOpenMobile] = useState(false);

   const checkLoginStatus = () => {
      if (typeof window !== 'undefined') {
        const token = localStorage.getItem('token');
        const user = localStorage.getItem('username');
        setIsLoggedIn(!!token);
        if (user) setUsername(user);
        else setUsername('User'); // Default if no username
      }
    };

  useEffect(() => {
    setIsClient(true);
    checkLoginStatus();

    // Check if user is logged in, redirect if not
     if (!localStorage.getItem("token")) {
         router.push('/auth');
     }

    const handleAuthChange = () => {
        checkLoginStatus();
        // If token is removed during auth change, redirect
        if (!localStorage.getItem("token")) {
            router.push('/auth');
        }
    };
    window.addEventListener('authChange', handleAuthChange);

     return () => {
       window.removeEventListener('authChange', handleAuthChange);
     };

  }, [router]);

  useEffect(() => {
    // Close mobile sidebar on navigation
    if (isMobile && openMobile) {
      setOpenMobile(false);
    }
    // Adjust desktop sidebar state based on window size if needed
    setOpen(!isMobile);

  }, [pathname, isMobile]); // React to pathname and isMobile changes


  const confirmLogout = () => {
    setIsLoggingOut(true);
    setTimeout(() => {
      if (typeof window !== 'undefined') {
         localStorage.removeItem("token");
         localStorage.removeItem("id");
         localStorage.removeItem("username");
         window.dispatchEvent(new CustomEvent('authChange'));
      }
      setShowLogoutConfirm(false);
      setOpenMobile(false);
      setIsLoggingOut(false);
      router.push('/auth');
    }, 500);
  };

  const handleNavigation = (path) => {
    router.push(path);
     if (isMobile) setOpenMobile(false); // Close mobile menu on nav
  };

  const contextValue = useMemo(() => {
    const state = open ? "expanded" : "collapsed";
    const toggleSidebar = () => {
        if (isMobile) setOpenMobile(prev => !prev);
        else setOpen(prev => !prev);
    };

    return {
        state,
        open,
        setOpen,
        isMobile,
        openMobile,
        setOpenMobile,
        toggleSidebar,
    };
  }, [open, setOpen, isMobile, openMobile, setOpenMobile]);


   if (!isClient || !isLoggedIn) { // Keep loading state until client-side check is complete and logged in
      return (
        <div className="flex min-h-screen items-center justify-center">
          {/* You might want a more sophisticated loader here */}
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="ml-2">Loading Dashboard...</p>
        </div>
      );
   }

  return (
    // Wrap with TooltipProvider only once at the root level
    // <TooltipProvider delayDuration={0}>
    <SidebarContext.Provider value={contextValue}>
        <div className="flex h-screen overflow-hidden">
            <Sidebar>
                <SidebarHeader className="border-b border-sidebar-border">
                <div className="flex items-center justify-between p-2">
                    {/* Mobile Trigger (only shows on mobile) */}
                    <SidebarTrigger className="md:hidden"/>
                    {/* Desktop User Info (only shows on desktop) */}
                    <div className="hidden md:flex items-center gap-2 flex-grow min-w-0"> {/* Added flex-grow and min-w-0 */}
                        <Link href="/dashboard" className="flex items-center gap-2 min-w-0"> {/* Link to profile */}
                           <Avatar className="h-8 w-8 flex-shrink-0"> {/* Added flex-shrink-0 */}
                              {/* Use Vercel Avatars (geometric) */}
                              <AvatarImage src={`https://avatar.vercel.sh/${username}.svg?size=40`} alt={username} />
                              <AvatarFallback>{username.substring(0, 1).toUpperCase()}</AvatarFallback>
                           </Avatar>
                           {/* Use context state to conditionally hide username */}
                           <span className={cn("text-sm font-medium truncate", contextValue.state === 'collapsed' && 'sr-only group-data-[collapsible=icon]:hidden')}> {/* Added truncate */}
                             {username}
                           </span>
                        </Link>
                    </div>
                    {/* Actions (Notifications/Settings) - always visible */}
                    <div className="flex items-center gap-1">
                        {/* <Button variant="ghost" size="icon" aria-label="Notifications">
                            <Bell className="size-4" />
                        </Button> */}
                        <Link href="/dashboard/update" passHref legacyBehavior>
                            <Button variant="ghost" size="icon" aria-label="Settings">
                                <Settings className="size-4" />
                            </Button>
                        </Link>
                         {/* Desktop trigger (only shows on desktop) */}
                        <SidebarTrigger className="hidden md:flex"/>
                    </div>
                </div>
                </SidebarHeader>
                <SidebarContent>
                <SidebarMenu>
                    {sidebarLinks.map(link => (
                    <SidebarMenuItem key={link.id}>
                        <SidebarMenuButton
                            onClick={() => handleNavigation(link.id)}
                            isActive={pathname === link.id}
                            tooltip={link.label}
                        >
                           <link.icon />
                           <span>{link.label}</span>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                    ))}
                </SidebarMenu>
                </SidebarContent>
                <SidebarFooter className="border-t border-sidebar-border mt-auto">
                <SidebarMenu>
                    <SidebarMenuItem>
                     <AlertDialog open={showLogoutConfirm} onOpenChange={setShowLogoutConfirm}>
                        <AlertDialogTrigger asChild>
                             <SidebarMenuButton tooltip="Logout" disabled={isLoggingOut}>
                               <>
                                 {isLoggingOut ? <Loader2 className="animate-spin" /> : <LogOut />}
                                 <span>Logout</span>
                               </>
                             </SidebarMenuButton>
                        </AlertDialogTrigger>
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
                    </SidebarMenuItem>
                </SidebarMenu>
                </SidebarFooter>
            </Sidebar>

             <SidebarInset>
                {/* Header for main content area (mobile only) */}
                 <header className="flex items-center justify-between p-4 border-b md:hidden sticky top-0 bg-background z-10">
                     <h2 className="text-xl font-semibold capitalize truncate">
                         {sidebarLinks.find(link => link.id === pathname)?.label || 'Dashboard'}
                     </h2>
                     {/* Mobile Trigger is outside SidebarInset on mobile */}
                 </header>
                 {/* Adjusted padding and removed h-full to let content determine height */}
                 <div className="p-4 md:p-6 overflow-y-auto">
                   {children}
                 </div>
            </SidebarInset>
         </div>
    </SidebarContext.Provider>
    // </TooltipProvider>
  );
}
