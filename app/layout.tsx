import type { Metadata } from "next";
import "./globals.css";
import { Navigation } from "@/components/Navigation";
import { AuthProvider } from "@/components/AuthProvider";

export const metadata: Metadata = {
  title: "Monster Tamers",
  description: "A playable monster collection and battle game",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>
        <AuthProvider>
          <Navigation />
          <main className="pb-12 pt-8">{children}</main>
        </AuthProvider>
      </body>
    </html>
  );
}
