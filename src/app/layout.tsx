

import type { Metadata } from "next";
import { Geist, Geist_Mono, Hind_Siliguri } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { Toaster } from "react-hot-toast";


const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const hindSiliguri = Hind_Siliguri({
  weight: ["300", "400", "500", "600", "700"],
  subsets: ["bengali", "latin"],
  variable: "--font-hind-siliguri",
  display: "swap",
});

export const metadata: Metadata = {
  title: "SmartLMS Pro : Smart Online LMS Platform",
  description: "SmartLMS Pro learning management system designed to deliver smart, personalized, and interactive online education experiences students and instructors.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{
          __html: `
            (function() {
              try {
                const theme = localStorage.getItem('theme') || 'light';
                document.documentElement.setAttribute('data-theme', theme);
                if (theme === 'dark') document.documentElement.classList.add('dark');
              } catch (e) {}
            })()
          `
        }} />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${hindSiliguri.variable} antialiased min-h-screen flex flex-col transition-colors duration-300`}
        style={{ fontFamily: 'var(--font-hind-siliguri), var(--font-geist-sans), sans-serif' }}
      >
          <Toaster position="top-right" />
          <Navbar />
          {/* <FAQ /> */}
          <main className="flex-grow">
            {children}
          </main>
          <Footer />
      </body>
    </html>
  );
}