'use client'

import { useState, useEffect } from "react";
import Hero from "../components/Home/Hero";
import Products from "../components/Home/Products";
import Categories from "../components/Home/Categories";
import { publicFetch } from "../utils/helpers";

export default function HomePage() {
  const [dark, setDark] = useState(false);
  const [categories, setCategories] = useState([]);

  const getCategories = async () => {
    try {
      const res = await publicFetch.get("/category/all-categories");
      setCategories(res?.data?.data || []);
    } catch (error) {
      console.error("Failed to fetch categories:", error);
    }
  };

  useEffect(() => {
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme === "dark") {
      setDark(true);
    } else {
      setDark(false);
    }
    getCategories();
  }, []);

  useEffect(() => {
    localStorage.setItem("theme", dark ? "dark" : "light");
  }, [dark]);

  const setTheme = () => {
    setDark(prev => !prev);
  };

  const fadeInVariant = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
  };

  const containerVariant = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: 0.15, // delay between each child
        delayChildren: 0.1,    // initial delay
      },
    },
  };

  return (
    <div className={`w-full ${dark ? "bg-black text-white" : "bg-white text-black"} h-auto transition-all duration-1000 ease-in-out`}>
      {/* Hero Section */}
      <Hero />

      {/* Winter Collection Grid */}
      <Products categories={categories} fadeInVariant={fadeInVariant} containerVariant={containerVariant} />

      {/* Promo Section */}
      <section className="bg-gray-50 px-6 py-12 flex flex-col md:flex-row items-center gap-8">
        <div className="flex-1 bg-gray-300 h-60"></div>
        <div className="flex-1">
          <h3 className="text-lg font-semibold">Find your perfect look at Harfa Sty New on Paris</h3>
          <p className="text-sm text-gray-600 mt-2 mb-4">Sales and Discount! 87%</p>
          <button className="bg-black text-white px-6 py-2 rounded-full text-sm">Find the Store</button>
        </div>
      </section>

      {/* Featured Collections */}
      <Categories categories={categories} fadeInVariant={fadeInVariant} containerVariant={containerVariant} />

      {/* Footer */}
      <footer className="bg-neutral-900 text-white px-6 py-10 text-sm">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 mb-8">
          <div>
            <h4 className="mb-2 font-semibold">Product</h4>
            <ul>
              <li>T-shirt</li>
              <li>Jacket</li>
              <li>Jeans</li>
              <li>Sneakers</li>
            </ul>
          </div>
          <div>
            <h4 className="mb-2 font-semibold">Categories</h4>
            <ul>
              <li>Mens</li>
              <li>Womens</li>
              <li>Kids</li>
              <li>New Arrivals</li>
            </ul>
          </div>
          <div>
            <h4 className="mb-2 font-semibold">Help</h4>
            <ul>
              <li>Customer Service</li>
              <li>Find a Store</li>
              <li>Legal & Privacy</li>
              <li>Cookie Notice</li>
            </ul>
          </div>
          <div>
            <h4 className="mb-2 font-semibold">Newsletter</h4>
            <input
              type="email"
              placeholder="Your email"
              className="w-full px-3 py-2 rounded text-black mb-2"
            />
            <button className="w-full bg-white text-black px-4 py-2 rounded">Submit</button>
          </div>
        </div>
        <div className="text-center border-t pt-4 text-xs">© 2024 HRF™. All rights reserved.</div>
      </footer>
    </div>
  );
}
