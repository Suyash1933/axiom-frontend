import Navbar from "./components/Navbar";
import "./globals.css";
import SubNavbar from "./components/SubNavbar";
import Footer from "./components/Footer";
import TriplePairs from "./components/TriplePairs";

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        {/* ⭐ Font Awesome CDN */}
        <link
          rel="stylesheet"
          href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.0/css/all.min.css"
        />
      </head>

      <body className="bg-black">
        <Navbar />
        <SubNavbar />
        <TriplePairs />
        {children}
         <Footer />
      </body>
    </html>
  );
}
