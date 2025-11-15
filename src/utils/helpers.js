import axios from "axios";

export const publicFetch = axios.create({
  baseURL: `${
    process.env.NEXT_PUBLIC_BASE_URL
  }/api/aladdin/public`,
  withCredentials: true, // Ensures cookies are sent
});


export const authFetch = axios.create({
    baseURL: `${process.env.NEXT_PUBLIC_BASE_URL}/api/auth/user`,
    withCredentials: true, // Ensures cookies are sent
});

export const gooogleOAuthFetch = `${process.env.DEV_OAUTH_REDIRECT_URI || process.env.PRODUCTION_OAUTH_REDIRECT_URI}`;