"use client";

import { useEffect, useState } from "react";
import CardNav from "../components/CardNav";

export default function LayoutClient({ categories, children }) {

   const [user_info, setUserInfo] = useState(null);
   
   useEffect(() => {
     const fetchUserInfo = async () => {
       try {
         const response = await publicFetch("/user/info");
         setUserInfo(response.data.data || null);
         console.log(response.data.data);
       } catch (error) {
         console.error("Error fetching user info:", error);
       }
     }
      fetchUserInfo();
    }, []);


  return (
    <div className="relative w-full flex flex-col items-center font-michroma justify-center hide-scrollbar">
      <div className="sticky top-0 w-[90%] max-w-[800px] z-[99]">
        <CardNav user_info={user_info} categories={categories} />
      </div>
      <main className="w-full">{children}</main>
    </div>
  );
}
