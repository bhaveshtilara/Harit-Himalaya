import { Inter } from 'next/font/google';
import './globals.css';
import { Toaster } from 'react-hot-toast';
import type { ReactNode } from 'react'; 
const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: 'Harit Himalaya',
  description: 'A community-driven initiative to keep our sacred mountains pristine.',
};
export default function RootLayout({ children }: { children: ReactNode }) { 
  return (
    <html lang="en">
      <body className={`${inter.className} bg-gray-50`}>
        <Toaster position="top-center" />
        {children}
      </body>
    </html>
  );
}