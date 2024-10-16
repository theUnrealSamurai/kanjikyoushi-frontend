import "./globals.css";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Type Kanji",
  description: "Type to learn",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode; }>) {
  return (
    <html lang="en" className="h-full">
      <body className="bg-main-gray flex flex-col min-h-screen">
        <main className="flex-grow">{children}</main>
      </body>
    </html>
  );
}
