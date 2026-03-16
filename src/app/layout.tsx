import type { Metadata } from "next";
import "./globals.css";
import { AnalysisProvider } from "@/lib/AnalysisContext";

export const metadata: Metadata = {
  title: "Findesk AI — Smart Financial Intelligence Protocol",
  description: "AI-powered credit analysis with Five C framework, GST forensics, multi-agent debate, and automated CAM generation.",
  icons: { icon: "/logo.png" },
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
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&family=JetBrains+Mono:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="antialiased">
        <AnalysisProvider>{children}</AnalysisProvider>
      </body>
    </html>
  );
}
