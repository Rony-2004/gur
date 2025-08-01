import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "RBAC Configuration Tool",
  description: "Role-Based Access Control Configuration Tool",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
