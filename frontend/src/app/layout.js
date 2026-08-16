'use client';
import { Inter, Plus_Jakarta_Sans, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import NavBar from "@/Components/NavBar";
import Footer from "@/Components/footer";
import ScrollToTop from "@/Components/ScrollToTop";
import { Toaster } from "react-hot-toast";
import { ThemeProvider } from "@/context/ThemeContext";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const plusJakarta = Plus_Jakarta_Sans({
  variable: "--font-jakarta",
  subsets: ["latin"],
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
  display: "swap",
});

import CustomCursor from "@/Components/CustomCursor";
import AIChatAssistant from "@/Components/AIChatAssistant";

export default function RootLayout({ children }) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${plusJakarta.variable} ${jetbrainsMono.variable} h-full antialiased`}
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
