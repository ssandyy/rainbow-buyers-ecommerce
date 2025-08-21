import type { Metadata } from "next";
import { Assistant } from "next/font/google";
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
        {/* <body
        className={`${assistant.variable} ${geistSans.variable} ${geistMono.variable} antialiased`}
      > */}
        {children}
      </body>
    </html>
  );
}
