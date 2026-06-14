import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "BCG Casey Simulator",
  description:
    "A timed, one-way simulator for the BCG Casey online case assessment, graded by an AI ex-BCG interviewer.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-ink-900 font-sans text-gray-100 antialiased">
        {children}
      </body>
    </html>
  );
}
