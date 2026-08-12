import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import { metadata as seoMetadata, jsonLd } from "@/lib/seo";
import "./globals.css";

/**
 * Inter is self-hosted rather than pulled from Google Fonts: one less
 * third-party request, no render-blocking stylesheet, nothing leaked to
 * a CDN on page load.
 */
const inter = localFont({
  src: [
    { path: "../public/fonts/Inter-Regular.woff2",  weight: "400", style: "normal" },
    { path: "../public/fonts/Inter-Medium.woff2",   weight: "500", style: "normal" },
    { path: "../public/fonts/Inter-SemiBold.woff2", weight: "600", style: "normal" },
    { path: "../public/fonts/Inter-Bold.woff2",     weight: "700", style: "normal" },
  ],
  variable: "--font-inter",
  display: "swap",
  fallback: ["system-ui", "-apple-system", "sans-serif"],
});

export const metadata: Metadata = seoMetadata;

export const viewport: Viewport = {
  themeColor: "#FAFAF9",
  colorScheme: "light",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en-IN" className={inter.variable}>
      <body>
        {children}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </body>
    </html>
  );
}
