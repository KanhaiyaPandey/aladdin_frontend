import CartPageClient from "./CartPageClient";

export default async function CartPage() {
  return (
    <div className="w-full min-h-screen flex flex-col items-center font-body pt-24 pb-8">
        <h1 className="text-2xl font-semibold mb-6">Your Shopping Cart</h1>
        <CartPageClient/>
     </div>
  );
}