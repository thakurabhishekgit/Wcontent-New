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
import { Bell, Settings, User, Edit3, PlusCircle, Mail, FileText, LogOut, BarChart, Zap, Users as UsersIcon, ListChecks, Loader2 } from 'lucide-react'; // Added Loader2
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
} from "@/components/ui/alert-dialog"; // Import AlertDialog components

// Define the structure for sidebar links
const sidebarLinks = [
    { id: '/dashboard', label: 'My Profile', icon: User },
    { id: '/dashboard/update', label: 'Update Profile', icon: Edit3 },
    { id: '/dashboard/opportunities/new', label: 'Post Opportunity', icon: PlusCircle },
    { id: '/dashboard/collabs/new', label: 'Post Collab', icon: PlusCircle },
    { id: '/dashboard/opportunities/myopportunities', label: 'My Opportunities', icon: ListChecks },
    { id: '/dashboard/collabs/myrequests', label: 'My Collabs', icon: ListChecks },
    // Adding links to main app sections for convenience
    { id: '/generate', label: 'Generate Ideas', icon: Zap },
    { id: '/predict', label: 'Predict Performance', icon: BarChart },
    { id: '/opportunities', label: 'Browse Opportunities', icon: FileText },
    { id: '/collabs', label: 'Browse Collabs', icon: UsersIcon },
];

export default function DashboardClient({ children }) {
  const router = useRouter();
  const pathname = usePathname();
  const [username, setUsername] = useState('User');
  const [isClient, setIsClient] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false); // State for logout confirmation dialog
  const [isLoggingOut, setIsLoggingOut] = useState(false); // Loading state for logout

  // Sidebar state management lifted here
  const isMobile = useIsMobile();
  const [open, setOpen] = useState(true); // Desktop sidebar state
  const [openMobile, setOpenMobile] = useState(false); // Mobile sidebar state

   // Function to check login status
   const checkLoginStatus = () => {
      if (typeof window !== 'undefined') {
        const token = localStorage.getItem('token');
        const user = localStorage.getItem('username');
        setIsLoggedIn(!!token);
        if (user) setUsername(user);
      }
    };

  // Get active path and username on client-side mount
  useEffect(() => {
    setIsClient(true);
    checkLoginStatus();

    const handleAuthChange = () => {
        checkLoginStatus();
    };
    window.addEventListener('authChange', handleAuthChange);


    if (!localStorage.getItem("token")) {
        router.push('/auth');
    }

     window.addEventListener('authChange', handleAuthChange);

     return () => {
       window.removeEventListener('authChange', handleAuthChange);
     };

  }, [router]);

  useEffect(() => {
    if (isMobile && openMobile) {
      setOpenMobile(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname, isMobile]);


  // Performs the actual logout
  const confirmLogout = () => {
    setIsLoggingOut(true); // Start loading
    setTimeout(() => { // Simulate logout delay
      if (typeof window !== 'undefined') {
         localStorage.removeItem("token");
         localStorage.removeItem("id");
         localStorage.removeItem("username");
         window.dispatchEvent(new CustomEvent('authChange'));
      }
      setShowLogoutConfirm(false); // Close dialog
      setOpenMobile(false); // Close mobile menu if open
      setIsLoggingOut(false); // Stop loading
      router.push('/auth');
    }, 500); // Simulate 0.5 second delay
  };

  const handleNavigation = (path) => {
    router.push(path);
  };

  // Sidebar Context Value
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


   if (!isClient || !isLoggedIn) {
      return (
        <div className="flex min-h-screen items-center justify-center">
          <p>Loading...</p>
        </div>
      );
   }

  return (
    <TooltipProvider delayDuration={0}>
    <SidebarContext.Provider value={contextValue}>
        <div className="flex h-screen overflow-hidden">
            <Sidebar>
                <SidebarHeader className="border-b border-sidebar-border">
                <div className="flex items-center justify-between p-2">
                    {/* Mobile Trigger */}
                    <SidebarTrigger className="md:hidden"/>
                    {/* Desktop User Info */}
                    <div className="hidden md:flex items-center gap-2">
                        <Avatar className="h-8 w-8">
                        {/* Use pravatar for placeholder */}
                        <AvatarImage src={`https://i.pravatar.cc/40?u=${username}`} alt={username} />
                        <AvatarFallback>{username.substring(0, 1).toUpperCase()}</AvatarFallback>
                        </Avatar>
                        {/* Use context state to conditionally hide username */}
                        <span className={cn("text-sm font-medium", contextValue.state === 'collapsed' && 'sr-only group-data-[collapsible=icon]:hidden')}>
                          {username}
                        </span>
                    </div>
                    {/* Actions (Notifications/Settings) */}
                    <div className="flex items-center gap-1">
                        <Button variant="ghost" size="icon" aria-label="Notifications">
                            <Bell className="size-4" />
                        </Button>
                        <Link href="/dashboard/update" passHref legacyBehavior>
                            <Button variant="ghost" size="icon" aria-label="Settings">
                                <Settings className="size-4" />
                            </Button>
                        </Link>
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
                           {/* Pass icon component directly */}
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
                     {/* Wrap the button and dialog content in AlertDialog */}
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

             {/* Main Content Area */}
             <SidebarInset className="flex-1 overflow-auto"> {/* Removed flex flex-col */}
                {/* Header for main content area (mobile only) */}
                <header className="flex items-center justify-between p-4 border-b md:hidden shrink-0 bg-background z-10 sticky top-0"> {/* Added sticky top-0 */}
                    <h2 className="text-xl font-semibold capitalize">
                        {sidebarLinks.find(link => link.id === pathname)?.label || 'Dashboard'}
                    </h2>
                    <SidebarTrigger />
                </header>
                {/* Render the specific page component passed as children */}
                <div className="p-4 md:p-6"> {/* Removed flex-1 and overflow-y-auto */}
                   {children}
                </div>
            </SidebarInset>
         </div>
    </SidebarContext.Provider>
    </TooltipProvider>
  );
}
