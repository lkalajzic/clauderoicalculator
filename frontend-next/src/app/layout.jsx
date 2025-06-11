import { Geist_Mono } from "next/font/google";
import { DM_Sans, DM_Serif_Display, Cinzel } from "next/font/google";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import "./globals.css";

const dmSans = DM_Sans({
  variable: "--font-dm-sans",
  subsets: ["latin"],
  weight: ["400", "500", "700"],
});

const dmSerif = DM_Serif_Display({
  variable: "--font-dm-serif",
  subsets: ["latin"],
  weight: ["400"],
});

const cinzel = Cinzel({
  variable: "--font-cinzel",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "Claude ROI Calculator",
  description:
    "Find the best Claude implementation opportunities for your business",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="light">
      <body
        className={`${dmSans.variable} ${dmSerif.variable} ${cinzel.variable} ${geistMono.variable} font-sans antialiased bg-white min-h-screen flex flex-col overflow-x-hidden`}
      >
        {/* Disclaimer banner */}
        <div className="bg-gradient-to-r from-coral-50/50 via-white to-coral-50/50 border-b border-coral-100">
          <div className="px-4 py-2.5 text-center text-xs text-gray-600">
            This is an open source project by{" "}
            <a
              href="https://lukakalajzic.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-coral-600 hover:text-coral-700"
            >
              Luka Kalajžić.
            </a>{" "}
            This tool is not affiliated with Anthropic. The figures are just
            attempts at estimating the impact of AI.{" "}
            <a
              href="https://anthropic.com/enterprise"
              target="_blank"
              rel="noopener noreferrer"
              className="text-coral-600 hover:text-coral-700"
            >
              Contact Anthropic
            </a>{" "}
            for more accurate information.
          </div>
        </div>
        <Navbar />
        <main className="flex-grow">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
