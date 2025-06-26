import { Inter } from 'next/font/google';
import { Providers } from '@/components/providers';
import { ServiceWorkerProvider } from '@/components/pwa/service-worker';
import { performanceMonitor } from '@/lib/performance';
import '@/styles/globals.css';
import '@/styles/tokens.css';

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
  manifest: '/manifest.json',
  icons: {
    icon: '/favicon.ico',
    apple: '/apple-touch-icon.png',
  },
  viewport: {
    width: 'device-width',
    initialScale: 1,
    maximumScale: 1,
    userScalable: false,
  },
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#ffffff' },
    { media: '(prefers-color-scheme: dark)', color: '#000000' },
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Initialize performance monitoring
  if (typeof window !== 'undefined') {
    performanceMonitor.init();
  }

  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        {/* Preload critical resources */}
        <link rel="preload" href="/fonts/inter-var.woff2" as="font" type="font/woff2" crossOrigin="anonymous" />
        <link rel="dns-prefetch" href="//fonts.googleapis.com" />
        <link rel="dns-prefetch" href="//fonts.gstatic.com" />
        
        {/* PWA meta tags */}
        <meta name="application-name" content="CodeNote" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="CodeNote" />
        <meta name="format-detection" content="telephone=no" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="msapplication-config" content="/browserconfig.xml" />
        <meta name="msapplication-TileColor" content="#000000" />
        <meta name="msapplication-tap-highlight" content="no" />
        
        {/* Performance hints */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body className={inter.className}>
        <Providers>
          <ServiceWorkerProvider>
            <div className="min-h-screen bg-background font-sans antialiased">
              {children}
            </div>
          </ServiceWorkerProvider>
        </Providers>
        
        {/* Performance monitoring script */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              // Performance monitoring
              if (typeof window !== 'undefined') {
                window.addEventListener('load', function() {
                  // Report Core Web Vitals
                  if ('PerformanceObserver' in window) {
                    const observer = new PerformanceObserver((list) => {
                      list.getEntries().forEach((entry) => {
                        if (entry.entryType === 'largest-contentful-paint') {
                          console.log('LCP:', entry.startTime);
                        }
                      });
                    });
                    observer.observe({ entryTypes: ['largest-contentful-paint'] });
                  }
                });
              }
            `,
          }}
        />
      </body>
    </html>
  );
}
