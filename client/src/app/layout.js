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

export const metadata = {
  title: {
    default: "CareConnect | India's Premium Healthcare Network & SOS Dispatch",
    template: "%s | CareConnect Healthcare SaaS"
  },
  description: "Experience world-class medical care from the comfort of your home. CareConnect offers instant video consultations, top-rated specialist home visits, digital EHR vaults, and intelligent SOS emergency dispatches.",
  keywords: ["Healthcare SaaS", "Online Doctor Consultation", "Emergency SOS Medical", "Home Doctor Visits", "Digital Prescriptions", "EHR Vault", "India Healthcare Network", "Premium Telemedicine", "Doctor Appointment Booking"],
  authors: [{ name: "CareConnect Team" }],
  creator: "CareConnect",
  publisher: "CareConnect Medical Services",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    title: "CareConnect | India's #1 Premium Healthcare Network",
    description: "Instantly book top-rated specialists, arrange emergency dispatches, and consult via HD video. Your health in the palm of your hand.",
    url: 'https://careconnect.health',
    siteName: 'CareConnect',
    images: [
      {
        url: '/images/hero-clinic.jpg',
        width: 1200,
        height: 630,
        alt: 'CareConnect Luxurious Clinic',
      },
    ],
    locale: 'en_IN',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: "CareConnect | Advanced Medical Network",
    description: "Book home visits, video consults, and access intelligent SOS dispatch.",
    images: ['/images/hero-clinic.jpg'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
};

import StoreProvider from "@/store/StoreProvider";

export default function RootLayout({ children }) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <StoreProvider>{children}</StoreProvider>
      </body>
    </html>
  );
}
