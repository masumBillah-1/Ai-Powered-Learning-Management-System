

// import type { Metadata } from "next";
// import { Geist, Geist_Mono } from "next/font/google";
// import "./globals.css";
// import Navbar from "@/components/layout/Navbar";
// import Footer from "@/components/layout/Footer";


// const geistSans = Geist({
//   variable: "--font-geist-sans",
//   subsets: ["latin"],
// });

// const geistMono = Geist_Mono({
//   variable: "--font-geist-mono",
//   subsets: ["latin"],
// });

// export const metadata: Metadata = {
//   title: "SmartLMS Pro : Smart Online LMS Platform",
//   description: "SmartLMS Pro learning management system designed to deliver smart, personalized, and interactive online education experiences students and instructors.",
// };

// export default function RootLayout({
//   children,
// }: Readonly<{
//   children: React.ReactNode;
// }>) {
//   return (
//     <html lang="en" suppressHydrationWarning>
//       <head>
//         <script dangerouslySetInnerHTML={{
//           __html: `
//             (function() {
//               try {
//                 const theme = localStorage.getItem('theme') || 'light';
//                 document.documentElement.setAttribute('data-theme', theme);
//                 if (theme === 'dark') document.documentElement.classList.add('dark');
//               } catch (e) {}
//             })()
//           `
//         }} />
//       </head>
//       <body
//         className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen flex flex-col transition-colors duration-300`}
//       >
//           <Navbar />
        
//           <main className="flex-grow">
//             {children}
//           </main>
//           <Footer />
//       </body>
//     </html>
//   );
// }

// app/layout.tsx
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });

export const metadata: Metadata = {
  title: "SmartLMS Pro",
  description: "Smart Online LMS Platform",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{
          __html: `(function() {
            try {
              const theme = localStorage.getItem('theme') || 'light';
              document.documentElement.setAttribute('data-theme', theme);
              if (theme === 'dark') document.documentElement.classList.add('dark');
            } catch (e) {}
          })()`
        }} />
      </head>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen flex flex-col`}>
        {/* Ekhane Navbar/Footer thakbe na, egulo children er bhetor thakbe */}
        {children}
      </body>
    </html>
  );
}