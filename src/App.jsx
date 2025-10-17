import { useState, useEffect, useRef } from "react";
import { createBrowserRouter, Route, RouterProvider, Routes } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";

import ErrorPage from "./pages/ErrorPage";
import HomePage from "./pages/HomePage";
import ProductPage from "./pages/ProductPage";
import LoadingScreen from "./components/LoadingScreen";
import LocomotiveScroll from "locomotive-scroll";
import Layout from "./pages/Layout";
import { productLoader } from "./utils/loaders";

const App = () => {
  const [isLoading, setIsLoading] = useState(true);

  const scrollRef = useRef(null);

    useEffect(() => {
    if (!scrollRef.current) return;

    const scroll = new LocomotiveScroll({
      el: scrollRef.current,
      smooth: true,
      multiplier: 1, // speed multiplier
      lerp: 0.1, // smoothness
    });

    return () => scroll.destroy();
  }, []);



const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    errorElement: <ErrorPage />,
    children: [
      {
      index: true,
        element: <HomePage />,
      },
      {
        path: "product/:productId",
        element: <ProductPage />,
        loader: productLoader
      },

    ]
  },

]);




  // useEffect(() => {
  //   const timer = setTimeout(() => setIsLoading(false), 2000); // simulate load time
  //   return () => clearTimeout(timer);
  // }, []);

  return (
    // <AnimatePresence mode="wait">
    //   {isLoading ? (
    //     <motion.div
    //       key="loader"
    //       initial={{ opacity: 1 }}
    //       animate={{ opacity: 1 }}
    //       exit={{ opacity: 0 }}
    //       transition={{ duration: 1, ease: "easeInOut" }}
    //     >
    //       <LoadingScreen />
    //     </motion.div>
    //   ) : (
    //     <motion.div
    //       key="content"
    //       initial={{ opacity: 0 }}
    //       animate={{ opacity: 1 }}
    //       exit={{ opacity: 0 }}
    //       transition={{ duration: 1, ease: "easeInOut" }}
    //     >
    //       <Routes>
    //         <Route path="/" element={<HomePage />} />
    //         <Route path="/product/:productId" element={<ProductPage />} />
    //         <Route path="*" element={<ErrorPage />} />
    //       </Routes>
    //     </motion.div>
    //   )}
    // </AnimatePresence>

 
         <RouterProvider router={router} />
  
  );
};

export default App;
