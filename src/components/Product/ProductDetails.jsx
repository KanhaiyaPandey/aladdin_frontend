import React from "react";
import Image from "next/image";
import { CiHeart } from "react-icons/ci";
import clsx from "clsx";

const ProductDetails = ({ selectedVariant, product, onSelectVariant }) => {
  if (!product) return null;

  // Extract unique values for each attribute index
  const attributeValues = (product.attributes || []).map((_, index) => {
    const values = [
      ...new Set((product.variants || []).map((v) => v.options[index])),
    ];
    return values;
  });

  return (
    <div className="w-3/4 p-2 grid grid-cols-1 gap-10 font-slussen">
      {/* === Top Section === */}
      <div className="flex items-start justify-between">
        <div className="w-8/12 flex flex-col">
          <h1 className=" text-xl font-medium uppercase">{product?.title}</h1>
          <h1 className="font-semibold">₹{selectedVariant?.sellPrice}.00</h1>
          <span className="text-sm font-thin">MRP inclusive of all taxes</span>
        </div>
        <div className="w-4/12 text-2xl flex items-center justify-center">
          <CiHeart className="cursor-pointer" />
        </div>
      </div>

      {/* === Attributes Section === */}
      <div className="flex flex-col gap-6">
        {(product.attributes || []).map((attr, attrIndex) => (
          <div key={attr} className="flex flex-col gap-2">
            <span className="uppercase font-extralight">
              {attr}: {selectedVariant?.options?.[attrIndex] ?? "-"}
            </span>
            <div className="flex gap-2 flex-wrap w-full">
              {attributeValues[attrIndex].map((value) => {
                const isActive =
                  selectedVariant &&
                  selectedVariant.options[attrIndex] === value;

                const isColor = String(attr).toLowerCase() === "color";

                // find a variant that has this attribute value (used for image preview)
                const variantForValue = (product.variants || []).find(
                  (v) => v.options[attrIndex] === value
                );

                // safe image src (supports both string and object media shapes)
                const imgSrc =
                  variantForValue?.variantMedias?.[0]?.url ||
                  variantForValue?.variantMedias?.[0] ||
                  product?.productMedias?.[0]?.url;
                ("");

                return (
                  <button
                    key={value}
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
                      "border border-gray-400 text-sm  w-2/12 items-center justify-center uppercase transition-all flex",
                      { "": isColor, "h-[50px]": !isColor },
                      isActive
                        ? "bg-black text-white border-black"
                        : "hover:bg-gray-100"
                    )}
                  >
                    {isColor ? (
                      imgSrc ? (
                        <div className="relative w-full h-full">
                          <Image
                            src={imgSrc}
                            alt={String(value)}
                            fill
                            className="object-cover"
                            unoptimized
                          />
                        </div>
                      ) : (
                        <span className="text-xs text-center h-[100px] fle">
                          {value}
                        </span>
                      )
                    ) : (
                      <span>{value}</span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        ))}

        <div className=" flex flex-col gap-4">
          <button className=" bg-black text-white text-sm  w-full p-4 ">
            Add to Cart
          </button>
          {/* <button className=" bg-white text-black text-sm  w-full p-4 border border-gray-400">Buy Now</button> */}
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;
