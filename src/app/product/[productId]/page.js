import { getProductPageData } from "../../../lib/loaders";
import ProductPageClient from "./ProductPageClient";

export default async function ProductPage({ params, searchParams }) {
  const { productId } = await params;
  const { variantid: variantId } = await searchParams;

  try {
    const { product, selectedVariant } = await getProductPageData(
      productId,
      variantId
    );

    return (
      <ProductPageClient
        product={product}
        selectedVariant={selectedVariant}
        productId={productId}
      />
    );
  } catch (error) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-gray-600 text-lg">Product not found.</p>
      </div>
    );
  }
}
