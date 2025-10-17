/* eslint-disable no-unused-vars */
import LocomotiveScroll from "locomotive-scroll";
import Hero from "../components/Home/Hero";
import Products from "../components/Home/Products";
import Categories from "../components/Home/Categories";
import { useEffect, useState } from "react";
import { publicFetch } from "../utils/helpers";

const HomePage = () => {

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

useEffect(() =>{
 const savedTheme = localStorage.getItem("theme");
  if (savedTheme === "dark") {
    setDark(true);
  } else {
    setDark(false);
  }
  getCategories();
},[])

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
    <div  className={` w-full  ${dark ? "bg-black text-white" : "bg-white text-black"} h-auto transition-all duration-1000 ease-in-out`}>
      {/* Top Notice Bar */}
      {/* <div className={` ${ dark ? "text-black bg-white" : "bg-black text-white"} text-center text-xs py-2`}>
        It's not too late to give a meaningful Christmas gift 🎁 <a href="#" className="underline">Find out here</a>
      </div> */}

      {/* Navigation */}
      {/* <header className="flex justify-between items-center px-8 py-4 w-full">
        <nav className="flex gap-6 text-sm font-medium w-4/12 items-center ">
         {categories.slice(0,4).map((category =>(
            <a key={category?.categoryId} href="#">{category?.title}</a>
         )))}

        </nav>
        <div className="text-2xl font-bold flex items-center justify-center w-4/12">HRF</div>
        <div className="flex gap-6 text-xs items-center w-4/12 justify-end">

     <label className="flex cursor-pointer gap-2 items-center">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="15"
          height="15"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round">
          <circle cx="12" cy="12" r="5" />
          <path
            d="M12 1v2M12 21v2M4.2 4.2l1.4 1.4M18.4 18.4l1.4 1.4M1 12h2M21 12h2M4.2 19.8l1.4-1.4M18.4 5.6l1.4-1.4" />
        </svg>
        <input type="checkbox"  value={dark} onChange={() => setTheme()} className="toggle theme-controller w-6 h-4 border" />
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="15"
          height="15"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round">
          <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>
        </svg>
      </label>

          <a href="#">Search</a>
          <a href="#">Cart</a>
          <a href="#">User Login</a>
        </div>
      </header> */}

      {/* Hero Section */}

      <Hero/>


      {/* Winter Collection Grid */}

      <Products categories = {categories} fadeInVariant={fadeInVariant} containerVariant={containerVariant}/>

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

      <Categories categories={categories} fadeInVariant={fadeInVariant} containerVariant={containerVariant}/>


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
  )
}

export default HomePage