
'use client';

import React, { useState } from 'react';
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
import { Bell, Settings, User, Edit3, PlusCircle, Mail, FileText, LogOut } from 'lucide-react';

// Placeholder components for different dashboard sections
const MyProfile = () => <div className="p-4"><h2 className="text-2xl font-semibold">My Profile</h2><p>Profile details go here...</p></div>;
const UpdateProfile = () => <div className="p-4"><h2 className="text-2xl font-semibold">Update Profile</h2><p>Profile editing form goes here...</p></div>;
const PostOpportunity = () => <div className="p-4"><h2 className="text-2xl font-semibold">Post Opportunity</h2><p>Form to post a new opportunity...</p></div>;
const PostCollab = () => <div className="p-4"><h2 className="text-2xl font-semibold">Post Collab</h2><p>Form to post a new collaboration request...</p></div>;
const MyCollabRequests = () => <div className="p-4"><h2 className="text-2xl font-semibold">My Collab Requests</h2><p>List of collaboration requests you've sent or received...</p></div>;
const MyOpportunityApplications = () => <div className="p-4"><h2 className="text-2xl font-semibold">My Opportunity Applications</h2><p>List of opportunities you've applied for...</p></div>;

export default function DashboardClient() {
  const [activeSection, setActiveSection] = useState('profile');

  const renderSection = () => {
    switch (activeSection) {
      case 'profile': return <MyProfile />;
      case 'update-profile': return <UpdateProfile />;
      case 'post-opportunity': return <PostOpportunity />;
      case 'post-collab': return <PostCollab />;
      case 'collab-requests': return <MyCollabRequests />;
      case 'opportunity-apps': return <MyOpportunityApplications />;
      default: return <MyProfile />;
    }
  };

  const sidebarLinks = [
    { id: 'profile', label: 'My Profile', icon: User },
    { id: 'update-profile', label: 'Update Profile', icon: Edit3 },
    { id: 'post-opportunity', label: 'Post Opportunity', icon: PlusCircle },
    { id: 'post-collab', label: 'Post Collab', icon: PlusCircle }, // Consider different icon later
    { id: 'collab-requests', label: 'My Collab Requests', icon: Mail },
    { id: 'opportunity-apps', label: 'My Opportunity Apps', icon: FileText },
  ];


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
                  <AvatarImage src="https://i.pravatar.cc/40?u=dashboardUser" alt="User" />
                  <AvatarFallback>U</AvatarFallback>
                </Avatar>
                <span className="text-sm font-medium group-data-[collapsed=icon]:hidden">Username</span>
              </div>
             {/* Actions (Notifications/Settings) */}
             <div className="flex items-center gap-1">
                <Button variant="ghost" size="icon" aria-label="Notifications">
                    <Bell className="size-4" />
                </Button>
                <Button variant="ghost" size="icon" aria-label="Settings">
                    <Settings className="size-4" />
                </Button>
             </div>
          </div>
        </SidebarHeader>
        <SidebarContent>
          <SidebarMenu>
            {sidebarLinks.map(link => (
               <SidebarMenuItem key={link.id}>
                <SidebarMenuButton
                  onClick={() => setActiveSection(link.id)}
                  isActive={activeSection === link.id}
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
               <SidebarMenuButton tooltip="Logout">
                 <LogOut />
                 <span>Logout</span>
               </SidebarMenuButton>
             </SidebarMenuItem>
           </SidebarMenu>
        </SidebarFooter>
      </Sidebar>

      {/* Main Content Area */}
      <SidebarInset>
        {/* Header for main content area, including the mobile trigger */}
        <header className="flex items-center justify-between p-4 border-b md:hidden">
           <h2 className="text-xl font-semibold capitalize">{activeSection.replace('-', ' ')}</h2>
           <SidebarTrigger />
        </header>
        {/* Dynamic Content based on sidebar selection */}
        {renderSection()}
      </SidebarInset>
    </>
  );
}
