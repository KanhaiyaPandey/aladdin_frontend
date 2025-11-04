import { AnimatePresence,motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";

const ProductCards = ({product, router, handleImageChange,
     direction, variants, currentImg, medias}) => {
  return (
       <div
              className="flex-shrink-0 w-48 group carousel-item"
              style={{
                scrollSnapAlign: "start",
                contain: "layout style paint",
              }}
            >
              <div className="relative h-64 w-full overflow-hidden  shadow-md group">
                <AnimatePresence custom={direction} mode="wait">
                  <motion.div
                    key={currentImg}
                    custom={direction}
                    variants={variants}
                    initial="enter"
                    animate="center"
                    exit="exit"
                    transition={{
                      duration: 0.2,
                      ease: "easeOut",
                    }}
                    style={{ willChange: "transform, opacity" }}
                    className="absolute inset-0 cursor-pointer"
                    onClick={() =>
                      router.push(
                        product.variants.length > 0
                          ? `/product/${product.productId}?variantid=${product.variants[0].variantId}`
                          : `/product/${product.productId}`
                      )
                    }
                  >
                    <Image
                      src={currentImg}
                      alt={product.productName || "product image"}
                      fill
                      className="object-cover"
                      unoptimized
                      priority={false}/>
                  </motion.div>
                </AnimatePresence>

                {/* Left Button */}
                {medias.length > 1 && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleImageChange(product.productId, "prev", medias);
                    }}
                    className="absolute left-2 top-1/2 -translate-x-10 group-hover:translate-x-0 duration-300 ease-in-out -translate-y-1/2 bg-[#2422229e] hover:bg-black text-white rounded-full w-7 h-7 flex items-center justify-center shadow transition"
                  >
                    ‹
                  </button>
                )}

                {/* Right Button */}
                {medias.length > 1 && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleImageChange(product.productId, "next", medias);
                    }}
                    className="absolute right-2 top-1/2 -translate-y-1/2 translate-x-10 group-hover:translate-x-0 duration-300 ease-in-out bg-[#2422229e] hover:bg-black text-white rounded-full w-7 h-7 flex items-center justify-center shadow transition"
                  >
                    ›
                  </button>
                )}
              </div>

              <Link
                className="mt-2 text-start flex flex-col gap-1 cursor-pointer"
                href={
                  product.variants.length > 0
                    ? `/product/${product.productId}?variantid=${product.variants[0].variantId}`
                    : `/product/${product.productId}`
                }
              >
                <h3 className="text-xs truncate">{product.title}</h3>
                <p className="text-xs font-medium">₹{product.sellPrice}/-</p>
              </Link>
            </div>
  )
}

export default ProductCards