import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import localFont from "next/font/local";
import "./globals.css";

const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

const akira = localFont({
  src: "./fonts/akira-expanded-demo.otf",
  variable: "--font-akira",
  weight: "800",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Ratih Creative",
  description: "Ratih Creative — identitas kreatif dalam gerak.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="id"
      className={`${poppins.variable} ${akira.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
