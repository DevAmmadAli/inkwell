import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Toaster } from "@/components/ui/sonner";
import { CurrentAuthorProvider } from "@/shared/hooks/use-current-author";
import "./globals.css";

const inter = Inter({
  variable: "--font-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "InkWell",
  description: "A collaborative note-taking workspace",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${inter.variable} h-full antialiased dark`}
    >
      <body className="h-full overflow-hidden">
        <CurrentAuthorProvider>
          {children}
          <Toaster />
        </CurrentAuthorProvider>
      </body>
    </html>
  );
}
