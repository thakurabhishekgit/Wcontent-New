'use client';

import type { ReactNode } from 'react';

// Currently empty, but needed for Genkit client setup structure.
// Add any client-side providers here (e.g., QueryClientProvider, SessionProvider).

export function Providers({ children }: { children: ReactNode }) {
  return <>{children}</>;
}
