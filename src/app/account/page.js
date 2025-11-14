import AccountPageClient from "./AccountPageClient";

export default async function acountPage() {
// const user_info = await getUserInfo(); 
//   if (!user_info) {
//     redirect("/login");
//   }
  return (
    <div className=" w-full flex items-center justify-center">
      <AccountPageClient />
    </div>
  )
}
