"use client";

import UserInfo from "@/components/account/UserInfo";
import { useUser } from "@/context/UserContext";
import { motion, useScroll, useTransform } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { FastAverageColor } from "fast-average-color";

const AccountPageClient = () => {
  const containerRef = useRef(null);
  const { user_info, loading, setUserInfo } = useUser();
  const [user, setUser] = useState();
  const [dominantColor, setDominantColor] = useState("#000000");

  useEffect(() => {
    if (user_info?.profilePicture) {
      setUser(user_info);
    }
  }, [user_info]);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"],
  });

  const scale = useTransform(scrollYProgress, [0, 1], [1, 1.4]);
  const opacity = useTransform(scrollYProgress, [1, 1], [1, 0.3]);

  return (
    <div
      ref={containerRef}
      className="relative w-full bg-black flex flex-col items-center hide-scrollbar"
    >
      <div className="sticky top-0 flex items-start justify-center w-full overflow-hidden">
        <motion.h1
          style={{ scale, opacity }}
          className="text-[5rem] sm:text-[8rem] md:text-[12rem] lg:text-[15rem] xl:text-[18rem] font-bold text-slate-200 leading-none"
        >
          PROFILE
        </motion.h1>
      </div>
      <UserInfo user={user} setUser={setUser} setUserInfo={setUserInfo} dominantColor={dominantColor} setDominantColor={setDominantColor} />
    </div>
  );
};

export default AccountPageClient;
