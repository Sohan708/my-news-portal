import type { Metadata } from 'next';
import { Inter, Playfair_Display } from 'next/font/google';
import './globals.css';
import { Toaster } from 'react-hot-toast';

const inter = Inter({
  variable: '--font-inter',
  subsets: ['latin'],
  display: 'swap',
});

const playfair = Playfair_Display({
  variable: '--font-playfair',
  subsets: ['latin'],
  display: 'swap',
});

export const metadata: Metadata = {
  title: {
    default: 'Sohan Daily News - Your Trusted Source for Breaking News',
    template: '%s | Sohan Daily News',
  },
  description:
    'Stay informed with the latest breaking news, in-depth analysis, and exclusive stories from around the world. Your trusted source for news.',
  keywords: [
    'news',
    'breaking news',
    'world news',
    'politics',
    'business',
    'technology',
    'sports',
    'entertainment',
  ],
  authors: [{ name: 'Sohan Daily News Team' }],
  creator: 'Sohan Daily News',
  publisher: 'Sohan Daily News',
  robots: {
    index: true,
    follow: true,
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: process.env.BASE_URL || 'http://localhost:3000',
    siteName: 'Sohan Daily News',
    title: 'Sohan Daily News - Your Trusted Source for Breaking News',
    description:
      'Stay informed with the latest breaking news, in-depth analysis, and exclusive stories from around the world.',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Sohan Daily News',
    description: 'Your trusted source for breaking news and in-depth analysis',
    creator: '@sohandaily',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${inter.variable} ${playfair.variable} font-sans antialiased`}
      >
        {children}
        <Toaster position="top-right" />
      </body>
    </html>
  );
}
