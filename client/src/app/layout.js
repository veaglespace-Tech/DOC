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
  metadataBase: new URL('https://doctoroncall.health'),
  title: {
    default: "Doctor On Call | India's Premium Healthcare Network & Appointments",
    template: "%s | Doctor On Call"
  },
  description: "Experience world-class medical care from the comfort of your home. Doctor On Call offers instant video consultations, top-rated specialist home visits, and secure digital EHR vaults.",
  keywords: ["Doctor On Call", "Healthcare SaaS", "Online Doctor Consultation", "Home Doctor Visits", "Digital Prescriptions", "EHR Vault", "India Healthcare Network", "Premium Telemedicine", "Doctor Appointment Booking"],
  authors: [{ name: "Doctor On Call Team" }],
  creator: "Doctor On Call",
  publisher: "Doctor On Call Medical Services",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    title: "Doctor On Call | India's #1 Premium Healthcare Network",
    description: "Instantly book top-rated specialists, arrange doctor visits, and consult via HD video. Your health in the palm of your hand.",
    url: 'https://doctoroncall.health',
    siteName: 'Doctor On Call',
    images: [
      {
        url: '/images/hero-clinic.jpg',
        width: 1200,
        height: 630,
        alt: 'Doctor On Call Premium Healthcare',
      },
    ],
    locale: 'en_IN',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: "Doctor On Call | Advanced Medical Network",
    description: "Book home visits, video consults, and access top healthcare specialists.",
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
