"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import ProductImages from "../../../components/Product/ProductImages";
import ProductDetails from "../../../components/Product/ProductDetails";
import ProductCards from "@/components/products/ProductCards";

export default function ProductPageClient({
  product,
  selectedVariant: initialSelectedVariant,
  productId,
}) {
  const [selectedVariant, setSelectedVariant] = useState(
    initialSelectedVariant
  );
    const [medias, setMedias] = useState([]);
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
  

  useEffect(() => {
    if (selectedVariant && product) {
      setMedias(selectedVariant.variantMedias || product.productMedias || []);
      const newUrl = `/product/${product.productId}?variantid=${selectedVariant.variantId}`;
      if (window.location.pathname + window.location.search !== newUrl) {
        router.replace(newUrl);
      }
    }
  }, [selectedVariant, product, router]);

  if (!product) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-gray-600 text-lg">Product not found.</p>
      </div>
    );
  }

  return (
    <div className="w-full min-h-screen font-body">
      {/* layout: column on small, two-columns on lg+ */}
      <div className="w-full flex flex-col lg:flex-row items-start lg:items-stretch hide-scrollbar">
        {/* Left: images
            - full width on small screens (stacked)
            - half width and independent vertical scroll on lg+ */}
        <div
          className="w-full lg:w-1/2 hide-scrollbar bg-white"
          style={{ WebkitOverflowScrolling: "touch" }}
        >
          <div className="">
            <ProductImages medias={medias} />
          </div>
        </div>

        {/* Right: details
            - below images on small screens
            - half width and sticky on lg+ */}
        <div className="w-full hide-scrollbar lg:w-1/2 lg:h-screen lg:sticky lg:top-0 overflow-auto flex items-center justify-center">
          <div className=" w-full mx-auto px-4 py-6">
            <ProductDetails
              product={product}
              selectedVariant={selectedVariant}
              onSelectVariant={setSelectedVariant}
            />
          </div>
        </div>
      </div>

      <div className=" w-full mt-10 grid p-4 gap-4">
        <div className="flex items-center w-full justify-start">
           <p className="text-center">Style With</p>
        </div>

       <div
        className="flex overflow-x-auto gap-3 scrollbar-hide"
        style={{
          scrollSnapType: "x mandatory",
          WebkitOverflowScrolling: "touch",
          scrollBehavior: "smooth",
          willChange: "scroll-position",
        }}
      >
        {product?.crossSellProducts.slice(0, 20).map((product) => {
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

        <div className="flex items-center w-full justify-start mt-5">
           <p className="text-center">You May Also Like</p>
        </div>

              <div
        className="flex overflow-x-auto gap-3 scrollbar-hide"
        style={{
          scrollSnapType: "x mandatory",
          WebkitOverflowScrolling: "touch",
          scrollBehavior: "smooth",
          willChange: "scroll-position",
        }}
      >
        {product?.upSellProducts.slice(0, 20).map((product) => {
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
    </div>
  );
}
