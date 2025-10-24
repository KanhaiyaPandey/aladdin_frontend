import { getCategories } from "../lib/loaders";
import LayoutClient from "./LayoutClient";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export default async function RootLayout({ children }) {
  // Server-side data fetching for categories
  const categories = await getCategories();

  return (
    <html lang="en">
      <body className={inter.className}>
        <LayoutClient categories={categories}>{children}</LayoutClient>
      </body>
    </html>
  );
}
