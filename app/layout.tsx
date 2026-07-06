import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner";
import { Shell } from "@/components/layout/Shell";
import { KeyboardShortcuts } from "@/components/layout/KeyboardShortcuts";
import Ferrofluid from "@/components/ui/Ferrofluid";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Project Stark",
  description: "Personal AI Operating System",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col relative overflow-hidden bg-black text-white selection:bg-indigo-500/30">
        <div className="fixed inset-0 z-0 opacity-40">
          <Ferrofluid
            colors={["#4F46E5", "#8B5CF6", "#0ea5e9"]}
            speed={0.3}
            scale={1.8}
            turbulence={0.8}
            fluidity={0.2}
            rimWidth={0.1}
            sharpness={2.0}
            shimmer={1.5}
            glow={1.5}
            flowDirection="down"
            opacity={1}
            mouseInteraction={true}
            mouseStrength={0.8}
            mouseRadius={0.5}
          />
        </div>
        <div className="relative z-10 w-full h-full flex flex-col">
          <KeyboardShortcuts />
          <Shell>{children}</Shell>
          <Toaster position="bottom-right" richColors theme="dark" />
        </div>
      </body>
    </html>
  );
}
