import axios from "axios";

export const publicFetch = axios.create({
  baseURL: `${
    process.env.NEXT_PUBLIC_BASE_URL
  }/api/aladdin/public`,
  withCredentials: true, // Ensures cookies are sent
});
