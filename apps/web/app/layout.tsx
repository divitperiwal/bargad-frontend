import type { Metadata } from 'next';
import { Atkinson_Hyperlegible_Next, Geist_Mono, Literata } from 'next/font/google';
import './globals.css';

// Headings: a sturdy book serif with a real italic, at home next to the
// engraving and still solid at small sizes.
const literata = Literata({
  variable: '--font-literata',
  subsets: ['latin'],
  style: ['normal', 'italic'],
});

// Body and controls: built for legibility, so a parent can read it easily.
const atkinson = Atkinson_Hyperlegible_Next({
  variable: '--font-atkinson',
  // Next has no metrics for this face to build a fallback from.
  adjustFontFallback: false,
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'Bargad',
  description: 'One family. Many roots.',
};

export default function RootLayout({ children }: LayoutProps<'/'>) {
  return (
    <html
      lang="en"
      className={`${literata.variable} ${atkinson.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
