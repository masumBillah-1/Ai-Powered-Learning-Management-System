import type { Metadata } from "next";
import { Geist, Geist_Mono, Hind_Siliguri } from "next/font/google";
import { Toaster } from "react-hot-toast";
<<<<<<< HEAD
=======

import FloatingChat from "@/components/chat/FloatingChat";
import { cookies } from "next/headers";
>>>>>>> 5903b4acab9c5598cbcf04e0d08ba85c131f506f
import "./globals.css";

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
  title: "SmartLMS Pro : Smart Online LMS Platform",
<<<<<<< HEAD
  description:
    "SmartLMS Pro learning management system designed to deliver smart, personalized, and interactive online education experiences.",
=======
  description: "SmartLMS Pro learning management system designed to deliver smart, personalized, and interactive online education experiences.",
  icons: {
    icon: [{ url: "/favicon.svg", type: "image/svg+xml" }, { url: "/favicon.ico", sizes: "32x32" }],
  },
>>>>>>> 5903b4acab9c5598cbcf04e0d08ba85c131f506f
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
<<<<<<< HEAD
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${hindSiliguri.variable} antialiased`}
        style={{
          fontFamily:
            "var(--font-hind-siliguri), var(--font-geist-sans), sans-serif",
        }}
      >
        <Toaster
          position="top-center"
          reverseOrder={false}
          toastOptions={{
            duration: 3000,
            style: {
              background: "#1f2937",
              color: "#fff",
              borderRadius: "8px",
              padding: "12px 20px",
              fontSize: "14px",
            },
            success: {
              iconTheme: {
                primary: "#10b981",
                secondary: "#fff",
              },
            },
            error: {
              iconTheme: {
                primary: "#ef4444",
                secondary: "#fff",
              },
            },
          }}
        />
        {children}
=======
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
            position="top-left"
            reverseOrder={false}
            toastOptions={{
              duration: 3000,
              style: { 
                background: "#1f2937", 
                color: "#fff", 
                borderRadius: "8px", 
                padding: "12px 20px", 
                fontSize: "14px",
                marginTop: "80px", // navbar এর নিচে দেখানোর জন্য
                marginLeft: "20px" // একটু left থেকে margin
              },
              success: { iconTheme: { primary: "#10b981", secondary: "#fff" } },
              error: { iconTheme: { primary: "#ef4444", secondary: "#fff" } },
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
  
>>>>>>> 5903b4acab9c5598cbcf04e0d08ba85c131f506f
      </body>
    </html>
  );
}