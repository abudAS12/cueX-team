import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
import { ThemeProvider } from "next-themes";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "CueXs Team",
  description: "We are a dynamic team of 4 passionate individuals dedicated to creating amazing experiences and innovative solutions.",
  keywords: ["Cueks Team", "team", "innovation", "development", "design", "creative"],
  authors: [{ name: "CueXs Team" }],
  icons: {
    icon: "/favicon.ico",
  },
  openGraph: {
    title: "CueXs Team",
    description: "Dynamic team of innovators creating amazing experiences",
    url: "http://localhost:3000",
    siteName: "CueXs Team",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Cueks Team",
    description: "Dynamic team of innovators creating amazing experiences",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-background text-foreground`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem
          disableTransitionOnChange
        >
          <Navbar />
          <main className="min-h-screen pt-16">
            {children}
          </main>
          <Footer />
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
}
