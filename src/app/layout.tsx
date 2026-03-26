import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Link from "next/link";
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
      <body className="min-h-full flex flex-col bg-slate-50 text-slate-900">
        <header className="sticky top-0 z-20 border-b border-slate-200/90 bg-white/90 backdrop-blur">
          <nav className="app-shell flex items-center justify-between py-3.5">
            <Link href="/" className="text-base font-semibold tracking-tight text-slate-900">
              My Revit Viewer
            </Link>
            <div className="flex items-center gap-2">
              <Link
                href="/dashboard"
                className="rounded-md px-3 py-2 text-sm font-medium text-slate-600 transition hover:bg-slate-100 hover:text-slate-900"
              >
                Dashboard
              </Link>
              <Link
                href="/login"
                className="btn-primary px-3 py-2"
              >
                Login
              </Link>
            </div>
          </nav>
        </header>
        {children}
      </body>
    </html>
  );
}
