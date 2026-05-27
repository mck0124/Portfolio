import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Minchan Kim - AI & Software Engineer",
  description:
    "A screen-based portfolio of AI systems, backend architecture, mobile products, and interactive experiments by Minchan Kim.",
  openGraph: {
    title: "Minchan Kim - AI & Software Engineer",
    description:
      "Explore AI, backend, mobile, systems, awards, and engineering work through a polished portfolio interface.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className="h-full antialiased"
    >
      <body className="min-h-full bg-[#090d0b] text-[#f5f7f2]">{children}</body>
    </html>
  );
}
