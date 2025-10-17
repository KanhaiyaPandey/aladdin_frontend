import React from 'react'

const ProductsSminner = () => {
  return (
    <div className="flex gap-4 overflow-x-auto py-4">
      {Array.from({ length: 20 }).map((_, idx) => (
        <div
          key={idx}
          className="w-48 h-64 bg-gray-200 rounded-lg animate-pulse flex-shrink-0"
        >
          {/* Simmer placeholder content */}
        </div>
      ))}
    </div>
  )
}

export default ProductsSminner