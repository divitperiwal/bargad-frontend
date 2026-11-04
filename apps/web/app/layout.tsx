import type { Metadata } from 'next';
import {
  Bricolage_Grotesque,
  DM_Sans,
  Geist_Mono,
  Instrument_Sans,
  Instrument_Serif,
  Libre_Caslon_Text,
  Manrope,
} from 'next/font/google';
import './globals.css';

const instrumentSerif = Instrument_Serif({
  variable: '--font-instrument',
  subsets: ['latin'],
  weight: '400',
  style: ['normal', 'italic'],
});

const manrope = Manrope({ variable: '--font-manrope', subsets: ['latin'] });

const bricolage = Bricolage_Grotesque({
  variable: '--font-bricolage',
  subsets: ['latin'],
});

const instrumentSans = Instrument_Sans({
  variable: '--font-instrument-sans',
  subsets: ['latin'],
});

const caslon = Libre_Caslon_Text({
  variable: '--font-caslon',
  subsets: ['latin'],
  weight: '400',
  style: ['normal', 'italic'],
});

const dmSans = DM_Sans({ variable: '--font-dm-sans', subsets: ['latin'] });

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'Bargad',
  description: 'One family. Many roots.',
};

const fontVars = [instrumentSerif, manrope, bricolage, instrumentSans, caslon, dmSans, geistMono]
  .map((f) => f.variable)
  .join(' ');

export default function RootLayout({ children }: LayoutProps<'/'>) {
  return (
    <html lang="en" data-type="g" className={`${fontVars} h-full antialiased`}>
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
