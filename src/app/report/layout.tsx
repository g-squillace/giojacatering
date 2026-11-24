import type { Metadata } from "next";
import "@/styles/globals.css";
import { noIndexRobots } from "@/lib/seoUtils";

export const metadata: Metadata = {
  title: "Andamento del sito — GioJa Catering",
  robots: noIndexRobots,
};

export default function ReportLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="it" data-theme="custom">
      <body className="min-h-screen bg-secondary text-primary-content antialiased">
        {children}
      </body>
    </html>
  );
}
