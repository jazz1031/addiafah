import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Addiafah | الضيافة — Formation Hôtelière & Service Client | Algérie & Golfe",
  description: "Addiafah est la première entreprise de formation en service client, hôtellerie et audit qualité en Algérie, avec des programmes certifiés déployés en Arabie Saoudite, UAE, Qatar et Koweït.",
  keywords: "formation service client Algérie, hospitality training Algeria, تدريب خدمة العملاء الجزائر, formation hôtelière, staff outsourcing GCC, customer service training Dubai, الضيافة تدريب, mystery shopping Algeria, audit qualité service",
  openGraph: {
    title: "Addiafah | الضيافة — Excellence in Hospitality Training",
    description: "Certified customer service training, hospitality programs and service quality auditing across Algeria and the GCC.",
    url: "https://addiafah.com",
    siteName: "Addiafah",
    locale: "fr_DZ",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Addiafah | الضيافة",
    description: "Premium hospitality training and customer service excellence across Algeria and the GCC.",
  },
  alternates: {
    canonical: "https://addiafah.com",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Tajawal:wght@400;500;700&family=Playfair+Display:ital,wght@0,600;0,700;1,600&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
