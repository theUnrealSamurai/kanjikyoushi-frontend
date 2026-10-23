import "./globals.css";
import type { Metadata } from "next";
import { Inter, Noto_Sans_JP } from "next/font/google";
import { Toaster } from "react-hot-toast";

const sans = Inter({ subsets: ["latin"], variable: "--font-sans", display: "swap" });
// Noto Sans JP is served in unicode-range slices, so only the glyphs a page uses are downloaded.
const jp = Noto_Sans_JP({
  subsets: ["latin"],
  weight: ["400", "500", "700"],
  variable: "--font-jp",
  display: "swap",
  preload: false,
});

export const metadata: Metadata = {
  title: "Type Kanji",
  description: "Learn to read kanji by typing Japanese sentences",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`h-full ${sans.variable} ${jp.variable}`}>
      <body className="flex min-h-screen flex-col">
        <main className="flex-grow">{children}</main>
        <Toaster
          position="top-center"
          toastOptions={{ className: "!border !border-border !bg-surface-raised !text-text" }}
        />
      </body>
    </html>
  );
}
