import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { Providers } from '@/components/providers';
import { Toaster } from '@/components/ui/toaster';
import '@/styles/globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: {
    default: 'CodeNote - AI-Powered DSA Practice and Note-Taking Companion',
    template: '%s | CodeNote',
  },
  description: 'Transform your data structures and algorithms prep into a personalized, interactive journey with AI-powered optimization and smart note-taking.',
  keywords: [
    'DSA',
    'Data Structures',
    'Algorithms',
    'Coding Practice',
    'AI',
    'Note Taking',
    'Programming',
    'Competitive Programming',
  ],
  authors: [{ name: 'Aman Agrawal' }],
  creator: 'Aman Agrawal',
  publisher: 'CodeNote',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: '/',
    title: 'CodeNote - AI-Powered DSA Practice and Note-Taking Companion',
    description: 'Transform your data structures and algorithms prep into a personalized, interactive journey.',
    siteName: 'CodeNote',
    images: [
      {
        url: '/banner.png',
        width: 1200,
        height: 630,
        alt: 'CodeNote Banner',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'CodeNote - AI-Powered DSA Practice and Note-Taking Companion',
    description: 'Transform your data structures and algorithms prep into a personalized, interactive journey.',
    images: ['/banner.png'],
    creator: '@your-twitter-handle',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: 'your-google-verification-code',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <Providers>
          <div className="min-h-screen bg-background font-sans antialiased">
            {children}
            <Toaster />
          </div>
        </Providers>
      </body>
    </html>
  );
}
