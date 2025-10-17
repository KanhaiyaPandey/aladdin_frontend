import { publicFetch } from "./helpers";

export const productLoader = async ({ params, request }) => {
  let { productId } = params;

  // Handle both URL types just in case
  if (productId.includes("&variantid=")) {
    productId = productId.split("&variantid=")[0];
  }

  // Extract query parameter (this will work with ?variantid=)
  const url = new URL(request.url);
  const variantId = url.searchParams.get("variantid");

  try {
    const response = await publicFetch.get(`/product/${productId}`);
    const productData = response.data.data;

    console.log("✅ Product:", productData);


    return { data: productData, variantId };
  } catch (error) {
    console.error("❌ Failed to load product:", error);
    throw error;
  }
};
