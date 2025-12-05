import { useUser } from "@/context/UserContext"
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import CheckoutModal from "../checkout/CheckoutModal";


const CheckoutOptions = () => {

  const {user_info, setUserInfo, cart, setCart} = useUser();
  const [open, setOpen] = useState(false);
  const [subTotal, setSubTotal] = useState("");
  const router = useRouter();

    useEffect(() => {
      if (!cart) return;
      const total = cart.reduce((acc, item) => {
        return acc + Number(item.price) * Number(item.quantity);
      }, 0);
      setSubTotal(total);
    }, [cart]);


    const handleCheckout = () => {
         if(!user_info){
            router.push("/auth/login?redirectTo=/cart");
            return;
         }else{
            setOpen(true);
         }   
    }

  return (
    <div className=" w-4/12 flex justify-center p-10">

      <div className="w-full p-6 border border-gray-400 font-slussen font-light">

        {/* Title */}
        <h2 className=" font-semibold tracking-wide">ORDER SUMMARY</h2>
        <div className="w-full h-px bg-gray-200 my-4"></div>

        {/* Summary rows */}
        <div className="space-y-4 text-sm">

          <div className="flex justify-between">
            <span>Subtotal</span>
            <span className="">
                ₹
                {Number(subTotal).toLocaleString("en-IN", {
                  minimumFractionDigits: 2,
                })}
            </span>
          </div>

          <div className="flex justify-between">
            <span>Shipping</span>
            <span className="text-gray-400">Free (Premium Express) ▾</span>
          </div>

          <div className="flex justify-between">
            <span>Estimated Tax</span>
            <button className="underline">Calculate</button>
          </div>

          <div className="flex justify-between pt-2">
            <span className="font-medium">Estimated Total</span>
            <span className="text-lg font-semibold">
                   ₹
                {Number(subTotal).toLocaleString("en-IN", {
                  minimumFractionDigits: 2,
                })}
            </span>
          </div>

        </div>

        {/* View details */}
        <div className="mt-8">
          <div className="flex justify-between items-center cursor-pointer">
            <span className="text-sm font-semibold tracking-wide">
              VIEW DETAILS
            </span>
            <span className="text-xl">＋</span>
          </div>

          <p className="text-xs text-gray-600 mt-4 leading-5">
            You will be charged at the time of shipment. If this is a personalized or
            made-to-order purchase, you will be charged at the time of purchase.
          </p>
        </div>

        {/* Checkout button */}
        <button onClick={handleCheckout} disabled={cart.length === 0} className="w-full bg-black text-white py-3 mt-8 rounded-sm tracking-widest text-xs">
          CHECKOUT
        </button>

        <CheckoutModal open={open} setOpen={setOpen}/>

    </div>

  </div>
  )
}

export default CheckoutOptions