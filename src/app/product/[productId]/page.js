'use client'

import { useState, useEffect } from "react";
import { useParams, useSearchParams } from "next/navigation";
import LoadingScreen from "../../../components/LoadingScreen";
import ProductImages from "../../../components/Product/ProductImages";
import ProductDetails from "../../../components/Product/ProductDetails";
import { publicFetch } from "../../../utils/helpers";

export default function ProductPage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const productId = params.productId;
  const variantId = searchParams.get('variantid');
  
  const [selectedVariant, setSelectedVariant] = useState(null);
  const [product, setProduct] = useState(null);
  const [medias, setMedias] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        const response = await publicFetch.get(`/product/${productId}`);
        const data = response.data.data;
        setProduct(data);
        
        if (variantId && data?.variants?.length > 0) {
          const matchedVariant = data.variants.find(
            (v) => v.variantId === variantId
          );
          setSelectedVariant(matchedVariant || null);
          setMedias(matchedVariant ? matchedVariant.variantMedias : []);
        } else {
          setSelectedVariant(data?.variants?.[0] || null);
          setMedias(data?.productMedias || []);
        }
      } catch (error) {
        console.error("Failed to fetch product:", error);
        setProduct(null);
      } finally {
        setLoading(false);
      }
    };

    if (productId) {
      fetchProduct();
    }
  }, [productId, variantId]);

  useEffect(() => {
    if (selectedVariant && product) {
      setMedias(selectedVariant.variantMedias || product.productMedias || []);
      const newUrl = `/product/${product.productId}?variantid=${selectedVariant.variantId}`;
      if (window.location.pathname + window.location.search !== newUrl) {
        window.history.replaceState({}, "", newUrl);
      }
    }
  }, [selectedVariant, product]);

  if (loading) {
    return <LoadingScreen />;
  }

  if (!product) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-gray-600 text-lg">Product not found.</p>
      </div>
    );
  }

  return (
    <div className="w-full flex flex-col items-center justify-center font-body">
      <div className="w-full flex h-auto items-start justify-center relative">
        {/* Left Side: Scrollable */}
        <div className="w-1/2 h-[200vh] overflow-y-auto hide-scrollbar">
          <ProductImages medias={medias} />
        </div>

        {/* Right Side: Sticky */}
        <div className="w-1/2 min-h-screen sticky top-0 right-0 flex items-center justify-center">
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
