'use client'

import CartItmes from "@/components/cart/CartItems";
import CheckoutOptions from "@/components/cart/CheckoutOptions";
import { useUser } from "@/context/UserContext"


const CartPageClient = () => {
    const {user_info, setUserInfo} = useUser();
  return (
    <div className=" flex items-start justify-center w-11/12 text-black relative">
         <CartItmes/>
         <CheckoutOptions/>
    </div>
  )
}

export default CartPageClient