import { Toaster } from "@/components/Toaster";
import type React from "react";
import { BackButton } from "@/components/BackButton";
import { AuthProvider1 } from "@/providers/auth-provider";
import "./globals.css";
import { AuthProvider } from "@/lib/auth";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <AuthProvider1>
          <AuthProvider>
            <BackButton />
            {children}
            <Toaster />
          </AuthProvider>
        </AuthProvider1>
      </body>
    </html>
  );
}

export const metadata = {
  generator: "v0.dev",
};
