import { useEffect, useState } from "react";
import HomePage from "./HomePage"
import { publicFetch } from "../utils/helpers";
import CardNav from "../components/CardNav";
import { Outlet } from "react-router-dom";


const Layout = () => {

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
      getCategories();
    },[])


  return (
       <div className="relative w-full flex flex-col items-center font-michroma justify-center">
      <div className="sticky top-0 w-[90%] max-w-[800px] z-[99]">
        <CardNav categories={categories} />
      </div>
      <main className=" w-full">
        <Outlet />
      </main>
    </div>
  )
}

export default Layout