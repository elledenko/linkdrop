import type { Metadata } from "next";
import { Toaster } from "sonner";
import "./globals.css";

export const metadata: Metadata = {
  title: "LinkDrop — Your daily finds, in your voice",
  description:
    "Paste links throughout the day. AI summarizes each one. Get a newsletter-style daily digest written in your voice.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="min-h-full flex flex-col">
        {children}
        <Toaster
          position="bottom-right"
          toastOptions={{
            style: {
              background: "#FFF8F0",
              border: "1px solid #E8DDD0",
              color: "#2D2319",
            },
          }}
        />
      </body>
    </html>
  );
}
