
'use client';

import { GoogleOAuthProvider } from '@react-oauth/google';
import React from 'react';

export function Providers({ children }) {
  const googleClientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;

  if (!googleClientId) {
    // Log an error but still render children so the app doesn't break entirely.
    // Google Auth will just fail if attempted.
    console.error("Google Client ID is not configured. Please set NEXT_PUBLIC_GOOGLE_CLIENT_ID in your .env file.");
    return <>{children}</>;
  }

  return (
    <GoogleOAuthProvider clientId={googleClientId}>
        {children}
    </GoogleOAuthProvider>
  );
}
