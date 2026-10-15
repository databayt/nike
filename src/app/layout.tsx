import type { Metadata } from "next";
import { Inter, Rubik, Oswald, Anton } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap'
});

const rubik = Rubik({
  subsets: ['arabic', 'latin'],
  variable: '--font-rubik',
  display: 'swap'
});

// Condensed grotesque for the campaign hero headlines — a free stand-in for
// Nike's proprietary Trade Gothic / Futura condensed brand type.
const oswald = Oswald({
  subsets: ['latin'],
  weight: ['500', '600', '700'],
  variable: '--font-display',
  display: 'swap'
});

// Condensed heavy grotesque — a free stand-in for "Nike Futura ND", the
// proprietary face nike.com sets its uppercase campaign headlines in
// (FULLY INVESTED, LAST WORD, TRENDING …).
const anton = Anton({
  subsets: ['latin'],
  weight: '400',
  variable: '--font-anton',
  display: 'swap'
});

export const metadata: Metadata = {
  title: "Nike",
  description: "An e-commerce platform for Nike shoes",
};

export default function RootShell({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html suppressHydrationWarning>
      <body className={`${inter.variable} ${rubik.variable} ${oswald.variable} ${anton.variable} antialiased`}>
        {children}
      </body>
    </html>
  );
}
