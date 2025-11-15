"use client";

import { useEffect, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import CardNav from "../components/CardNav";
import { authFetch } from "@/utils/helpers";
import LoadingScreen from "@/components/LoadingScreen";
import NProgress from "nprogress";

NProgress.configure({ showSpinner: false });

export default function LayoutClient({ categories, children }) {
  const [user_info, setUserInfo] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showLoadingScreen, setShowLoadingScreen] = useState(false);
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    const fetchUserInfo = async () => {
      setLoading(true);
      try {
        const cached = localStorage.getItem("user_info");
        if (cached) {
          setUserInfo(JSON.parse(cached));
          setLoading(false);
          return;
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

  // Show loading screen when isPending changes
  useEffect(() => {
    if (isPending) {
      NProgress.start();
      setShowLoadingScreen(true);
    } else {
      NProgress.done();
      setShowLoadingScreen(false);
    }
  }, [isPending]);

  // Intercept Link clicks and wrap in startTransition
  useEffect(() => {
    const handleClick = (e) => {
      const link = e.target.closest("a[href]");
      if (
        link &&
        link.href &&
        !link.target &&
        link.origin === window.location.origin
      ) {
        e.preventDefault();
        startTransition(() => {
          router.push(link.href);
        });
      }
    };

    window.addEventListener("click", handleClick);
    return () => window.removeEventListener("click", handleClick);
  }, [router]);

  return (
    <div className="relative w-full flex flex-col items-center font-michroma justify-center hide-scrollbar">
      {showLoadingScreen && <LoadingScreen />}
      <div className="sticky top-0 w-[90%] max-w-[800px] z-50">
        <CardNav
          user_info={user_info}
          loading={loading}
          categories={categories}
        />
      </div>
      <main className="w-full">{children}</main>
    </div>
  );
}
