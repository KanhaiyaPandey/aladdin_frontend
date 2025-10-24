import axios from "axios";

export const publicFetch = axios.create({
  baseURL: `${
    process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"
  }/api/aladdin/public`,
  withCredentials: true, // Ensures cookies are sent
});
