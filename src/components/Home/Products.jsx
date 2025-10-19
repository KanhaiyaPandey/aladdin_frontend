/* eslint-disable no-unused-vars */
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { publicFetch } from "../../utils/helpers";
import ProductCarousel from "../products/ProductCarousel";
import ProductsSminner from "../simmers/Home/ProductsSminner"; // Import the shimmer

const Products = ({ fadeInVariant, categories }) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true); // Add loading state

  const getProducts = async () => {
    const res = await publicFetch.get("/product/all-products");
    setProducts(res.data.data);
    setLoading(false); // Set loading to false after data is fetched
    console.log(res.data.data);
  };

  useEffect(() => {
    getProducts();
  }, []);

  return (
    <section
      variants={fadeInVariant}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.2 }}
      className="px-6 py-12 w-full"
    >

     <div className=" w-full flex flex-col items-center justify-center">

      <h2 className="text-center text-2xl font-medium mb-2 uppercase tracking-wider">
        Winter Collections
      </h2>
      <p className="text-center w-1/6 mb-10 text-sm font-body  text-gray-600 font-slussen font-light">
        Let us love winter, for it is the spring of genius.
      </p>

     </div>


   {loading ? <ProductsSminner /> : <ProductCarousel products={products} categories={categories}  />}
      <div className="text-center mt-8">
        <button className="border px-6 py-2 rounded-full text-sm">
          Load More Products
        </button>
      </div>
    </section>
  );
};

export default Products;
