import type React from "react";
import { Suspense } from "react";
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { ThemeProvider } from "@/components/theme-provider";
import { Toaster } from "@/components/ui/sonner";
import Script from "next/script";
import GAListener from "./ga-listener";
import { GA_ID, GA_BOOTSTRAP } from "@/lib/analytics";
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
  title: "CV Generator. AI-Powered Resume Builder",
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
      <head>
        {/* Consent Mode v2 first, so gtag is already in cookieless mode by the
            time the library loads. Nothing in this app grants storage. */}
        <script dangerouslySetInnerHTML={{ __html: GA_BOOTSTRAP }} />
        <Script
          async
          src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`}
          strategy="afterInteractive"
        />
      </head>
      <body className={`${geist.variable} ${geistMono.variable} antialiased`}>
        <ThemeProvider
          attribute="class"
          defaultTheme={process.env.NEXT_PUBLIC_DEFAULT_THEME || "modern"}
          themes={["light", "dark", "modern"]}
          enableColorScheme={false}
          disableTransitionOnChange
        >
          {children}
          <Toaster />
          {/* useSearchParams needs a boundary or the route cannot be prerendered. */}
          <Suspense fallback={null}>
            <GAListener />
          </Suspense>
        </ThemeProvider>
      </body>
    </html>
  );
}
