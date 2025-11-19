import { useUser } from "@/context/UserContext";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { useEffect } from "react";
import { IoMdClose } from "react-icons/io";

const CartDrawer = () => {
  const { drawerOpen, setDrawerOpen, user_info } = useUser();

  useEffect(() => {
    console.log("user:", user_info);
  }, [user_info]);

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

  return (
    <AnimatePresence>
      {drawerOpen && (
        <motion.div
          variants={popupVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
          className="
            fixed z-40 rounded-xl border bg-[#2726263d] backdrop-blur-sm

            /* Desktop */
            top-32 right-10 w-[30rem] h-[30rem] p-3

            /* Tablet */
            md:w-[24rem] md:right-6

            /* Mobile */
            max-md:top-20 max-md:right-0 max-md:left-0 max-md:w-[95%] max-md:mx-auto 
            max-md:h-[26rem] max-md:p-2
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
          <div className="mt-2 overflow-y-auto h-[26rem] max-md:h-[22rem] hide-scrollbar">
            {user_info?.cartItems?.length > 0 ? (
              <motion.ul
                className="flex flex-col gap-3 font-slussen"
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
                      backdrop-blur-md shadow-sm hover:shadow-md 
                      transition-shadow max-md:p-2
                    "
                  >
                    <div className="flex items-start gap-3">
                      {/* Product Image */}
                      <Image
                        src={item?.image}
                        alt={item?.name}
                        width={55}
                        height={55}
                        className="rounded-lg border shadow-sm object-cover "
                      />

                      {/* Content */}
                      <div className="flex-1 flex flex-col gap-1">
                        <span className="text-base font-medium max-md:text-sm">
                          {item?.title}
                        </span>

                        <div className="text-xs text-black flex flex-col gap-0.5">
                          {item?.options?.map((option, idx) => (
                            <span key={idx}>• {option}</span>
                          ))}
                        </div>

                        <div className="flex justify-between items-center mt-1 max-md:text-xs">
                          <span className="text-sm text-black max-md:text-xs">
                            Qty: <span className="font-medium">{item.quantity}</span>
                          </span>

                          <span className="text-sm font-semibold text-black max-md:text-xs">
                            ₹
                            {Number(item.price).toLocaleString("en-IN", {
                              minimumFractionDigits: 2,
                            })}
                          </span>
                        </div>
                      </div>
                    </div>
                  </motion.li>
                ))}
              </motion.ul>
            ) : (
              <p className="text-gray-600 text-center py-4">Your cart is empty.</p>
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default CartDrawer;
