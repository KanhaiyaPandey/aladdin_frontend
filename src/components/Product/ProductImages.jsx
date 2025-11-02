import React, { useRef, useEffect, useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";

const ProductImages = ({ medias = [] }) => {
  const carouselRef = useRef(null);
  const [dragConstraints, setDragConstraints] = useState({ left: 0, right: 0 });

  useEffect(() => {
    const el = carouselRef.current;
    if (!el) return;
    const update = () => {
      const scrollWidth = el.scrollWidth;
      const offsetWidth = el.offsetWidth;
      const maxScroll = Math.max(0, scrollWidth - offsetWidth);
      // framer-motion drag is inverted: left should be -maxScroll
      setDragConstraints({ left: -maxScroll, right: 0 });
    };
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, [medias]);

  return (
    <div className="w-full">
      {/* Small screens: horizontal draggable carousel */}
      <div className="lg:hidden overflow-hidden">
        <motion.div
          ref={carouselRef}
          drag="x"
          dragConstraints={dragConstraints}
          className="flex gap-3 py-4 px-3"
          style={{ cursor: "grab" }}
        >
          {medias.map((media, idx) => (
            <div
              key={media.mediaId || media.url || idx}
              className="flex-shrink-0 w-[85%] sm:w-[80%] md:w-[60%] rounded-lg overflow-hidden relative"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <Image
                src={media.url}
                alt={media.title || "product image"}
                width={800}
                height={600}
                className="w-full h-auto object-cover rounded-lg"
                unoptimized
              />
            </div>
          ))}
        </motion.div>
      </div>

      {/* Large screens: existing pattern (1,2 repeat) */}
      <div className="hidden lg:block">
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
      </div>
    </div>
  );
};

export default ProductImages;
