import type { Metadata } from "next";

import "./globals.css";
import { Toaster } from "@/components/ui/sonner"
import BetterAuthUIProvider from "@/providers/better-auth-ui-provider"

export const metadata: Metadata = {
  title: "Milestone Travels | Milestones to Memories",
  description: "Discover your next journey with Milestone Travels.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,600;0,700;1,300;1,400;1,600&family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;0,9..40,700;1,9..40,300&family=Open+Sans:ital,wght@0,300;0,400;0,500;0,600;0,700;1,400&family=Playfair+Display:ital,wght@0,700;0,900;1,700&display=swap" rel="stylesheet" />
      </head>
      <body className="antialiased">
        <BetterAuthUIProvider>{children}</BetterAuthUIProvider>
        <Toaster />
      </body>
    </html>
  );
}
