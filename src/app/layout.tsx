import type { Metadata, Viewport } from "next";
import { Space_Mono, VT323 } from "next/font/google";
import "./globals.css";

const spaceMono = Space_Mono({
  subsets: ["latin"],
  weight: ["400", "700"],
  variable: "--font-space-mono",
  display: "swap",
});

const vt323 = VT323({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-vt323",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Joseph Amandy | Retro OS Portfolio",
  description:
    "Full-Stack Software Developer & UI Designer specializing in Web Systems, Automations, and Retro UI/UX.",
  keywords: [
    "Joseph Amandy",
    "Portfolio",
    "Full-Stack Developer",
    "Web Systems",
    "Retro OS",
    "JavaScript",
    "PHP",
    "Python",
    "Next.js",
  ],
  authors: [{ name: "Joseph Amandy" }],
  openGraph: {
    title: "Joseph Amandy | Retro OS Portfolio",
    description:
      "Interactive 90s Operating System portfolio showcasing software projects, tech stack, and creative design work.",
    type: "website",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${spaceMono.variable} ${vt323.variable}`}>
      <body className="h-screen w-screen overflow-hidden flex flex-col justify-between select-none">
        {children}
      </body>
    </html>
  );
}
