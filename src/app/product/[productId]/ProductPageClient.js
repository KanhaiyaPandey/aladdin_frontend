"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import ProductImages from "../../../components/Product/ProductImages";
import ProductDetails from "../../../components/Product/ProductDetails";

export default function ProductPageClient({
  product,
  selectedVariant: initialSelectedVariant,
  productId,
}) {
  const [selectedVariant, setSelectedVariant] = useState(
    initialSelectedVariant
  );
  const [medias, setMedias] = useState([]);
  const router = useRouter();

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
          className="w-full lg:w-1/2 lg:h-screen lg:overflow-y-auto hide-scrollbar lg:sticky lg:top-0 bg-white"
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
    </div>
  );
}
