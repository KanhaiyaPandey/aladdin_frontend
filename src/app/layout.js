import { getCategories, getUserInfo } from "../lib/loaders";
import LayoutClient from "./LayoutClient";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export default async function RootLayout({ children }) {
  // Server-side data fetching for categories
  const categories = await getCategories();
  const user_info = await getUserInfo(); 

  console.log("user info", user_info);
  
  

  return (
    <html lang="en">
      <body className={inter.className}>
        <LayoutClient user_info={user_info} categories={categories}>{children}</LayoutClient>
      </body>
    </html>
  );
}
