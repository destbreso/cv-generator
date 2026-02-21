import type React from "react";
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { ThemeProvider } from "@/components/theme-provider";
import { Toaster } from "@/components/ui/sonner";
import { DesktopGuard } from "@/components/desktop-guard";
import "./globals.css";

const geist = Geist({
  subsets: ["latin"],
  variable: "--font-sans",
});

const geistMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
});

export const metadata: Metadata = {
  title: "CV Generator — AI-Powered Resume Builder",
  description:
    "Create optimized CVs with AI. Local or cloud LLMs, multiple templates, real-time preview.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${geist.variable} ${geistMono.variable} antialiased`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          themes={["light", "dark", "modern"]}
          enableColorScheme={false}
          disableTransitionOnChange
        >
          <DesktopGuard>{children}</DesktopGuard>
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
}
