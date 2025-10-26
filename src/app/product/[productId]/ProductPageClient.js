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
      <div className="flex items-center justify-center h-screen">
        <p className="text-gray-600 text-lg">Product not found.</p>
      </div>
    );
  }

  return (
    // full viewport container so left column's scrolling is isolated
    <div className="w-full flex flex-col items-center justify-center font-body">
      <div className="w-full flex h-screen items-start justify-center relative">
        {/* Left Side: Scrollable (confined to viewport) */}
        <div
          className="w-1/2 h-full overflow-y-auto hide-scrollbar scroll-smooth"
          style={{ WebkitOverflowScrolling: "touch" }}
        >
          <ProductImages medias={medias} />
        </div>

        {/* Right Side: Sticky */}
        <div className="w-1/2 h-screen sticky top-0 right-0 flex items-center justify-center overflow-auto">
          <ProductDetails
            product={product}
            selectedVariant={selectedVariant}
            onSelectVariant={setSelectedVariant}
          />
        </div>
      </div>
    </div>
  );
}
