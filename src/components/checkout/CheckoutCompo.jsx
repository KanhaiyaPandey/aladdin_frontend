'use client'

import React, { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useUser } from '@/context/UserContext'
import { motion } from 'framer-motion'
import { Input } from 'antd'

export default function CheckoutCompo() {
  const { user_info } = useUser()
  const router = useRouter()

  return (
    <section className="min-h-screen bg-gray-50 p-4 flex justify-center items-center">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="w-full max-w-3xl"
      >
        <div className="shadow-lg rounded-2xl p-4">
          <div className="space-y-6">
            <h2 className="text-2xl font-semibold">Checkout</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input placeholder="Full Name" className="p-3 rounded-xl" />
              <Input placeholder="Phone Number" className="p-3 rounded-xl" />
              <Input placeholder="Email" className="p-3 rounded-xl" />
              <Input placeholder="Pin Code" className="p-3 rounded-xl" />
              <Input placeholder="City" className="p-3 rounded-xl" />
              <Input placeholder="State" className="p-3 rounded-xl" />
            </div>

            <textarea
              placeholder="Full Address"
              className="w-full p-3 border rounded-xl min-h-[120px]"
            ></textarea>

            <div className="flex justify-end">
              <button className="rounded-2xl px-6 py-3 text-lg">Place Order</button>
            </div>
          </div>
        </div>
      </motion.div>
    </section>
  )
}
