'use client';

import React, { useState, useEffect, useMemo } from 'react'; // Added useEffect, useMemo
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
  SidebarContext, // Import context to provide it
  useSidebar, // Keep if needed, but primary use is within Sidebar component
} from '@/components/ui/sidebar';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Bell, Settings, User, Edit3, PlusCircle, Mail, FileText, LogOut, BarChart, Zap, Users as UsersIcon, ListChecks } from 'lucide-react'; // Added more icons
import { useRouter, usePathname } from 'next/navigation'; // For navigation, added usePathname
import Link from 'next/link'; // For internal links
import { useIsMobile } from '@/hooks/use-mobile'; // Import useIsMobile hook
import { cn } from '@/lib/utils'; // Import cn utility function

// Placeholder components for different dashboard sections - These will eventually be separate pages or components
// We pass the main page content via `children` now.

// Define the structure for sidebar links
const sidebarLinks = [
    { id: '/dashboard', label: 'My Profile', icon: User },
    { id: '/dashboard/update', label: 'Update Profile', icon: Edit3 },
    { id: '/dashboard/opportunities/new', label: 'Post Opportunity', icon: PlusCircle },
    { id: '/dashboard/collabs/new', label: 'Post Collab', icon: PlusCircle },
    { id: '/dashboard/opportunities/myopportunities', label: 'My Opportunities', icon: ListChecks }, // Renamed & updated icon
    { id: '/dashboard/collabs/myrequests', label: 'My Collabs', icon: ListChecks }, // Updated icon
    // Adding links to main app sections for convenience
    { id: '/generate', label: 'Generate Ideas', icon: Zap },
    { id: '/predict', label: 'Predict Performance', icon: BarChart },
    { id: '/opportunities', label: 'Browse Opportunities', icon: FileText },
    { id: '/collabs', label: 'Browse Collabs', icon: UsersIcon },
];

export default function DashboardClient({ children }) {
  const router = useRouter();
  const pathname = usePathname(); // Get current path
  const [username, setUsername] = useState('User'); // Default username
  const [isClient, setIsClient] = useState(false); // To avoid hydration issues

  // Sidebar state management lifted here
  const isMobile = useIsMobile();
  const [open, setOpen] = useState(true); // Desktop sidebar state
  const [openMobile, setOpenMobile] = useState(false); // Mobile sidebar state

  // Get active path and username on client-side mount
  useEffect(() => {
    setIsClient(true); // Component has mounted on the client
    const storedUsername = localStorage.getItem("username");
    if (storedUsername) {
      setUsername(storedUsername);
    }
     // Close mobile sidebar on navigation if it's open
     // setOpenMobile(false); // Removed this line to keep mobile sidebar state persistent across navigations unless explicitly closed
  }, []); // Removed pathname dependency to avoid closing sidebar on every route change

  // Add effect to close mobile sidebar specifically on pathname change if it's open
  useEffect(() => {
    if (isMobile && openMobile) {
      setOpenMobile(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname, isMobile]); // Dependency on pathname and isMobile

  const handleLogout = () => {
    // Clear local storage
     if (typeof window !== 'undefined') {
        localStorage.removeItem("token");
        localStorage.removeItem("id");
        localStorage.removeItem("username");
     }
    // Redirect to login page
    router.push('/auth');
  };

  const handleNavigation = (path) => {
    router.push(path);
    // Mobile sidebar closing is handled by the useEffect hook reacting to pathname change
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


  // Prevent rendering potentially mismatching content on the server
   if (!isClient) {
     return null; // Or a loading skeleton
   }

  return (
    // Provide the sidebar context to all children
    <SidebarContext.Provider value={contextValue}>
      {/* Render Sidebar - it will consume the context */}
      <Sidebar>
        <SidebarHeader className="border-b border-sidebar-border">
          <div className="flex items-center justify-between p-2">
             {/* Mobile Trigger - Correctly uses context now */}
             <SidebarTrigger className="md:hidden"/>
              {/* Desktop User Info */}
              <div className="hidden md:flex items-center gap-2">
                <Avatar className="h-8 w-8">
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
                 {/* Link to profile settings */}
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
                  isActive={pathname === link.id} // Use pathname for active state
                  tooltip={link.label} // Tooltip for collapsed view
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
               <SidebarMenuButton tooltip="Logout" onClick={handleLogout}>
                 <LogOut />
                 <span>Logout</span>
               </SidebarMenuButton>
             </SidebarMenuItem>
           </SidebarMenu>
        </SidebarFooter>
      </Sidebar>

      {/* Main Content Area - Renders the actual page content */}
      <SidebarInset>
        {/* Header for main content area, including the mobile trigger */}
        <header className="flex items-center justify-between p-4 border-b md:hidden">
            {/* Find the current page title */}
           <h2 className="text-xl font-semibold capitalize">
               {sidebarLinks.find(link => link.id === pathname)?.label || 'Dashboard'}
           </h2>
           {/* This trigger now works correctly because context is provided above */}
           <SidebarTrigger />
        </header>
        {/* Render the specific page component passed as children */}
        <div className="p-4 md:p-6"> {/* Add padding around the content */}
          {children}
        </div>
      </SidebarInset>
    </SidebarContext.Provider>
  );
}
