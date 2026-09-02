import type { Metadata } from "next";
import { Montserrat, Roboto, Fira_Code } from "next/font/google";
import "./globals.css";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import Chatbot from "@/components/Chatbot";
import { Providers } from "@/components/Providers";
import { siteConfig, siteUrl, buildJsonLd } from "@/lib/seo";

const montserrat = Montserrat({
  subsets: ["latin"],
  weight: ["400", "600", "700", "800", "900"],
  variable: "--font-montserrat",
  display: "swap",
});

const roboto = Roboto({
  subsets: ["latin"],
  weight: ["300", "400", "500"],
  variable: "--font-roboto",
  display: "swap",
});

const firaCode = Fira_Code({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-fira-code",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: `${siteConfig.name} - ${siteConfig.tagline}`,
    template: `%s | ${siteConfig.shortName}`,
  },
  description: siteConfig.description,
  keywords: siteConfig.keywords,
  metadataBase: new URL(siteUrl),
  alternates: {
    canonical: siteUrl,
  },
  openGraph: {
    title: siteConfig.name,
    description: siteConfig.description,
    url: siteUrl,
    siteName: siteConfig.name,
    images: [
      {
        url: siteConfig.logo,
        width: 1200,
        height: 630,
        alt: siteConfig.name,
      },
    ],
    locale: "en_KE",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: siteConfig.name,
    description: siteConfig.description,
    images: [siteConfig.logo],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  verification: {
    google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION || undefined,
  },
  icons: {
    icon: "/favicon.svg",
    shortcut: "/favicon.svg",
    apple: "/logo.jpeg",
    other: [
      { rel: "icon", url: "/favicon.svg", sizes: "any", type: "image/svg+xml" },
      { rel: "apple-touch-icon", url: "/logo.jpeg", sizes: "180x180" },
      { rel: "manifest", url: "/site.webmanifest" },
    ],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const organizationSchema = buildJsonLd("organization");
  const localBusinessSchema = buildJsonLd("localBusiness");
  const websiteSchema = buildJsonLd("website");

  return (
    <html lang="en" className={`${montserrat.variable} ${roboto.variable} ${firaCode.variable} antialiased`}>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify([organizationSchema, localBusinessSchema, websiteSchema]),
          }}
        />
      </head>
      <body className="min-h-screen flex flex-col">
        <Providers>
          <Navigation />
          <main className="flex-1">{children}</main>
          <Footer />
          <Chatbot />
        </Providers>
      </body>
    </html>
  );
}
