// src/app/layout.tsx
import React from "react";
import Navbar from "./components/Navbar";
import "./globals.css";
import SubNavbar from "./components/SubNavbar";
import TriplePairs from "./components/TriplePairs";
import Footer from "./components/Footer";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        {/* Font Awesome CDN (you already used this) */}
        <link
          rel="stylesheet"
          href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.0/css/all.min.css"
        />
      </head>

      {/* add bottom padding so fixed footer doesn't overlap content */}
      <body className="bg-black pb-16 text-white">
        <Navbar />
<SubNavbar />

{/* main content area — no blank scrolling */}
<div className="flex-1 overflow-hidden h-[calc(100vh-160px)]">
  <TriplePairs />
  {children}
</div>

<Footer />

      </body>
    </html>
  );
}
