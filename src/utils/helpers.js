import axios from "axios";

export const publicFetch = axios.create({
  baseURL: `${
    process.env.NEXT_PUBLIC_PRODUCTION_URL
  }/api/aladdin/public`,
  withCredentials: true, // Ensures cookies are sent
});


export const authFetch = axios.create({
    baseURL: `${process.env.NEXT_PUBLIC_PRODUCTION_URL}/api/auth/user`,
    withCredentials: true, // Ensures cookies are sent
});

export const customerFetch = axios.create({
    baseURL: `${process.env.NEXT_PUBLIC_PRODUCTION_URL}/api/aladdin/user`,
    withCredentials: true, // Ensures cookies are sent
});