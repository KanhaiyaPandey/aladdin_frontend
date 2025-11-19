"use client";

import { useEffect, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import CardNav from "../components/CardNav";
import { authFetch } from "@/utils/helpers";
import LoadingScreen from "@/components/LoadingScreen";
import NProgress from "nprogress";
import Footer from "@/components/Footer";
import { UserContext } from "@/context/UserContext";
import CartDrawer from "@/components/cart/CartDrawer";

NProgress.configure({ showSpinner: false });

export default function LayoutClient({ categories, children }) {
  const [user_info, setUserInfo] = useState(null);
  const [loading, setLoading] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [showLoadingScreen, setShowLoadingScreen] = useState(false);
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    const fetchUserInfo = async () => {
      setLoading(true);
      try {
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

  useEffect(() => {
    if (isPending) {
      NProgress.start();
      setShowLoadingScreen(true);
    } else {
      NProgress.done();
      setShowLoadingScreen(false);
    }
  }, [isPending]);

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
    <UserContext.Provider value={{ user_info, setUserInfo, loading, drawerOpen, setDrawerOpen }}>
      <div className="relative w-full min-h-screen flex flex-col font-michroma">
        {showLoadingScreen && <LoadingScreen />}
        <div className="sticky top-0 w-full z-50">
          <div className="flex justify-center">
            <div className="w-[90%] max-w-[800px]">
              <CardNav
                user_info={user_info}
                loading={loading}
                categories={categories}
              />
            </div>
          </div>
        </div>
        <main className="w-full flex-1">{children}</main>
        <Footer />
        <CartDrawer />
      </div>
    </UserContext.Provider>
  );
}
