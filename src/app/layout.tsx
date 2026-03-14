import type { Metadata } from "next";
import { Geist, Geist_Mono, Hind_Siliguri } from "next/font/google";
import { Toaster } from "react-hot-toast";

import FloatingChat from "@/components/chat/FloatingChat";
import { cookies } from "next/headers";
import "./globals.css";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: "swap",
  preload: true
});
const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
  preload: true
});
const hindSiliguri = Hind_Siliguri({
  weight: ["300", "400", "500", "600", "700"],
  subsets: ["bengali", "latin"],
  variable: "--font-hind-siliguri",
  display: "swap",
});

export const metadata: Metadata = {
  title: "CareerCanvas : Smart Online LMS Platform",
  description: "CareerCanvas learning management system designed to deliver smart, personalized, and interactive online education experiences.",
  icons: {
    icon: [{ url: "/favicon.svg", type: "image/svg+xml" }, { url: "/favicon.ico", sizes: "32x32" }],
  },
};

// ─────────────────────────────────────────────────────────
// Cookie থেকে user বের করা
// আপনার login route এ যে cookie নামে token save হয়
// সেই নাম দিয়ে replace করুন
// ─────────────────────────────────────────────────────────
async function getUser() {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value; // ← আপনার cookie নাম
    if (!token) return null;

    const base64Payload = token.split(".")[1];
    if (!base64Payload) return null;

    const payload = JSON.parse(
      Buffer.from(base64Payload, "base64url").toString("utf-8")
    );

    return {
      id: payload.id ?? payload.userId ?? payload.sub ?? "user",
      name: payload.name ?? payload.username ?? "Student",
      role: payload.role ?? "student",   // ← JWT এ role থাকলে
      image: payload.image ?? payload.avatar ?? undefined,
    };
  } catch {
    return null;
  }
}

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const user = await getUser();

  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
        <link rel="icon" type="image/x-icon" href="/favicon.ico" />
        <meta name="theme-color" content="#FF0F7B" />
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  const theme = localStorage.getItem('theme') || 'light';
                  document.documentElement.setAttribute('data-theme', theme);
                  if (theme === 'dark') {
                    document.documentElement.classList.add('dark');
                  }
                } catch (e) {}
              })();
            `,
          }}
        />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${hindSiliguri.variable} antialiased`}
        style={{ fontFamily: "var(--font-hind-siliguri), var(--font-geist-sans), sans-serif" }}
        suppressHydrationWarning
      >
        <Toaster
          position="top-right"
          reverseOrder={false}
          toastOptions={{
            duration: 4000,
            style: {
              background: "#1f2937",
              color: "#fff",
              borderRadius: "12px",
              padding: "12px 20px",
              fontSize: "14px",
              marginTop: "80px", // navbar এর নিচে দেখানোর জন্য
              marginRight: "20px", // right থেকে margin
              boxShadow: "0 10px 25px rgba(0, 0, 0, 0.2)",
              border: "1px solid rgba(255, 255, 255, 0.1)"
            },
            success: {
              iconTheme: { primary: "#10b981", secondary: "#fff" },
              style: {
                background: "#065f46",
                color: "#fff"
              }
            },
            error: {
              iconTheme: { primary: "#ef4444", secondary: "#fff" },
              style: {
                background: "#7f1d1d",
                color: "#fff"
              }
            },
            loading: {
              iconTheme: { primary: "#3b82f6", secondary: "#fff" },
              style: {
                background: "#1e40af",
                color: "#fff"
              }
            }
          }}
        />

        {children}

        {/* FloatingChat — Login হলে সব page এ দেখাবে */}
        {user && (
          <FloatingChat
            userId={user.id}
            userName={user.name}
            userRole={user.role}
            userAvatar={user.image}
          />
        )}

      </body>
    </html>
  );
}