/* eslint-disable no-unused-vars */
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { publicFetch } from "../../utils/helpers";
import Masonry from "../Masonry";
import TiltedCard from "../TiltedCard";
import Link from "next/link";

// Recursive function to flatten all nested subcategories



const items = [
    {
      id: "1",
      img: "https://picsum.photos/id/1015/600/900?grayscale",
      url: "https://example.com/one",
      height: 800,
    },
    {
      id: "2",
      img: "https://picsum.photos/id/1011/600/750?grayscale",
      url: "https://example.com/two",
      height: 500,
    },
    {
      id: "3",
      img: "https://picsum.photos/id/1020/600/800?grayscale",
      url: "https://example.com/three",
      height: 600,
    },

];


const Categories = ({ categories }) => {


  return (

    <div className=" px-4 py-2 grid grid-cols-2 gap-2">

        {categories.slice(0,3).map((category) => (
          <Link key={category._id} className=" w-full  relative" href={`/category/${category?.categoryId}`}>
            <img src={category?.banner} alt="" className=" h-full w-full object-cover" />
          </Link>
        ))}

    </div>
 


  );
};

export default Categories;
