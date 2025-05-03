
'use client';

import React, { useState, useEffect } from 'react'; // Added useEffect
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
} from '@/components/ui/sidebar';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Bell, Settings, User, Edit3, PlusCircle, Mail, FileText, LogOut, BarChart, Zap, Users as UsersIcon } from 'lucide-react'; // Added more icons
import { useRouter } from 'next/navigation'; // For navigation
import Link from 'next/link'; // For internal links

// Placeholder components for different dashboard sections - These will eventually be separate pages or components
// We pass the main page content via `children` now.
// const MyProfile = () => <div className="p-4"><h2 className="text-2xl font-semibold">My Profile</h2><p>Profile details go here...</p></div>;
// const UpdateProfile = () => <div className="p-4"><h2 className="text-2xl font-semibold">Update Profile</h2><p>Profile editing form goes here...</p></div>;
// const PostOpportunity = () => <div className="p-4"><h2 className="text-2xl font-semibold">Post Opportunity</h2><p>Form to post a new opportunity...</p></div>;
// const PostCollab = () => <div className="p-4"><h2 className="text-2xl font-semibold">Post Collab</h2><p>Form to post a new collaboration request...</p></div>;
// const MyCollabRequests = () => <div className="p-4"><h2 className="text-2xl font-semibold">My Collab Requests</h2><p>List of collaboration requests you've sent or received...</p></div>;
// const MyOpportunityApplications = () => <div className="p-4"><h2 className="text-2xl font-semibold">My Opportunity Applications</h2><p>List of opportunities you've applied for...</p></div>;


// Define the structure for sidebar links
const sidebarLinks = [
    { id: '/dashboard', label: 'My Profile', icon: User },
    { id: '/dashboard/update', label: 'Update Profile', icon: Edit3 }, // Assuming route structure
    { id: '/dashboard/opportunities/new', label: 'Post Opportunity', icon: PlusCircle },
    { id: '/dashboard/collabs/new', label: 'Post Collab', icon: PlusCircle }, // Assuming route structure
    { id: '/dashboard/collabs/myrequests', label: 'My Collab Requests', icon: Mail }, // Assuming route structure
    { id: '/dashboard/opportunities/myapps', label: 'My Opportunity Apps', icon: FileText }, // Assuming route structure
    // Adding links to main app sections for convenience
    { id: '/generate', label: 'Generate Ideas', icon: Zap },
    { id: '/predict', label: 'Predict Performance', icon: BarChart },
    { id: '/opportunities', label: 'Browse Opportunities', icon: FileText },
    { id: '/collabs', label: 'Browse Collabs', icon: UsersIcon },
];

export default function DashboardClient({ children }) {
  const router = useRouter();
  const [activePath, setActivePath] = useState('');
  const [username, setUsername] = useState('User'); // Default username
  const [isClient, setIsClient] = useState(false); // To avoid hydration issues

  // Get active path and username on client-side mount
  useEffect(() => {
    setIsClient(true); // Component has mounted on the client
    setActivePath(window.location.pathname);
    const storedUsername = localStorage.getItem("username");
    if (storedUsername) {
      setUsername(storedUsername);
    }
  }, []);

  const handleLogout = () => {
    // Clear local storage
     if (typeof window !== 'undefined') {
        localStorage.removeItem("token");
        localStorage.removeItem("id");
        localStorage.removeItem("username");
     }
    // Redirect to login page
    router.push('/auth');
     // Optionally, refresh the page or update global state if needed
     // window.location.reload(); // Might be too disruptive, prefer Next.js navigation
  };

  const handleNavigation = (path) => {
    setActivePath(path);
    router.push(path);
  };

  // Prevent rendering potentially mismatching content on the server
   if (!isClient) {
     return null; // Or a loading skeleton
   }


  return (
    <>
      <Sidebar>
        <SidebarHeader className="border-b border-sidebar-border">
          <div className="flex items-center justify-between p-2">
             {/* Mobile Trigger */}
             <SidebarTrigger className="md:hidden"/>
              {/* Desktop User Info */}
              <div className="hidden md:flex items-center gap-2">
                <Avatar className="h-8 w-8">
                  <AvatarImage src={`https://i.pravatar.cc/40?u=${username}`} alt={username} />
                  <AvatarFallback>{username.substring(0, 1).toUpperCase()}</AvatarFallback>
                </Avatar>
                <span className="text-sm font-medium group-data-[collapsed=icon]:hidden">{username}</span>
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
                  isActive={activePath === link.id}
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
               {sidebarLinks.find(link => link.id === activePath)?.label || 'Dashboard'}
           </h2>
           <SidebarTrigger />
        </header>
        {/* Render the specific page component passed as children */}
        <div className="p-4 md:p-6"> {/* Add padding around the content */}
          {children}
        </div>
      </SidebarInset>
    </>
  );
}
