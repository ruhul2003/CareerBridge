'use client';
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import NavBar from "@/Components/NavBar";
import Footer from "@/Components/footer";
import ScrollToTop from "@/Components/ScrollToTop";
import { Toaster } from "react-hot-toast";
import { ThemeProvider } from "@/context/ThemeContext";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

import CustomCursor from "@/Components/CustomCursor";
import AIChatAssistant from "@/Components/AIChatAssistant";

export default function RootLayout({ children }) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <head>
        <link rel="icon" href="/logo.png" sizes="any" />
        <link rel="apple-touch-icon" href="/logo.png" />
      </head>
      <body className="min-h-full bg-zinc-50 text-zinc-900 dark:bg-black dark:text-zinc-100 transition-colors duration-300 flex flex-col">
        <ThemeProvider>
          <CustomCursor />
          <NavBar />
          <main className="flex-1">
            {children}
            <Toaster position="top-right" reverseOrder={false} />
          </main>
          <Footer />
          <ScrollToTop />
          <AIChatAssistant />
        </ThemeProvider>
      </body>
    </html>
  );
}
