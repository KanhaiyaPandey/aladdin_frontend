/* eslint-disable no-unused-vars */
import { motion } from "framer-motion";
import ProductCarousel from "../products/ProductCarousel";

const Products = ({ fadeInVariant, categories, products = [] }) => {
  return (
    <section
      className="px-6 py-12 w-full"
    >
      <div className=" w-full flex flex-col items-center justify-center">
        <h2 className="text-center text-2xl font-medium mb-2 uppercase tracking-wider">
          Winter Collections
        </h2>
        <p className="text-center md:w-1/6 w-1/2 mb-10 text-sm font-body  text-gray-600 font-slussen font-light">
          Let us love winter, for it is the spring of genius.
        </p>
      </div>

      <ProductCarousel products={products} categories={categories} />

      <div className="text-center mt-8">
        <button className="border px-6 py-2 rounded-full text-sm">
          Load More Products
        </button>
      </div>
    </section>
  );
};

export default Products;
