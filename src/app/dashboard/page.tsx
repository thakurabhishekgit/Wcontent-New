import { SidebarProvider } from '@/components/ui/sidebar';
import DashboardClient from './dashboard-client';

export default function DashboardPage() {
  return (
    // Wrap the entire dashboard layout with the provider
    <SidebarProvider>
      <DashboardClient />
    </SidebarProvider>
  );
}
