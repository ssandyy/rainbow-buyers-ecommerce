import GlobalProvider from "@/components/application/GlobalProvider";
import type { Metadata, Viewport } from "next";
import { Assistant } from "next/font/google";
import { ToastContainer } from "react-toastify";
import "./globals.css";

const assistant = Assistant({
  weight: ["300", "400", "500", "600", "700", "800"],
  subsets: ["latin"],
  display: "swap",
  // variable: "--font-assistant",
})

// const geistSans = Geist({
//   variable: "--font-geist-sans",
//   subsets: ["latin"],
// });

// const geistMono = Geist_Mono({
//   variable: "--font-geist-mono",
//   subsets: ["latin"],
// });

export const metadata: Metadata = {
  title: {
    default: "Rainbow Buyers",
    template: "%s | Rainbow Buyers",
  },
  description: "Every color make you smile",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  viewportFit: "cover",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${assistant.className}  antialiased`}
      >
        <GlobalProvider>
          <ToastContainer />
          {/* <NavbarWrapper /> */}
          {children}
        </GlobalProvider>
      </body>
    </html >
  );
}