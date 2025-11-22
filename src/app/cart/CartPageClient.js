'use client'

import { useUser } from "@/context/UserContext"


const CartPageClient = () => {
    const {user_info, setUserInfo} = useUser();
  return (
    <div className=" grid md:grid-cols-3 grid-cols-1 items-center justify-center w-full ">
        
    </div>
  )
}

export default CartPageClient