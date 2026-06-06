import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'PHILinspect — Smart Inspection Finder',
  description:
    'Find the right property inspection in minutes. PHILinspect provides independent property inspection services for buyers, owners, builders, and legal cases.',
  keywords: 'property inspection, pre-purchase inspection, building inspection, Philippines, PHILinspect',
  openGraph: {
    title: 'PHILinspect — Smart Inspection Finder',
    description:
      'Answer a few simple questions and PHILinspect will recommend the right inspection service for your property.',
    type: 'website',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </head>
      <body className="min-h-screen bg-white text-gray-800">{children}</body>
    </html>
  );
}
