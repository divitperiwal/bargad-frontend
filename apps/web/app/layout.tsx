import type { Metadata } from 'next';
import { Geist_Mono, Onest, Source_Serif_4 } from 'next/font/google';
import './globals.css';

// Headings, the wordmark and money: a contemporary serif at regular weight,
// using its display optical size so large type stays crisp.
const sourceSerif = Source_Serif_4({
  variable: '--font-source-serif',
  subsets: ['latin'],
  axes: ['opsz'],
  style: ['normal', 'italic'],
});

// Body and controls: open shapes and a large x-height, easy to read for
// every member of the family.
const onest = Onest({
  variable: '--font-onest',
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
      className={`${sourceSerif.variable} ${onest.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
