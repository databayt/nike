import type { Metadata } from "next";
import { Inter, Rubik, Oswald, Jost } from "next/font/google";
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

// Geometric sans — a free stand-in for Nike's "Futura ND" brand display face,
// which nike.com uses for its big uppercase homepage headlines (hero, spotlight
// bands, the "Trending" rail). Jost matches Futura's wide geometric letterforms.
const jost = Jost({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-jost',
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
      <body className={`${inter.variable} ${rubik.variable} ${oswald.variable} ${jost.variable} antialiased`}>
        {children}
      </body>
    </html>
  );
}
