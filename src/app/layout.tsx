import type { Metadata } from "next";
import { Geist, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { Chrome } from "@/components/chrome/Chrome";

const geistSans = Geist({
  variable: "--font-geist",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin"],
  weight: ["400", "500"],
});

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://rennielab.com";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Rennie Lab — A Creative Advisory Studio",
    template: "%s · Rennie Lab",
  },
  description:
    "Rennie Lab is a creative advisory studio between Sydney and Los Angeles — clean creative for climate, community and movement.",
  applicationName: "Rennie Lab",
  authors: [{ name: "Rennie Lab", url: siteUrl }],
  keywords: [
    "creative advisory",
    "brand strategy",
    "climate design",
    "ux design",
    "Sydney",
    "Los Angeles",
    "Rennie Lab",
  ],
  openGraph: {
    type: "website",
    siteName: "Rennie Lab",
    title: "Rennie Lab — A Creative Advisory Studio",
    description:
      "Clean creative for climate, community and movement. Sydney + Los Angeles.",
    url: siteUrl,
  },
  twitter: {
    card: "summary_large_image",
    title: "Rennie Lab — A Creative Advisory Studio",
    description:
      "Clean creative for climate, community and movement. Sydney + Los Angeles.",
  },
};

const themeInitScript = `(function(){try{var t=localStorage.getItem('rl-theme');if(t!=='dark'&&t!=='light')t='dark';document.documentElement.setAttribute('data-theme',t);}catch(e){document.documentElement.setAttribute('data-theme','dark');}})();`;

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${geistSans.variable} ${jetbrainsMono.variable}`}>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeInitScript }} />
      </head>
      <body>
        <Chrome>
          <main>{children}</main>
        </Chrome>
      </body>
    </html>
  );
}
