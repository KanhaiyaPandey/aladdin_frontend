import { useUser } from "@/context/UserContext";
import { customerFetch } from "@/utils/helpers";
import { message } from "antd";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { IoMdClose } from "react-icons/io";

const CartDrawer = () => {
  const { drawerOpen, setDrawerOpen, user_info, setUserInfo } = useUser();
  const [loadingIndex, setLoadingIndex] = useState(null);
  const drawerRef = useRef(null);


    useEffect(() => {
    const handleClickOutside = (e) => {
      if (drawerRef.current && !drawerRef.current.contains(e.target)) {
        setDrawerOpen(false);
      }
    };

    if (drawerOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [drawerOpen, setDrawerOpen]);



  // Drawer popup animation
  const popupVariants = {
    hidden: { opacity: 0, scale: 0.8, y: -20 },
    visible: {
      opacity: 1,
      scale: 1,
      y: 0,
      transition: { type: "spring", stiffness: 180, damping: 18 },
    },
    exit: {
      opacity: 0,
      scale: 0.8,
      y: -20,
      transition: { duration: 0.15 },
    },
  };

  // Parent stagger container
  const listContainer = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: 0.08,
      },
    },
  };

  // Child animation for each item
  const listItem = {
    hidden: { opacity: 0, y: 15 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { type: "spring", stiffness: 150, damping: 15 },
    },
  };


  const handleRemoveItem = async (index) => {
    setLoadingIndex(index);
    const updatedCart = user_info.cartItems.filter((_, i) => i !== index);
    const updatedUserInfo = { ...user_info, cartItems: updatedCart };
    try {
        const response = await customerFetch.put("/update-cart", updatedCart)
        setUserInfo(updatedUserInfo);
        localStorage.setItem("user_info", JSON.stringify(updatedUserInfo));
         setLoadingIndex(null);
    } catch (error) {
        message.error("Failed to remove item from cart.");
    }
 
  }

  return (
    <AnimatePresence>
      {drawerOpen && (
        <motion.div
          ref={drawerRef}
          variants={popupVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
          className="
            fixed z-40 rounded-xl border bg-[#1b1b1b3d] backdrop-blur-md shadow-md

            /* Desktop */
            top-24 right-24 w-[30rem]  p-3

            /* Tablet */
            md:w-[30rem] md:right-10

            /* Mobile */
            max-md:top-20 max-md:right-0 max-md:left-0 max-md:w-[95%] max-md:mx-auto 
             max-md:p-2
          "
        >
          {/* Header */}
          <div className="flex justify-between items-center border-b p-2 max-md:p-1">
            <p className="text-black font-bold text-lg max-md:text-base">Cart Items</p>
            <button
              className="text-xl font-bold"
              onClick={() => setDrawerOpen(false)}
            >
              <IoMdClose />
            </button>
          </div>

          {/* Items */}
          <div className="mt-2 overflow-y-auto h-[26rem] max-md:h-[22rem] rounded-md hide-scrollbar">
            {user_info?.cartItems?.length > 0 ? (
              <motion.ul
                className="flex flex-col gap-3 font-slussen text-white"
                variants={listContainer}
                initial="hidden"
                animate="visible"
              >
                {user_info.cartItems.map((item, index) => (
                  <motion.li
                    key={index}
                    variants={listItem}
                    className="
                      p-3 rounded-xl bg-white/20 border border-white/30 
                      backdrop-blur-lg shadow-sm hover:shadow-md 
                      transition-shadow max-md:p-2
                    "
                  >
                    <Link href={`/product/${item?.productId}?variantid=${item?.variantId}`} className="flex items-start gap-3">
                      {/* Product Image */}
                      <Image
                        src={item?.image}
                        alt={item?.name}
                        width={55}
                        height={55}
                        className="rounded-lg border shadow-sm object-cover"
                        
                      />

                      {/* Content */}
                      <div className="flex-1 flex flex-col gap-1">
                        <span className="text-base font-medium max-md:text-sm">
                          {item?.title}
                        </span>

                        <div className="text-xs flex flex-col gap-0.5">
                          {item?.options?.map((option, idx) => (
                            <span key={idx}>• {option}</span>
                          ))}
                        </div>

                        <div className="flex justify-between items-center max-md:text-xs">
                          <span className="text-sm  max-md:text-xs">
                            Qty: <span className="font-medium">{item.quantity}</span>
                          </span>

                          <span className="text-sm font-semibold  max-md:text-xs">
                            ₹
                            {Number(item.price).toLocaleString("en-IN", {
                              minimumFractionDigits: 2,
                            })}
                          </span>
                        </div>
                      </div>
                    </Link>
                   <button
                        className="w-full border border-black bg-[#FF5555] text-xs p-2 mt-2 rounded-md flex justify-center items-center hover:bg-[#FF937E] transition-all duration-300 ease-in-out"
                        onClick={() => handleRemoveItem(index)}
                        >
                        {loadingIndex === index ? (
                            "Removing..."
                        ) : (
                            <span className=" font-bold">Remove Item</span>
                        )}
                        </button>
                  </motion.li>
                ))}
              </motion.ul>
            ) : (
              <p className="text-gray-600 text-center py-4">Your cart is empty.</p>
            )}
          </div>

          <div className=" w-full  p-2 rounded-md mt-2">

              <Link href="/cart" className="w-full  flex p-2 justify-center items-center bg-[#658C58] text-white border rounded-md">
                Go to Cart
              </Link>
     
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default CartDrawer;
