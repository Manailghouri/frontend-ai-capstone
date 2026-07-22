import React from 'react';
import type { Metadata } from 'next';
import '../styles/globals.css';

export const metadata: Metadata = {
  title: 'Settings - Frontend AI Capstone Playground',
  description: 'Manage settings, preferred LLM models, theme configurations, and credentials for the AI-assisted developer capstone playground.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        {children}
      </body>
    </html>
  );
}
