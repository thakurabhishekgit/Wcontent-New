'use client'; // Needs to be a client component if it potentially interacts with DashboardClient state, though it's minimal now.

// Removed import of MyProfile as the default content rendering
// is handled within DashboardClient.

export default function DashboardPage() {
  // The content for the default dashboard view ('profile')
  // is rendered by DashboardClient based on its internal state.
  // This page component can be minimal or potentially render a placeholder/welcome message
  // if needed before DashboardClient hydrates and takes over.
  // For now, we keep it simple as DashboardClient will render the default profile section.
  return null; // Or return a loading indicator/placeholder if preferred
}
