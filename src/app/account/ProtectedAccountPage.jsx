"use client";

import AccountPageClient from "./AccountPageClient";
import withAuth from "@/components/HOC/withAuth";

// Protect the account page with authentication
const ProtectedAccountPage = withAuth(AccountPageClient, {
  redirectToLogin: true,
  redirectPath: "/auth/login",
});

export default ProtectedAccountPage;

