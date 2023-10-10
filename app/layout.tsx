import { GlobalContextProvider } from "@/context/store";
import "./globals.css";
import type { Metadata } from "next";
import { Inter } from "next/font/google";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Todos Application",
  description: "CRUD APIs & Firestore Sync",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <GlobalContextProvider>
          <main className="flex min-h-screen flex-col items-center justify-between p-24">
            <div className="z-10 max-w-2xl w-full items-center justify-center gap-6 font-mono text-sm lg:flex">
              {children}
            </div>
          </main>
        </GlobalContextProvider>
      </body>
    </html>
  );
}
