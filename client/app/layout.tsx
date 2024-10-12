import "./globals.css";
import type { Metadata } from "next";
import NavBar from "@/components/NavBar";

export const metadata: Metadata = {
  title: "Type Kanji",
  description: "Type to learn",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode; }>) {
  return (
    <html lang="en">
      <body className="bg-main-gray h-screen">
        <NavBar />
        <main>{children}</main>
      </body>
    </html>
  );
}
