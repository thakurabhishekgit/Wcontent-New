
'use client';

import React from 'react';

// The GoogleOAuthProvider is no longer needed for a server-side OAuth flow.
// The frontend will simply link to the backend to start the process.
export function Providers({ children }) {
  return <>{children}</>;
}
