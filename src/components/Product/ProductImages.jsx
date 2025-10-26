import Image from "next/image";

const ProductImages = ({ medias }) => {
  return (
    <div className="w-full">
      {medias.map((media, index) => {
        let widthClass;

        // Determine the row pattern: 1 image, 2 images, repeat
        const patternIndex = index % 3; // pattern: [0,1,2]
        if (patternIndex === 0) {
          widthClass = "w-full"; // 1st image in row
        } else if (patternIndex === 1 || patternIndex === 2) {
          widthClass = "w-1/2"; // 2nd and 3rd image in pattern (2 per row)
        }

        return (
          <div
            key={media.mediaId}
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
