import axios from 'axios';


export const publicFetch = axios.create({
    baseURL: `${import.meta.env.VITE_BASE_URL}/api/aladdin/public`,
    withCredentials: true, // Ensures cookies are sent
});