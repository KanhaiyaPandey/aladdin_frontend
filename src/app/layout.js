"use client";

import { createContext, use, useContext, useEffect, useState } from "react";
import CardNav from "../components/CardNav";
import { authFetch } from "../utils/helpers";
import { getCategories } from "../lib/loaders";
import LayoutClient from "./LayoutClient";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

const UserContext = createContext(null);

export function useUser() {
  return useContext(UserContext);
}

export default async function RootLayout({ children }) {
  // Server-side data fetching for categories
  const categories = await getCategories();

  const [userInfo, setUserInfo] = useState(null);
  const [loading, setLoading] = useState(!userInfo);

  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        const response = await authFetch.get("/user/info");
        setUserInfo(response?.data?.data || null);
      } catch (error) {
        console.error("Failed to fetch user info:", error);
        setUserInfo(null);
      } finally {
        setLoading(false);
      }
    };
    fetchUserInfo();
  }, []);

  return (
    <html lang="en">
      <body className={inter.className}>
        <UserContext.Provider value={{ user_info: userInfo, loading }}>
          <LayoutClient user_info={userInfo} categories={categories}>
            <div className="relative w-full flex flex-col items-center font-michroma justify-center hide-scrollbar">
              <div className="sticky top-0 w-[90%] max-w-[800px] z-[99]">
                <CardNav user_info={userInfo} categories={categories} />
              </div>
              <main className="w-full">
                {loading ? <div>Loading...</div> : children}
              </main>
            </div>
          </LayoutClient>
        </UserContext.Provider>
      </body>
    </html>
  );
}
