"use client";

import { useEffect, useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { authFetch, customerFetch } from "@/utils/helpers";
import LoadingScreen from "@/components/LoadingScreen";
import { useUser } from "@/context/UserContext";

/**
 * OAuth Callback Component (uses useSearchParams)
 */
function OAuthCallbackContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const userContext = useUser();
  const [status, setStatus] = useState("processing");

  useEffect(() => {
    const handleOAuthCallback = async () => {
      try {
        // Validate token and get user data
        const response = await authFetch.get("/validate-token");
        const userData = response?.data?.data || null;

        if (userData) {
          // Store user data in localStorage
          if (typeof window !== "undefined") {
            localStorage.setItem("user_data", JSON.stringify(userData));
          }
          
          // Update context
          if (userContext?.setUserInfo && userContext?.setCart) {
            userContext.setUserInfo(userData);
            userContext.setCart(userData.cartItems || []);
          }

          // Get redirect path from URL params or default to home
          const redirectTo = searchParams.get("redirectTo") || "/";
          setStatus("success");
          
          // Redirect after a short delay to show success state
          // Use window.location for a full page reload to ensure context is refreshed
          setTimeout(() => {
            window.location.href = redirectTo;
          }, 500);
        } else {
          throw new Error("No user data received");
        }
      } catch (error) {
        console.error("OAuth callback error:", error);
        setStatus("error");
        
        // Redirect to login page after error
        setTimeout(() => {
          router.push("/auth/login?error=authentication_failed");
        }, 2000);
      }
    };

    handleOAuthCallback();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (status === "processing") {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <LoadingScreen />
        <div className="absolute bottom-20 text-center">
          <p className="text-gray-600">Completing authentication...</p>
        </div>
      </div>
    );
  }

  if (status === "success") {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="mb-4">
            <svg
              className="mx-auto h-12 w-12 text-green-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 13l4 4L19 7"
              />
            </svg>
          </div>
          <p className="text-gray-600">Authentication successful! Redirecting...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-center">
        <div className="mb-4">
          <svg
            className="mx-auto h-12 w-12 text-red-500"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </div>
        <p className="text-gray-600">Authentication failed. Redirecting to login...</p>
      </div>
    </div>
  );
}

/**
 * OAuth Callback Page
 * Handles OAuth redirect from Google and fetches user data
 * Wrapped in Suspense for useSearchParams
 */
export default function OAuthCallback() {
  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center min-h-screen">
          <LoadingScreen />
          <div className="absolute bottom-20 text-center">
            <p className="text-gray-600">Loading...</p>
          </div>
        </div>
      }
    >
      <OAuthCallbackContent />
    </Suspense>
  );
}

