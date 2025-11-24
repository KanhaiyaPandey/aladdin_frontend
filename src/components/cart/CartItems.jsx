import { useUser } from "@/context/UserContext";
import { message } from "antd";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { customerFetch } from "@/utils/helpers";
import { CiSquarePlus } from "react-icons/ci";
import { CiSquareMinus } from "react-icons/ci";



const CartItems = () => {
  const { user_info, setUserInfo } = useUser();
  const [loadingIndex, setLoadingIndex] = useState(null);

  const updateCart = async (updatedCart) => {
    try {
      await customerFetch.put("/update-cart", updatedCart);
      const updatedUserInfo = { ...user_info, cartItems: updatedCart };
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
    <div className="w-8/12 flex items-center justify-center flex-col gap-4 p-5 font-slussen border-b border-gray-400 ">

       <div className=" w-full border-b flex items-center justify-between border-gray-400 p-1">
        <span className=" text-xs">Your Selections</span>
       </div>

      {user_info?.cartItems?.map((item, index) => (
        <div key={index} className="w-full p-3 flex gap-3">
          
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
            <span className="text-base font-medium max-md:text-sm">
              {item?.title}
            </span>

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

              {/* Price */}
              <span className="text-sm font-semibold max-md:text-xs">
                ₹
                {Number(item.price).toLocaleString("en-IN", {
                  minimumFractionDigits: 2,
                })}
              </span>
            </div>

            {/* REMOVE BUTTON */}
            <button
              className="w-full border border-black bg-[#FF5555] text-xs p-2 mt-2 rounded-md flex justify-center items-center hover:bg-[#FF937E] transition-all duration-300 ease-in-out font-bold disabled:opacity-50"
              onClick={() => handleRemoveItem(index)}
              disabled={loadingIndex === index}
            >
              {loadingIndex === index ? "Processing..." : "Remove Item"}
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default CartItems;
