import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Minchan Kim - AI & Software Engineer",
  description:
    "A concise one-page portfolio of AI systems, backend architecture, mobile products, and interactive product work by Minchan Kim.",
  openGraph: {
    title: "Minchan Kim - AI & Software Engineer",
    description:
      "Explore selected AI, backend, mobile, systems, awards, and engineering work by Minchan Kim.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="min-h-full">{children}</body>
    </html>
  );
}
