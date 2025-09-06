import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import "../styles/messenger.css";
import { AuthProvider } from "@/contexts/AuthContext";
import { ChatProvider } from "@/contexts/ChatProvider";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Windows Live Messenger 2005",
  description: "Revive la nostalgia del MSN Messenger con esta recreación fiel del cliente de chat más querido de los 2000s.",
  keywords: ["MSN", "Messenger", "Windows Live", "Chat", "2005", "Nostalgia"],
  authors: [{ name: "MSN Revival Team" }],
  viewport: "width=device-width, initial-scale=1",
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon.ico",
    apple: "/apple-touch-icon.png"
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <head>
        {/* MSN-style favicon */}
        <link rel="icon" href="/favicon.ico" sizes="any" />
        
        {/* Google Fonts for nostalgic typography */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link href="https://fonts.googleapis.com/css2?family=Segoe+UI:wght@400;500;600;700&family=Tahoma:wght@400;700&display=swap" rel="stylesheet" />
        
        {/* Meta tags for better MSN experience */}
        <meta name="theme-color" content="#0066CC" />
        <meta property="og:title" content="Windows Live Messenger 2005" />
        <meta property="og:description" content="Revive la nostalgia del MSN Messenger" />
        <meta property="og:type" content="website" />
      </head>
      <body className={`${inter.className} min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-100`}>
        <AuthProvider>
          <ChatProvider>
            {children}
          </ChatProvider>
        </AuthProvider>
      </body>
    </html>
  );
}