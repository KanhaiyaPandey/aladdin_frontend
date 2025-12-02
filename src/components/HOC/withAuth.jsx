"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useUser } from "@/context/UserContext";
import LoadingScreen from "@/components/LoadingScreen";

/**
 * Higher-Order Component to protect routes that require authentication
 * @param {React.Component} Component - The component to protect
 * @param {Object} options - Options for the HOC
 * @param {boolean} options.redirectToLogin - Whether to redirect to login if not authenticated (default: true)
 * @param {string} options.redirectPath - Custom redirect path (default: '/auth/login')
 * @returns {React.Component} Protected component
 */
export default function withAuth(Component, options = {}) {
  const { redirectToLogin = true, redirectPath = "/auth/login" } = options;

  return function AuthenticatedComponent(props) {
    const { user_info, loading } = useUser();
    const router = useRouter();
    const [isChecking, setIsChecking] = useState(true);

    useEffect(() => {
      // Wait for initial auth check to complete
      if (!loading) {
        setIsChecking(false);
        
        // If user is not authenticated and redirect is enabled
        if (!user_info && redirectToLogin) {
          const currentPath = window.location.pathname;
          const searchParams = window.location.search;
          const fullPath = currentPath + searchParams;
          router.push(`${redirectPath}?redirectTo=${encodeURIComponent(fullPath)}`);
        }
      }
    }, [user_info, loading, redirectToLogin, redirectPath, router]);

    // Show loading while checking authentication
    if (loading || isChecking) {
      return <LoadingScreen />;
    }

    // If redirect is disabled, show component even if not authenticated
    // (useful for pages that show different content for authenticated/unauthenticated users)
    if (!user_info && !redirectToLogin) {
      return <Component {...props} />;
    }

    // If user is not authenticated and redirect is enabled, show nothing
    // (redirect will happen in useEffect)
    if (!user_info && redirectToLogin) {
      return <LoadingScreen />;
    }

    // User is authenticated, render the component
    return <Component {...props} />;
  };
}

