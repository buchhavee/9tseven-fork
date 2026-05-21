import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import { JetBrains_Mono } from "next/font/google";
import "./globals.css";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import NewsletterPopup from "./components/NewsletterPopup";
import SmoothScroll from "./components/SmoothScroll";
import LoadScreen from "./components/LoadScreen";
import { CartProvider } from "./context/CartContext";

const PRE_HYDRATION_SCRIPT = `try{if(sessionStorage.getItem('loadScreenSeen'))document.documentElement.setAttribute('data-load-seen','1');}catch(e){}`;

const TYPEKIT_LOAD_SCRIPT = `(function(){var l=document.createElement('link');l.rel='stylesheet';l.href='https://use.typekit.net/srx3ckv.css';document.head.appendChild(l);})();`;

const openSauceOne = localFont({
  variable: "--font-open-sauce-one",
  display: "swap",
  src: [
    { path: "../public/fonts/OpenSauceOne-Light.woff2", weight: "300", style: "normal" },
    { path: "../public/fonts/OpenSauceOne-Regular.woff2", weight: "400", style: "normal" },
    { path: "../public/fonts/OpenSauceOne-Medium.woff2", weight: "500", style: "normal" },
    { path: "../public/fonts/OpenSauceOne-SemiBold.woff2", weight: "600", style: "normal" },
    { path: "../public/fonts/OpenSauceOne-Bold.woff2", weight: "700", style: "normal" },
    { path: "../public/fonts/OpenSauceOne-ExtraBold.woff2", weight: "800", style: "normal" },
    { path: "../public/fonts/OpenSauceOne-Black.woff2", weight: "900", style: "normal" },
  ],
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://9tseven.com"),
  title: {
    default: "9TSEVEN — More than running",
    template: "%s — 9TSEVEN",
  },
  description:
    "9TSEVEN is a running brand and community. Technical running apparel and accessories for runners who live the lifestyle.",
  applicationName: "9TSEVEN",
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    siteName: "9TSEVEN",
    locale: "en_US",
    url: "https://9tseven.com",
    title: "9TSEVEN — More than running",
    description:
      "Running apparel and community for runners who live the lifestyle.",
    images: [
      { url: "/images/OG/OG.jpg", width: 1200, height: 630, alt: "9TSEVEN" },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "9TSEVEN — More than running",
    description:
      "Running apparel and community for runners who live the lifestyle.",
    images: ["/images/OG/OG.jpg"],
  },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  viewportFit: "cover",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${openSauceOne.variable} ${jetbrainsMono.variable} h-full antialiased`} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: PRE_HYDRATION_SCRIPT }} />
        <link rel="preconnect" href="https://use.typekit.net" crossOrigin="" />
        <link rel="preconnect" href="https://p.typekit.net" crossOrigin="" />
        <script dangerouslySetInnerHTML={{ __html: TYPEKIT_LOAD_SCRIPT }} />
        <noscript>
          <link rel="stylesheet" href="https://use.typekit.net/srx3ckv.css" />
        </noscript>
      </head>
      <body className="min-h-full flex flex-col">
        <LoadScreen />
        <SmoothScroll>
          <CartProvider>
            <NewsletterPopup />
            <Navbar />
            {children}
            <Footer />
          </CartProvider>
        </SmoothScroll>
      </body>
    </html>
  );
}
