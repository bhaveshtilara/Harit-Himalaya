import './globals.css';
import { Metadata } from 'next';
import React, { ReactNode } from 'react';

export const metadata: Metadata = {
  title: 'Harit Himalaya',
  icons: {
    icon: '/favicon.ico', 
  },
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <head />
      <body>{children}</body>
    </html>
  );
}