import DashboardClient from './dashboard-client';

export default function DashboardLayout({ children }) {
  return (
    // DashboardClient provides the Sidebar and the main content area structure
    // Wrap children in a flex container to manage layout
    <div className="flex flex-1">
       <DashboardClient>
         {children}
       </DashboardClient>
    </div>
  );
}
