'use client'

import { useEffect, useState } from "react";
import { publicFetch } from "../utils/helpers";
import CardNav from "../components/CardNav";
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export default function RootLayout({ children }) {
  const [categories, setCategories] = useState([]);

  const getCategories = async () => {
    try {
      const res = await publicFetch.get("/category/all-categories");
      setCategories(res?.data?.data || []);
    } catch (error) {
      console.error("Failed to fetch categories:", error);
    }
  };

  useEffect(() => {
    getCategories();
  }, []);

  return (
    <html lang="en">
      <body className={inter.className}>
        <div className="relative w-full flex flex-col items-center font-michroma justify-center">
          <div className="sticky top-0 w-[90%] max-w-[800px] z-[99]">
            <CardNav categories={categories} />
          </div>
          <main className="w-full">
            {children}
          </main>
        </div>
      </body>
    </html>
  )
}