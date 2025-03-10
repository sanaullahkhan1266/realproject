import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";

const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  weight: ["100","200","300","400","500","600","700","800","900"],
});



export const metadata: Metadata = {
  title: "Real-far",
  description: "Real-far is a real-time collaborative platform for remote teams to work together on projects.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={` ${poppins.variable} antialiased`}
      >
        {children}
        <Toaster/>
      </body>
    </html>
  );
}
