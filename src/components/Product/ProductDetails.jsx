import React, { useState, useRef, useEffect } from "react";
import Image from "next/image";
import { CiHeart } from "react-icons/ci";
import clsx from "clsx";
import { message, Modal, Spin } from "antd";
import { motion } from "framer-motion";
import { useUser } from "@/context/UserContext";
import { customerFetch } from "@/utils/helpers";

const ProductDetails = ({ selectedVariant, product, onSelectVariant }) => {
  if (!product) return null;

  // Extract unique values for each attribute index
  const attributeValues = (product.attributes || []).map((_, index) => {
    const values = [
      ...new Set((product.variants || []).map((v) => v.options[index])),
    ];
    return values;
  });

  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const {user_info, setUserInfo, setDrawerOpen } = useUser();
  const [cart, setCart] = useState(user_info?.cartItems || []);

  useEffect(() => {
    setCart(user_info?.cartItems || []);
    console.log("user = ", user_info);
    
  }, [user_info]);

  // Refs + constraints for per-attribute small-screen carousels
  const carouselRefs = useRef([]);
  const [dragConstraintsMap, setDragConstraintsMap] = useState({});

  useEffect(() => {
    const update = () => {
      const map = {};
      (attributeValues || []).forEach((_, i) => {
        const el = carouselRefs.current[i];
        if (!el) return;
        const scrollWidth = el.scrollWidth;
        const offsetWidth = el.offsetWidth;
        const maxScroll = Math.max(0, scrollWidth - offsetWidth);
        map[i] = { left: -maxScroll, right: 0 };
      });
      setDragConstraintsMap(map);
    };
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);



      const handleAddToCart = async () => {
          if (!selectedVariant) return;
          setLoading(true);
          const newItem = {
            productId: product.productId,
            variantId: selectedVariant.variantId,
            title: product.title,
            attributes: product.attributes || [],
            options: selectedVariant.options || [],
            quantity: 1,
            image:selectedVariant?.variantMedias?.[0]?.url || product?.productMedias?.[0]?.url || "",
            price: selectedVariant.sellPrice,
          };

          // Clone current cart
          let updatedCart = [...(cart || [])];

          // Check if variant already exists
          const existingIndex = updatedCart.findIndex(
            (item) => item.variantId === newItem.variantId
          );

        if (existingIndex !== -1) {
          // Increase quantity
          updatedCart[existingIndex] = {
            ...updatedCart[existingIndex],
            quantity: updatedCart[existingIndex].quantity + 1,
          };
        } else {
          // Add new item
          updatedCart.push(newItem);
        }

        // Update local state + context
        setCart(updatedCart);
        const updatedUserInfo = {
          ...user_info,
          cartItems: updatedCart,
        };

        try {

         const response = await customerFetch.put("/update-cart", updatedCart)
          setLoading(false);
          setDrawerOpen(true);
          localStorage.setItem("user_info", JSON.stringify(response.data.data));
          setUserInfo({
          ...user_info,
          cartItems: updatedCart,
        }); 
        
         message.success("Cart updated successfully");
        } catch (error) {
          message.error("Failed to update cart. Please try again.");
          setLoading(false);
        }

      };

  return (
    <div className="w-full relative lg:w-3/4 py-2 grid grid-cols-1 gap-6 font-slussen max-w-4xl mx-auto overflow-hidden">
      {/* === Top Section === */}
      <div className="flex flex-row w-full items-start justify-between gap-4">
        <div className="w-full md:w-8/12 flex flex-col gap-2">
          <h1 className=" sm:text-xl md:text-2xl font-medium uppercase">
            {product?.title}
          </h1>
              <h2 className="font-semibold text-sm md:text-lg">
                ₹{selectedVariant?.sellPrice}.00
              </h2>
              <span className="text-xs text-gray-600">
                MRP inclusive of all taxes
              </span>
            </div>

          <div className="w-full md:w-4/12 flex items-center md:items-start justify-end ">
              <CiHeart className="cursor-pointer text-2xl" />
            </div>
          </div>

              {/* === Attributes Section === */}
              <div className="flex flex-col gap-6">
                {(product.attributes || []).map((attr, attrIndex) => (
                  <div key={attr} className="flex flex-col gap-2">
                    <div className="w-full flex items-center justify-between uppercase font-extralight">
                      <span className="text-sm">
                        {attr}: {selectedVariant?.options?.[attrIndex] ?? "-"}
                      </span>

                      {attr === "size" && product.sizeGuide !== "" && (
                        <div>
                          <button
                            onClick={() => setOpen(true)}
                            className="cursor-pointer hover:opacity-75 hover:scale-95 duration-200 ease-in-out text-sm"
                          >
                            Size Guide
                          </button>

                          <Modal
                            centered
                            open={open}
                            onOk={() => setOpen(false)}
                            onCancel={() => setOpen(false)}
                            footer={null}
                            width={{
                              xs: "95%",
                              sm: "85%",
                              md: "75%",
                              lg: "60%",
                              xl: "50%",
                            }}
                          >
                            <Image
                              src={product?.sizeGuide}
                              alt="size guide"
                              width={800}
                              height={800}
                              className="object-contain"
                              unoptimized
                            />
                          </Modal>
                        </div>
                      )}
                    </div>

                    {/* Small screens: horizontal carousel */}
                    <div className="w-full lg:hidden">
                      <motion.div
                        ref={(el) => (carouselRefs.current[attrIndex] = el)}
                        drag="x"
                        dragConstraints={
                          dragConstraintsMap[attrIndex] || { left: 0, right: 0 }
                        }
                        className="flex py-3 px-2"
                        style={{ cursor: "grab" }}
                      >
                        {attributeValues[attrIndex].map((value) => {
                          const isActive =
                            selectedVariant &&
                            selectedVariant.options[attrIndex] === value;

                          const isColor = String(attr).toLowerCase() === "color";

                          const variantForValue = (product.variants || []).find(
                            (v) => v.options[attrIndex] === value
                          );

                          const imgSrc =
                            variantForValue?.variantMedias?.[0]?.url ||
                            variantForValue?.variantMedias?.[0] ||
                            product?.productMedias?.[0]?.url ||
                            "";

                          return (
                            <div
                              key={String(value)}
                              className={clsx(
                                "flex-shrink-0 min-w-[110px] sm:min-w-[140px] md:min-w-[160px] overflow-hidden border border-gray-300",
                                isActive
                                  ? "bg-black text-white border-black"
                                  : "bg-white"
                              )}
                            >
                              <button
                                onClick={() => {
                                  const newVariant = (product.variants || []).find(
                                    (v) =>
                                      v.options.every((opt, i) =>
                                        i === attrIndex
                                          ? opt === value
                                          : opt === selectedVariant?.options?.[i]
                                      )
                                  );
                                  if (newVariant) onSelectVariant(newVariant);
                                }}
                                className={`w-full ${isColor ? 'p-0' : 'p-3'} h-full flex items-center justify-center uppercase text-sm`}
                              >
                                {isColor ? (
                                  imgSrc ? (
                                    // eslint-disable-next-line @next/next/no-img-element
                                    <img
                                      src={imgSrc}
                                      alt={String(value)}
                                      className="w-full h-[150px] p-0 object-cover"
                                    />
                                  ) : (
                                    <span className="text-xs">{value}</span>
                                  )
                                ) : (
                                  <span className="text-center px-2">{value}</span>
                                )}
                              </button>
                            </div>
                          );
                        })}
                      </motion.div>
                    </div>

                    {/* Large screens: grid / wrap */}
                    <div className="hidden lg:flex flex-wrap w-full">
                      {attributeValues[attrIndex].map((value) => {
                        const isActive =
                          selectedVariant &&
                          selectedVariant.options[attrIndex] === value;

                        const isColor = String(attr).toLowerCase() === "color";

                        const variantForValue = (product.variants || []).find(
                          (v) => v.options[attrIndex] === value
                        );

                        const imgSrc =
                          variantForValue?.variantMedias?.[0]?.url ||
                          variantForValue?.variantMedias?.[0] ||
                          product?.productMedias?.[0]?.url ||
                          "";

                        const btnWidth = isColor
                          ? "w-1/3 sm:w-1/4 md:w-2/12"
                          : "w-1/3 sm:w-1/4 md:w-2/12";

                        const btnHeight = isColor
                          ? "min-h-[200px] md:min-h-[130px]"
                          : "py-3";

                        return (
                          <button
                            key={String(value)}
                            onClick={() => {
                              const newVariant = (product.variants || []).find((v) =>
                                v.options.every((opt, i) =>
                                  i === attrIndex
                                    ? opt === value
                                    : opt === selectedVariant?.options?.[i]
                                )
                              );
                              if (newVariant) onSelectVariant(newVariant);
                            }}
                            className={clsx(
                              "border border-gray-300 text-sm items-center justify-center uppercase transition-all flex overflow-hidden",
                              btnWidth,
                              btnHeight,
                              isActive
                                ? "bg-black text-white border-black"
                                : "bg-white hover:bg-gray-100"
                            )}
                          >
                            {isColor ? (
                              imgSrc ? (
                                <div className="relative w-full h-full">
                                  <Image
                                    src={imgSrc}
                                    alt={String(value) || "color swatch"}
                                    fill
                                    className="object-cover"
                                    unoptimized
                                  />
                                </div>
                              ) : (
                                <div className="flex items-center justify-center w-full h-full px-2">
                                  <span className="text-xs text-center">{value}</span>
                                </div>
                              )
                            ) : (
                              <span className="w-full text-center px-2">{value}</span>
                            )}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                ))}

                <div className="flex flex-col gap-4 relative overflow-hidden group ">
                 <button
                      disabled={loading}
                      onClick={handleAddToCart}
                      className="text-black text-sm w-full p-4 rounded border flex items-center justify-center"
                    >
                      {loading ? (
                        <Spin size="small" />
                      ) : (
                        'Add to cart'
                      )}
                    </button>
                  <div className=" absolute text-sm top-0 z-10 bg-black bottom-0 rounded left-0 group-hover:-translate-y-14 duration-300 transition-all ease-out right-0 text-white flex items-center justify-center">
                         {loading ? (
                        <Spin size="small" />
                      ) : (
                        'Add to cart'
                      )}
                  </div>
                </div>

                <div className="w-full">
                  <h1 className="font-light text-sm leading-relaxed">
                    {product.description}
                  </h1>
                </div>
              </div>
    </div>
  );
};

export default ProductDetails;
