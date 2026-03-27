import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Badge, Button } from "@/components/ui";
import AppSidebar from "@/components/layout/app-sidebar";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "My Revit Viewer",
  description: "Read-only Revit model viewer for AEC teams",
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
      <body className="min-h-full bg-slate-50 text-slate-900">
        <div className="grid min-h-screen grid-cols-1 lg:grid-cols-[240px_1fr]">
          <AppSidebar />

          <div className="flex min-w-0 flex-col">
            <header className="sticky top-0 z-20 border-b border-slate-200 bg-white/95 backdrop-blur">
              <div className="header-gradient-accent h-0.5 w-full" />
              <div className="app-shell flex items-center justify-between py-3">
                <div>
                  <p className="label-eyebrow">Enterprise Workspace</p>
                  <p className="text-sm font-medium text-slate-900">My Revit Viewer</p>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="neutral">Koustav Dhar</Badge>
                  <Button href="/login" variant="secondary" size="sm">
                    Login
                  </Button>
                </div>
              </div>
            </header>

            {children}
          </div>
        </div>
      </body>
    </html>
  );
}
