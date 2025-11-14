"use client";

import { useEffect, useState } from "react";
import CardNav from "../components/CardNav";
import { authFetch } from "@/utils/helpers";

export default function LayoutClient({ categories, children }) {
  const [user_info, setUserInfo] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchUserInfo = async () => {
      setLoading(true);
      try {
        const cached = localStorage.getItem("user_info");
        if (cached) {
          setUserInfo(JSON.parse(cached));
          return
        }
        const response = await authFetch.get("/validate-token");
        const userData = response?.data?.data || null;
        setUserInfo(userData);
        if (userData) {
          localStorage.setItem("user_info", JSON.stringify(userData));
        } else {
          localStorage.removeItem("user_info");
        }
      } catch (error) {
        console.error("Error fetching user info:", error);
        setUserInfo(null);
        localStorage.removeItem("user_info");
      } finally {
        setLoading(false);
      }
    };

    fetchUserInfo();
  }, []);

  return (
    <div className="relative w-full flex flex-col items-center font-michroma justify-center hide-scrollbar">
      <div className="sticky top-0 w-[90%] max-w-[800px] z-[99]">
        <CardNav user_info={user_info} loading={loading} categories={categories} />
      </div>
      <main className="w-full">
        {children}
      </main>
    </div>
  );
}
