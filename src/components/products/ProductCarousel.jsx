import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";

const ProductCarousel = ({ products, categories }) => {
  const [imageIndexes, setImageIndexes] = useState({});
  const [directions, setDirections] = useState({});
  const router = useRouter();

  const handleImageChange = (productId, direction, medias) => {
    setDirections((prev) => ({ ...prev, [productId]: direction }));

    setImageIndexes((prev) => {
      const current = prev[productId] || 0;
      const total = medias.length;
      const next =
        direction === "next"
          ? (current + 1) % total
          : (current - 1 + total) % total;
      return { ...prev, [productId]: next };
    });
  };

  return (
    <div className=" w-full grid grid-cols-1 gap-y-1 items-center justify-start font-body font-slussen">
      <div className=" flex gap-2">
        {categories.map((category) => (
          <button
            className=" text-xs px-3 py-1 rounded-md hover:bg-black hover:text-white border transition"
            key={category?.categoryId}
          >
            {category?.title}
          </button>
        ))}
      </div>

      <div
        className="flex overflow-x-auto gap-3 py-4 scrollbar-hide"
        style={{
          scrollSnapType: "x mandatory",
          WebkitOverflowScrolling: "touch",
          scrollBehavior: "smooth",
          willChange: "scroll-position",
        }}
      >
        {products.slice(0, 20).map((product) => {
          const medias = product.productMedias || [];
          const currentIndex = imageIndexes[product.productId] || 0;
          const direction = directions[product.productId] || "next";
          const currentImg = medias[currentIndex]?.url || "/fallback.jpg";

          // Direction-aware variants
          const variants = {
            enter: (dir) => ({
              x: dir === "next" ? 100 : -100,
              opacity: 0,
            }),
            center: { x: 0, opacity: 1 },
            exit: (dir) => ({
              x: dir === "next" ? -100 : 100,
              opacity: 0,
            }),
          };

          return (
            <div
              key={product.productId}
              className="flex-shrink-0 w-48 group carousel-item"
              style={{
                scrollSnapAlign: "start",
                contain: "layout style paint",
              }}
            >
              <div className="relative h-64 w-full overflow-hidden rounded-lg shadow-md group">
                <AnimatePresence custom={direction} mode="wait">
                  <motion.div
                    key={currentImg}
                    custom={direction}
                    variants={variants}
                    initial="enter"
                    animate="center"
                    exit="exit"
                    transition={{
                      duration: 0.3,
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
                      alt={product.productName}
                      fill
                      className="object-cover"
                      unoptimized
                      priority={false}
                    />
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
          );
        })}
      </div>
    </div>
  );
};

export default ProductCarousel;
