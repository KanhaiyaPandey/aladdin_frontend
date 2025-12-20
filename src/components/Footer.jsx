"use client";

import React from "react";
import dynamic from "next/dynamic";

const PopupButton = dynamic(
  () => import("react-calendly").then(mod => mod.PopupButton),
  { ssr: false }
);

const Footer = () => {
  return (
    <footer className="bg-neutral-900 text-white px-6 py-10 text-sm w-full">
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

          <button className="w-full bg-white text-black px-4 py-2 rounded mb-3">
            Submit
          </button>

          {/* Calendly Popup */}
          <PopupButton
            url="https://calendly.com/ak8065483"
            rootElement={typeof window !== "undefined" ? document.body : null}
            text="Book Appointment"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
          />
        </div>
      </div>

      <div className="text-center border-t pt-4 text-xs">
        © 2024 HRF™. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;
