import Image from "next/image";

const ProductImages = ({ medias }) => {
  return (
    <div className="w-full">
      {medias.map((media, index) => {
        let widthClass;
        const patternIndex = index % 3; 
        const remaining = medias.length - index;
        if (patternIndex === 0) {
          widthClass = "w-full";
        } else {
          widthClass = remaining === 1 ? "w-full" : "w-1/2";
        }

        return (
          <div
            key={media.mediaId || media.url || index}
            className={`${widthClass} inline-block relative`}
          >
            <Image
              src={media.url}
              alt={media.title || "product image"}
              width={800}
              height={600}
              className="w-full h-auto object-cover"
              unoptimized
            />
          </div>
        );
      })}
    </div>
  );
};

export default ProductImages;
