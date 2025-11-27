import { useUser } from "@/context/UserContext";
import { message } from "antd";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { customerFetch } from "@/utils/helpers";
import { CiSquarePlus } from "react-icons/ci";
import { CiSquareMinus } from "react-icons/ci";
import {motion} from "framer-motion"



const CartItems = () => {
  const { user_info, setUserInfo, setCart, cart } = useUser();
  const [loadingIndex, setLoadingIndex] = useState(null);

  useEffect(() =>{
       console.log("cart: ", cart);
       
  },[cart])

  const updateCart = async (updatedCart) => {
    try {
      await customerFetch.put("/update-cart", updatedCart);
      const updatedUserInfo = { ...user_info, cartItems: updatedCart };
      if(!user_info) {
          localStorage.setItem("guest_cart",JSON.stringify(updatedCart))
      } 
      setCart(updatedCart);
      setUserInfo(updatedUserInfo);
    } catch (err) {
      message.error("Something went wrong updating the cart.");
    }
  };

  const handleRemoveItem = async (index) => {
    setLoadingIndex(index);
    const updatedCart = user_info.cartItems.filter((_, i) => i !== index);
    await updateCart(updatedCart);
    setLoadingIndex(null);
  };

  const increaseQty = async (index) => {
    setLoadingIndex(index);
    const updatedCart = [...user_info.cartItems];
    updatedCart[index].quantity += 1;
    await updateCart(updatedCart);
    setLoadingIndex(null);
  };

  const decreaseQty = async (index) => {
    if (user_info.cartItems[index].quantity <= 1) return;
    setLoadingIndex(index);
    const updatedCart = [...user_info.cartItems];
    updatedCart[index].quantity -= 1;
    await updateCart(updatedCart);
    setLoadingIndex(null);
  };

  return (
    <div className="w-8/12 flex items-center justify-center flex-col gap-4 py-4 font-slussen  border-gray-400 ">

       <div className=" w-full border-b flex items-center justify-between border-gray-400 py-1">
        <span className=" text-xs">Your Selections</span>
       </div>

      {cart.map((item, index) => (
        <div key={index} className="w-full p-3 flex gap-3 border-b border-gray-400">
          
          {/* IMAGE ONLY → CLICKABLE */}
          <Link
            href={`/product/${item?.productId}?variantid=${item?.variantId}`}
            className="shrink-0 flex items-center justify-center w-2/12"
          >
            <Image
              src={item?.image}
              alt={item?.name || "product image"}
              width={100}
              height={100}
              className="rounded-lg shadow-sm object-cover"
            />
          </Link>

          {/* TEXT + CONTROLS (NOT CLICKABLE) */}
          <div className="flex-1 flex flex-col gap-2 w-10/12">

           <div className=" w-full flex items-center justify-between">

            <span className="text-base font-medium max-md:text-sm">
              {item?.title}
            </span>
              <span className="text-sm font-semibold max-md:text-xs">
                ₹
                {Number(item.price).toLocaleString("en-IN", {
                  minimumFractionDigits: 2,
                })}
              </span>
           </div>
     

            <div className="text-xs flex flex-col gap-0.5">
              {item?.options?.map((option, idx) => (
                <span key={idx}>• {option}</span>
              ))}
            </div>

            <div className="flex justify-between items-center max-md:text-xs mt-1">
              
              {/* Quantity Buttons */}
              <div className="flex items-center gap-3">
                <button
                  disabled={loadingIndex === index || item.quantity <= 1}
                  onClick={() => decreaseQty(index)}
                  className=" text-xl disabled:opacity-50"
                >
                  <CiSquareMinus/>
                </button>

                <span className="font-medium">{item.quantity}</span>

                <button
                  disabled={loadingIndex === index}
                  onClick={() => increaseQty(index)}
                  className=" text-xl disabled:opacity-50"
                >
                   <CiSquarePlus/>
                </button>
              </div>
            </div>

            {/* REMOVE BUTTON */}

            <div className=" flex w-full items-center gap-5">
                  <motion.button
                    className="relative text-xs py-1 mt-2 font-light disabled:opacity-50"
                    onClick={() => handleRemoveItem(index)}
                    disabled={loadingIndex === index}
                    whileHover="hover"
                    initial="rest"
                    animate="rest"
                  >
                    {loadingIndex === index ? "Processing..." : "Remove Item"}

                    {/* underline */}
                    <motion.span
                      className="absolute left-0 bottom-0 h-[1px] w-full bg-gray-500"
                      variants={{
                        rest: { scaleX: 0, originX: 0 },
                        hover: { scaleX: 1, originX: 0 },
                      }}
                      transition={{ duration: 0.3 }}
                    />
              </motion.button>



              <motion.button
                    className="relative text-xs py-1 mt-2 font-light disabled:opacity-50"
                    whileHover="hover"
                    initial="rest"
                    animate="rest"
                  >
                  
                  Save for later

                    {/* underline */}
                    <motion.span
                      className="absolute left-0 bottom-0 h-[1px] w-full bg-gray-500"
                      variants={{
                        rest: { scaleX: 0, originX: 0 },
                        hover: { scaleX: 1, originX: 0 },
                      }}
                      transition={{ duration: 0.3 }}
                    />
              </motion.button>
            </div>

          </div>
        </div>
      ))}

      {cart.length === 0 && 
         <h1>No Items</h1>
       }
    </div>
  );
};

export default CartItems;
