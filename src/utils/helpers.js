import axios from "axios";

const isProduction = process.env.NODE_ENV === "production";

const baseURL =
  process.env.NEXT_PUBLIC_BASE_URL ||
  (isProduction
    ? process.env.NEXT_PUBLIC_PRODUCTION_URL
    : "http://localhost:8080");

export const publicFetch = axios.create({
  baseURL: `${baseURL}/api/aladdin/public`,
  withCredentials: true,
});

export const authFetch = axios.create({
  baseURL: `${baseURL}/api/auth/user`,
  withCredentials: true,
});

export const gooogleOAuthFetch = isProduction
  ? process.env.NEXT_PUBLIC_PRODUCTION_OAUTH_REDIRECT_URI
  : process.env.NEXT_PUBLIC_DEV_OAUTH_REDIRECT_URI;
