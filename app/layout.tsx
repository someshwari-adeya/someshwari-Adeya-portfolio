import type { Metadata, Viewport } from "next";
import { Space_Grotesk, Inter } from "next/font/google";
import "./globals.css";

const spaceGrotesk = Space_Grotesk({
  variable: "--font-space-grotesk",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

export const viewport: Viewport = {
  themeColor: "#000000",
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

export const metadata: Metadata = {
  title: "Someshwari Adeya — Founder, TechSonance Infotech | Software & AI Engineer",
  description:
    "Someshwari Adeya is the founder and technical lead at TechSonance Infotech LLP in Surat, India. Software agency specializing in high-performance web, mobile, cloud systems, and AI/LLM products.",
  keywords: [
    "Someshwari Adeya",
    "Someshwari",
    "Adeya",
    "TechSonance",
    "TechSonance Infotech",
    "TechSonance Infotech LLP",
    "Surat software agency",
    "Full-Stack Developer",
    "AI Systems Engineer",
    "RAG",
    "Next.js Portfolio",
  ],
  authors: [{ name: "Someshwari Adeya", url: "https://techsonance.com" }],
  creator: "Someshwari Adeya",
  openGraph: {
    title: "Someshwari Adeya — Founder, TechSonance Infotech",
    description:
      "Founder and lead at TechSonance Infotech LLP. Full-stack engineering, scalable SaaS, and applied AI systems.",
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "Someshwari Adeya — Founder, TechSonance Infotech",
    description:
      "Founder and lead at TechSonance Infotech LLP. Full-stack engineering, scalable SaaS, and applied AI systems.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${spaceGrotesk.variable} ${inter.variable} dark h-full antialiased bg-black text-[#f5f5f5]`}
    >
      <body className="min-h-full bg-black text-[#f5f5f5] selection:bg-neutral-800 selection:text-white">
        {children}
      </body>
    </html>
  );
}
