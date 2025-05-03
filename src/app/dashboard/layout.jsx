
import DashboardClient from './dashboard-client';

export default function DashboardLayout({ children }) {
  return (
    // DashboardClient itself now manages the sidebar and main content area structure.
    // No extra flex container needed here.
     <DashboardClient>
       {children}
     </DashboardClient>
  );
}
