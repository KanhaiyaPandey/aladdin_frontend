"use client";

import CardNav from "../components/CardNav";

export default function LayoutClient({ categories, children }) {
  return (
    <div className="relative w-full flex flex-col items-center font-michroma justify-center">
      <div className="sticky top-0 w-[90%] max-w-[800px] z-[99]">
        <CardNav categories={categories} />
      </div>
      <main className="w-full">{children}</main>
    </div>
  );
}
