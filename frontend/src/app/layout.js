import { Geist, Geist_Mono,Poppins } from "next/font/google";
import "./globals.css";
import MainLayout from "@/layout/MainLayout";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});
const PoppinsFont= Poppins({
  variable:'--font-poppins',
  subsets: ["latin"],
  weight:'400'

})

export const metadata = {
  title: "SBI Payment Gateway - Professional Banking Solution",
  description: "Secure banking application with digital payment solutions, UPI transfers, and account management",
  other: {
    'format-detection': 'telephone=no',
    'apple-mobile-web-app-capable': 'yes',
    'apple-mobile-web-app-status-bar-style': 'default',
    'apple-mobile-web-app-title': 'SBI Banking',
    'mobile-web-app-capable': 'yes',
    'msapplication-TileColor': '#3b82f6',
    'theme-color': '#3b82f6',
    'robots': 'noindex, nofollow', // Prevents search engine indexing which can reduce Reader Mode triggers
  }
};

export const viewport = {
  width: 'device-width',
  initialScale: 1.0,
  maximumScale: 1.0,
  userScalable: false,
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`  ${PoppinsFont.variable}   `}
        suppressHydrationWarning
      >
        <MainLayout>

        {children}
        </MainLayout>
      </body>
    </html>
  );
}
