import type { Metadata, Viewport } from 'next';
import { Inter, Outfit } from 'next/font/google';
import './globals.css';
import ScrollToTop from '@/components/ScrollToTop';

const inter = Inter({
  variable: '--font-sans',
  subsets: ['latin'],
});

const outfit = Outfit({
  variable: '--font-heading',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: {
    default: 'Paramakudi Lions Matriculation Higher Secondary School',
    template: '%s | Paramakudi Lions School'
  },
  description: 'Paramakudi Lions Matriculation Higher Secondary School, Thelichathanallur, Paramakudi. Elevating education, character building, and mentoring young minds since 1991.',
  keywords: [
    'Paramakudi Lions School',
    'Lions Matriculation School Paramakudi',
    'Best School in Paramakudi',
    'Lions school PMK',
    'Matriculation Higher Secondary School Ramanathapuram',
    'Lions School admission'
  ],
  authors: [{ name: 'Paramakudi Lions School' }],

  metadataBase: new URL('https://paramakudilionsschool.in'),
  openGraph: {
    title: 'Paramakudi Lions Matriculation Higher Secondary School',
    description: 'Elevating education, character building, and mentoring young minds since 1991.',
    url: 'https://paramakudilionsschool.in',
    siteName: 'Paramakudi Lions School',
    locale: 'en_IN',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Paramakudi Lions Matriculation Higher Secondary School',
    description: 'Providing premium education and character building since 1991.',
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
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  viewportFit: 'cover', // Required for iOS safe-area-inset env() variables
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${outfit.variable} scroll-smooth`}>
      <body className="font-sans antialiased text-slate-800 bg-slate-50 min-h-screen flex flex-col">
        {children}
        <ScrollToTop />
      </body>
    </html>
  );
}
