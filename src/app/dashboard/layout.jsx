import DashboardClient from './dashboard-client';

export default function DashboardLayout({ children }) {
  return (
    // DashboardClient provides the Sidebar and the main content area structure
    <DashboardClient>
      {children}
    </DashboardClient>
  );
}
