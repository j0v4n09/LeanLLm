import type { Metadata } from "next";

import "./globals.css";

export const metadata: Metadata = {
  title: "LeanLLM",
  description: "AI middleware dashboard layout for LeanLLM.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body>{children}</body>
    </html>
  );
}
