"use client";

import { useState, useEffect } from "react";
import Hero from "../components/Home/Hero";
import Products from "../components/Home/Products";
import Categories from "../components/Home/Categories";
import LoadingScreen from "../components/LoadingScreen";

export default function HomePageClient({ categories, products }) {
  const [dark, setDark] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme === "dark") {
      setDark(true);
    } else {
      setDark(false);
    }

    

    // Wait for data to be available and DOM to be ready
    if (
      categories &&
      products &&
      Array.isArray(categories) &&
      Array.isArray(products)
    ) {
      // Use requestAnimationFrame to ensure DOM is ready
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          setLoading(false);
        });
      });
    } else {
      // If no data available, still hide loading after a short delay
      setTimeout(() => setLoading(false), 500);
    }
  }, [categories, products]);

  useEffect(() => {
    localStorage.setItem("theme", dark ? "dark" : "light");
  }, [dark]);

  const setTheme = () => {
    setDark((prev) => !prev);
  };

  const fadeInVariant = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: "easeOut" },
    },
  };

  const containerVariant = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: 0.15, // delay between each child
        delayChildren: 0.1, // initial delay
      },
    },
  };

  if (loading) {
    return <LoadingScreen />;
  }

  return (
    <div
      className={`w-full ${
        dark ? "bg-black text-white" : "bg-white text-black"
      } h-auto transition-all duration-1000 ease-in-out`}
    >
      {/* Hero Section */}
      <Hero />

      {/* Winter Collection Grid */}
      <Products
        categories={categories}
        products={products}
        fadeInVariant={fadeInVariant}
        containerVariant={containerVariant}
      />

      {/* Promo Section */}
      <section className="bg-gray-50 px-6 py-12 flex flex-col md:flex-row items-center gap-8">
        <div className="flex-1 bg-gray-300 h-60"></div>
        <div className="flex-1">
          <h3 className="text-lg font-semibold">
            Find your perfect look at Harfa Sty New on Paris
          </h3>
          <p className="text-sm text-gray-600 mt-2 mb-4">
            Sales and Discount! 87%
          </p>
          <button className="bg-black text-white px-6 py-2 rounded-full text-sm">
            Find the Store
          </button>
        </div>
      </section>

      {/* Featured Collections */}
      <Categories
        categories={categories}
        fadeInVariant={fadeInVariant}
        containerVariant={containerVariant}
      />

      {/* Footer */}

    </div>
  );
}
