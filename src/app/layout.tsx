import type { Metadata } from "next";
import { Geist, Geist_Mono, Pixelify_Sans } from "next/font/google";
import Fx from "@/components/Fx";
import "./globals.css";

const sans = Geist({ subsets: ["latin"], variable: "--font-geist" });
const mono = Geist_Mono({ subsets: ["latin"], variable: "--font-geist-mono" });

const pixel = Pixelify_Sans({ subsets: ["latin"], variable: "--font-pixel" });

const description =
  "Minchan Kim is a Computer Engineering student at HKU and R&D Software Engineer Intern at WayMe, building production geospatial and real-time GPS systems.";

export const metadata: Metadata = {
  metadataBase: new URL("https://portfolio-xi-blond-87.vercel.app"),
  title: { default: "Minchan Kim · Software Engineer", template: "%s · Minchan Kim" },
  description,
  openGraph: { title: "Minchan Kim · Software Engineer", description, type: "website" },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${sans.variable} ${mono.variable} ${pixel.variable}`}>
      <body>
        {children}
        <Fx />
      </body>
    </html>
  );
}
