import Login from "@/components/auth/Login";
import Image from "next/image";

export default async function LoginPage() {
  return (
    <div className="flex items-center justify-center h-screen">
        <div className=" lg:w-1/2 w-full h-full flex items-center justify-center">
          <Login/>
        </div>
        <div className=" w-1/2 lg:flex hidden flex-col items-center justify-center h-full">
           <img src={'/loginpage.webp'} className=" w-full h-full object-cover" alt="login banner"/>
        </div>
    </div>
  );
}