import type { Metadata } from "next";

export const SITE = {
  url: "https://kemist.in",
  name: "Kemist",
  email: "admin@kemist.in",
  title: "Kemist — Offline-First Billing & Inventory Software for Pharmacies",
  tagline: "Offline-first billing software for retail pharmacies.",
  description:
    "Kemist is fast, offline-first billing and inventory software for retail pharmacies and medical shops — keystroke search across brand, salt, pack and rack, batch-wise stock and expiry, GST and drug registers, and scheduled encrypted backups with quick restore.",
  socialDescription:
    "Keystroke search across brand, salt, pack and rack. Batch-wise stock. Backups on your schedule. Runs inside the shop, online or not.",
} as const;

const KEYWORDS = [
  "pharmacy software", "pharmacy billing software", "medical shop software",
  "medical shop billing software", "chemist software", "retail pharmacy software",
  "pharmacy ERP", "pharmacy POS software", "offline billing software",
  "offline pharmacy software", "fast pharmacy billing", "medicine search by salt",
  "molecule search pharmacy software", "GST billing software for pharmacy",
  "pharmacy inventory software", "drug inventory management software",
  "batch and expiry management software", "expiry tracking software",
  "MRP and discount billing", "drug register software",
  "multi terminal pharmacy billing", "multi store pharmacy software",
  "pharmacy chain software", "pharmacy accounting software",
  "pharmacy software India", "medical store software",
  "pharmacy software with auto backup", "pharmacy data backup and restore",
  "batch wise stock software", "rack location inventory",
  "pack and strip billing software", "fast medicine search software",
  "zero delay billing",
];

export const metadata: Metadata = {
  metadataBase: new URL(SITE.url),
  title: SITE.title,
  description: SITE.description,
  keywords: KEYWORDS,
  applicationName: SITE.name,
  authors: [{ name: SITE.name, url: SITE.url }],
  creator: SITE.name,
  publisher: SITE.name,
  manifest: "/manifest.webmanifest",
  alternates: {
    canonical: "/",
    languages: { "en-IN": "/", "x-default": "/" },
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-snippet": -1,
      "max-image-preview": "large",
      "max-video-preview": -1,
    },
  },
  openGraph: {
    type: "website",
    siteName: SITE.name,
    locale: "en_IN",
    url: SITE.url,
    title: SITE.title,
    description: SITE.socialDescription,
    images: [{
      url: "/og.png",
      width: 1200,
      height: 630,
      alt: "Kemist — offline-first billing software for retail pharmacies",
    }],
  },
  twitter: {
    card: "summary_large_image",
    title: SITE.title,
    description: SITE.socialDescription,
    images: ["/og.png"],
  },
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "32x32" },
      { url: "/kemist-favicon.svg", type: "image/svg+xml" },
    ],
    apple: "/apple-touch-icon.png",
  },
  category: "business software",
};

/**
 * One @graph rather than separate blocks, so the entities can reference
 * each other by @id. featureList carries product depth the visible page
 * deliberately does not spell out.
 */
export const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Organization",
      "@id": `${SITE.url}/#organization`,
      name: SITE.name,
      alternateName: "Kemist Software",
      url: `${SITE.url}/`,
      email: SITE.email,
      slogan: SITE.tagline,
      description:
        "Kemist builds fast, offline-first billing, inventory and compliance software for retail pharmacies and medical shops.",
      logo: {
        "@type": "ImageObject",
        "@id": `${SITE.url}/#logo`,
        url: `${SITE.url}/icon-512.png`,
        width: 512,
        height: 512,
        caption: SITE.name,
      },
      image: { "@id": `${SITE.url}/#logo` },
      areaServed: { "@type": "Country", name: "India" },
      knowsAbout: [
        "retail pharmacy management",
        "pharmacy billing and point of sale",
        "medicine search by brand, molecule and manufacturer",
        "drug batch and expiry control",
        "MRP, selling rate and discount handling",
        "GST invoicing and returns",
        "statutory drug registers",
        "offline-first software architecture",
        "multi-terminal and multi-shop retail operations",
      ],
      contactPoint: [{
        "@type": "ContactPoint",
        contactType: "sales",
        email: SITE.email,
        availableLanguage: ["English"],
      }],
    },
    {
      "@type": "WebSite",
      "@id": `${SITE.url}/#website`,
      url: `${SITE.url}/`,
      name: SITE.name,
      description: "Fast, offline-first billing and inventory software for retail pharmacies.",
      publisher: { "@id": `${SITE.url}/#organization` },
      inLanguage: "en-IN",
    },
    {
      "@type": "WebPage",
      "@id": `${SITE.url}/#webpage`,
      url: `${SITE.url}/`,
      name: SITE.title,
      description: SITE.description,
      isPartOf: { "@id": `${SITE.url}/#website` },
      about: { "@id": `${SITE.url}/#software` },
      primaryImageOfPage: {
        "@type": "ImageObject",
        url: `${SITE.url}/og.png`,
        width: 1200,
        height: 630,
      },
      inLanguage: "en-IN",
    },
    {
      "@type": "SoftwareApplication",
      "@id": `${SITE.url}/#software`,
      name: SITE.name,
      url: `${SITE.url}/`,
      applicationCategory: "BusinessApplication",
      applicationSubCategory: "Pharmacy billing, inventory and compliance software",
      operatingSystem: "Windows, Linux; browser-based terminals over the shop's local network",
      description:
        "Kemist is retail pharmacy software that runs on a computer inside the shop. Billing continues without an internet connection, stock is tracked by batch and expiry, and GST returns and drug registers are produced from the shop's own records.",
      featureList: [
        "Medicine search across brand, molecule, strength, dosage form, pack, rack location and batch number",
        "Offline-first billing that continues during an internet outage",
        "Keyboard-first counter workflow with barcode scanner input",
        "Batch-wise stock with pack size, rack location, expiry and remaining shelf life",
        "Batch selection in first-expiry-first-out order with quantity control",
        "MRP, selling rate and discount handled per line",
        "Purchases, goods receipt, sale and purchase returns",
        "GST invoicing, credit and debit notes, and return workings",
        "Statutory drug registers",
        "Double-entry accounting, day book, ledgers and party outstanding",
        "Multiple billing terminals over the shop's own network",
        "Multi-shop account structure with scoped roles",
        "Encrypted local storage with scheduled encrypted off-site backup",
        "Point-in-time restore of data and configuration in a few steps",
        "Owner-controlled export of statutory records to PDF and Excel",
      ],
      softwareVersion: "Pre-release",
      releaseNotes: "Early access. The first 50 shops join the beta free.",
      publisher: { "@id": `${SITE.url}/#organization` },
      offers: {
        "@type": "Offer",
        availability: "https://schema.org/PreOrder",
        priceCurrency: "INR",
        price: "0",
        description: "Free beta access for the first 50 shops",
        seller: { "@id": `${SITE.url}/#organization` },
      },
      inLanguage: "en-IN",
    },
  ],
};
