"use client";

import { createContext, useContext, useEffect, useState } from "react";
import CardNav from "../components/CardNav";
import { authFetch } from "../utils/helpers";
import { getCategories, getUserInfo } from "../lib/loaders";
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
  const user_info = await getUserInfo();

  console.log("user info", user_info);

  const [userInfo, setUserInfo] = useState(user_info);
  const [loading, setLoading] = useState(!user_info);

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

    if (!user_info) {
      fetchUserInfo();
    } else {
      setLoading(false);
    }
  }, [user_info]);

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
