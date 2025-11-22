import "./globals.css";
import LayoutClient from "./LayoutClient";
import { getCategories } from "../lib/loaders";
import { michroma, slussen } from "../font";



export default async function RootLayout({ children }) {
  // Server-side fetch
  const categories = await getCategories();

  return (
    <html lang="en">
      <body className={`${slussen.variable} ${michroma.variable}`}>
        <LayoutClient categories={categories}>{children}</LayoutClient>
      </body>
    </html>
  );
}