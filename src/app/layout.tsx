import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Badge, Button } from "@/components/ui";
import AppSidebar from "@/components/layout/app-sidebar";
import {
  EnterpriseAppHeader,
  EnterpriseAppMain,
  EnterpriseAppShell,
  EnterpriseMainColumn,
} from "@/components/layout/enterprise-app-shell";
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
      <body className="min-h-dvh bg-[color:var(--background)] text-[color:var(--text)]">
        <EnterpriseAppShell>
          <AppSidebar />
          <EnterpriseMainColumn>
            <EnterpriseAppHeader
              eyebrow="Workspace"
              title="My Revit Viewer"
              actions={
                <>
                  <Badge variant="neutral">Koustav Dhar</Badge>
                  <Button href="/login" variant="secondary" size="sm">
                    Login
                  </Button>
                </>
              }
            />
            <EnterpriseAppMain>{children}</EnterpriseAppMain>
          </EnterpriseMainColumn>
        </EnterpriseAppShell>
      </body>
    </html>
  );
}
