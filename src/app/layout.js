import { Inter } from "next/font/google";
import "./globals.css";
import LayoutClient from "./LayoutClient";
import { getCategories } from "../lib/loaders";

const inter = Inter({ subsets: ["latin"] });

export default async function RootLayout({ children }) {
  // Server-side fetch
  const categories = await getCategories();

  return (
    <html lang="en">
      <body className={inter.className}>
        <LayoutClient categories={categories}>{children}</LayoutClient>
      </body>
    </html>
  );
}