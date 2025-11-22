'use client'

import React from 'react'
import { FcGoogle } from "react-icons/fc";
import { FaApple } from "react-icons/fa";
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { authFetch } from '@/utils/helpers';



const Login = () => {
    const params = useSearchParams();
    const redirectTo = params.get("redirectTo") || "/";

  //   const handleGoogleLogin = () => {
  //     try {
  //       const response = authFetch.get(`/google/login?redirectTo=${redirectTo}`);
  //       const
  //     } catch (error) {
        
  //     }
  // };

  
  return (
    <div className=' w-1/2 flex flex-col h-full items-center justify-center '>
      
      <div className=' flex flex-col w-full gap-2'>
        <Link href={'/'} className=' text-6xl  font-bold font-font-lobster'>ALADDIN</Link>
        <span className=' mt-2'>LOG IN</span>
      </div>
 

        <div className=' flex flex-col gap-2 w-full mt-10 font-slussen'>
            <input type="text" placeholder='Email' className=' p-2 border-b focus:outline-none  focus:ring-0'/>
            <div className=' flex flex-col gap-2 w-full mt-2 '>
            <input type="password" placeholder='Password' className=' p-2 border-b focus:outline-none  focus:ring-0'/>
            <p className=' font-slussen text-xs font-light '>Have you forgotten your password?</p>
            </div>

            <button className=' mt-10 bg-black text-sm font-light  text-white p-2 rounded-md hover:bg-gray-700 transition-all duration-300 ease-in-out'>Log In</button>
             <button className='text-black p-2 text-sm rounded-md font-light border hover:text-gray-400 transition-all duration-300 ease-in-out'>Register</button>
        </div>



        <div className=' flex flex-col gap-2 w-full mt-16 font-slussen'>
           <h1 className=' font-light'>Access with</h1>
           <span className=' text-[10px] text-gray-500'>By logging in with my social login, I agree to link my account in accordance with the Privacy Policy</span>
               <button 
                 onClick={() => {
                    window.location.href = `${process.env.NEXT_PUBLIC_PRODUCTION_OAUTH_REDIRECT_URI}?redirectTo=${redirectTo}`;
                  }}
               className=' border font-light  p-2 text-xs text-gray-700  gap-2 rounded-md  transition-all flex items-center justify-center duration-300 ease-in-out uppercase'>
                <FcGoogle size={18}/>
                 <span>Continue with google</span>
                </button>

             <button className=' border font-light text-gray-700  p-2 text-xs  gap-2 rounded-md  transition-all flex items-center justify-center duration-300 ease-in-out uppercase'>
                <FaApple size={18}/>
                 <span>Continue with Apple</span>
            </button>
        </div>



        

    </div>
  )
}

export default Login