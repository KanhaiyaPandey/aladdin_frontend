'use client'

import { motion, useScroll, useTransform } from 'framer-motion'
import { useRef } from 'react'

const AccountPageClient = () => {
  const containerRef = useRef(null)

  // Get scroll progress inside this container (0 to 1)
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"],
  })

  // Scale text as you scroll up
  // Adjust range: when scrollYProgress goes from 0 → 1, scale from 1 → 1.4
  const scale = useTransform(scrollYProgress, [0, 1], [1, 1.4])
  const opacity = useTransform(scrollYProgress, [1, 1], [1, 0.3])

  return (
<div ref={containerRef} className="relative w-full bg-black flex flex-col items-center hide-scrollbar"> 
  <div className="sticky top-0 flex items-start justify-center w-full overflow-hidden">
       <motion.h1
        style={{ scale, opacity }}
       className="text-[5rem] sm:text-[8rem] md:text-[12rem] lg:text-[15rem] xl:text-[18rem] font-bold text-slate-200 leading-none">PROFILE</motion.h1> 
  </div> 
  <div className="relative w-full h-screen bg-white rounded-t-3xl z-10">

  </div> 
</div>
  )
}

export default AccountPageClient
