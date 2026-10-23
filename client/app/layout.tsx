import "./globals.css";
import type { Metadata } from "next";
import { Toaster } from "react-hot-toast";

export const metadata: Metadata = {
  title: "Type Kanji",
  description: "Learn to read kanji by typing Japanese sentences",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode; }>) {
  return (
    <html lang="en" className="h-full">
      <body className="bg-main-gray flex flex-col min-h-screen">
        <main className="flex-grow">{children}</main>
        <Toaster position="top-center" />
      </body>
    </html>
  );
}
