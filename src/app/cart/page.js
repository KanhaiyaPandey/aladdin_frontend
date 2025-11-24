import Image from "next/image";
import CartPageClient from "./CartPageClient";

export default async function CartPage() {
  return (
<div className="w-full min-h-screen relative font-body text-white">


  {/* Top background image */}
  <div className="w-full h-80 fixed top-0 left-0 -z-10 flex items-center justify-center">
    <Image
      src="/cartImage.webp"
      alt="cart image"
      fill
      priority
      className="object-cover"
    />
  </div>

  <div className=" h-80 w-full bg-[#302f2f2a] text-3xl px-4  pt-6 z-20 relative flex items-center justify-center">
       <h1 className=" text-4xl uppercase">Cart</h1>
  </div>



  {/* Scrollable Cart Section */}
  <div className="w-full  min-h-screen z-20 bg-white  flex justify-center ">
    <CartPageClient />
  </div>

</div>
  );
}