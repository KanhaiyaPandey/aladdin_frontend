import React, { useState } from "react";
import { useRouter } from "next/navigation";
import ProductCards from "./ProductCards";

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
        {categories.slice(0,2).map((category) => (
          <button
            className=" text-xs px-3 py-1 capitalize rounded-md hover:bg-black hover:text-white border transition"
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
              opacity: 1,
            }),
            center: { x: 0, opacity: 1 },
            exit: (dir) => ({
              x: dir === "next" ? -100 : 100,
              opacity: 0,
            }),
          };

          return (
           <ProductCards key={product.productId} product={product}
            medias={medias} direction={direction}
            router={router} handleImageChange={handleImageChange}
             variants={variants} currentImg={currentImg}/>
          );
        })}
      </div>
    </div>
  );
};

export default ProductCarousel;
