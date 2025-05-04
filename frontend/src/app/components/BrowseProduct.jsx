'use client'

import React, { useState, useEffect } from 'react'
import Image from 'next/image'
import { Star, ChevronDown, Search, ChevronLeft, ChevronRight, SortAsc, SortDesc } from 'lucide-react'

const products = [
  { id: 1, name: "Cosmic Smartwatch", price: 299.99, category: "Watches", image: "/placeholder.svg?height=200&width=200", rating: 5 },
  { id: 2, name: "Nebula Fitness Tracker", price: 149.99, category: "Trackers", image: "/placeholder.svg?height=200&width=200", rating: 4 },
  { id: 3, name: "Astro Smart Ring", price: 199.99, category: "Accessories", image: "/placeholder.svg?height=200&width=200", rating: 4 },
  { id: 4, name: "Galaxy Sleep Monitor", price: 129.99, category: "Trackers", image: "/placeholder.svg?height=200&width=200", rating: 5 },
  { id: 5, name: "Pulsar Smartwatch", price: 249.99, category: "Watches", image: "/placeholder.svg?height=200&width=200", rating: 4 },
  { id: 6, name: "Quasar Health Band", price: 179.99, category: "Trackers", image: "/placeholder.svg?height=200&width=200", rating: 5 },
  { id: 7, name: "Stellar Smart Necklace", price: 159.99, category: "Accessories", image: "/placeholder.svg?height=200&width=200", rating: 4 },
  { id: 8, name: "Nova Smartwatch", price: 279.99, category: "Watches", image: "/placeholder.svg?height=200&width=200", rating: 5 },
  { id: 9, name: "Orbit Activity Tracker", price: 139.99, category: "Trackers", image: "/placeholder.svg?height=200&width=200", rating: 4 },
  { id: 10, name: "Lunar Sleep Pad", price: 189.99, category: "Accessories", image: "/placeholder.svg?height=200&width=200", rating: 5 },
  { id: 11, name: "Meteor Fitness Watch", price: 229.99, category: "Watches", image: "/placeholder.svg?height=200&width=200", rating: 4 },
  { id: 12, name: "Comet Health Tracker", price: 169.99, category: "Trackers", image: "/placeholder.svg?height=200&width=200", rating: 5 },
]

export default function BrowseProducts() {
  const [filteredProducts, setFilteredProducts] = useState(products)
  const [currentPage, setCurrentPage] = useState(1)
  const [sortOrder, setSortOrder] = useState('asc')
  const [categoryFilter, setCategoryFilter] = useState('All')
  const [searchTerm, setSearchTerm] = useState('')
  const productsPerPage = 8

  useEffect(() => {
    let result = [...products]

    if (categoryFilter !== 'All') {
      result = result.filter(product => product.category === categoryFilter)
    }

    if (searchTerm) {
      result = result.filter(product => 
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.category.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    result.sort((a, b) => {
      if (sortOrder === 'asc') {
        return a.price - b.price
      } else {
        return b.price - a.price
      }
    })

    setFilteredProducts(result)
    setCurrentPage(1)
  }, [categoryFilter, sortOrder, searchTerm])

  const indexOfLastProduct = currentPage * productsPerPage
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage
  const currentProducts = filteredProducts.slice(indexOfFirstProduct, indexOfLastProduct)

  const paginate = (pageNumber) => setCurrentPage(pageNumber)

  const categories = ['All', ...new Set(products.map(product => product.category))]

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 text-gray-100 font-sans ">
      <div className="max-w-7xl mx-auto px-4 py-16 sm:px-6 lg:px-8">
        <h1 className="text-4xl font-bold mb-8 bg-gradient-to-r from-indigo-400 to-purple-500 bg-clip-text text-transparent text-center">
          Explore Our Cosmic Collection
        </h1>

        <div className="flex flex-col md:flex-row justify-between items-center mb-8 space-y-4 md:space-y-0 md:space-x-4">
          <div className="flex items-center space-x-4">
            <div className="relative">
              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="appearance-none bg-gray-800 bg-opacity-50 text-white rounded-full py-2 pl-4 pr-10 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                {categories.map((category) => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </select>
              <ChevronDown className="absolute right-3 top-2.5 text-gray-400 pointer-events-none" size={20} />
            </div>
            <button
              onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
              className="bg-gray-800 bg-opacity-50 text-white rounded-full p-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              aria-label={sortOrder === 'asc' ? 'Sort descending' : 'Sort ascending'}
            >
              {sortOrder === 'asc' ? <SortAsc className="h-5 w-5" /> : <SortDesc className="h-5 w-5" />}
            </button>
          </div>
          <div className="relative w-full md:w-64">
            <input
              type="text"
              placeholder="Search products..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="bg-gray-800 bg-opacity-50 text-white placeholder-gray-400 rounded-full py-2 pl-10 pr-4 w-full focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
            <Search className="absolute left-3 top-2.5 text-gray-400" size={20} />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {currentProducts.map((product) => (
            <div key={product.id} className="bg-gray-800 bg-opacity-50 rounded-lg overflow-hidden transition-transform duration-300 hover:scale-105 backdrop-blur-sm">
              <div className="relative">
                <Image
                  src={product.image}
                  alt={product.name}
                  width={200}
                  height={200}
                  className="w-full h-48 object-cover"
                />
                <div className="absolute top-2 right-2 bg-indigo-600 text-white px-2 py-1 rounded-full text-xs font-semibold">
                  New
                </div>
              </div>
              <div className="p-4 space-y-2">
                <h3 className="text-lg font-semibold text-indigo-300">{product.name}</h3>
                <p className="text-gray-300">${product.price.toFixed(2)}</p>
                <div className="flex items-center">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-4 h-4 ${i < product.rating ? 'fill-yellow-400 stroke-yellow-400' : 'fill-gray-600 stroke-gray-600'}`}
                    />
                  ))}
                  <span className="ml-2 text-sm text-gray-400">({product.rating})</span>
                </div>
                <button className="w-full bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-full font-semibold transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-gray-800">
                  Add to Cart
                </button>
              </div>
            </div>
          ))}
        </div>

        {filteredProducts.length > productsPerPage && (
          <div className="flex justify-center mt-8 space-x-2">
            <button
              onClick={() => paginate(currentPage - 1)}
              disabled={currentPage === 1}
              className="bg-gray-800 bg-opacity-50 text-white px-4 py-2 rounded-full font-semibold transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-gray-900 disabled:opacity-50"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            {Array.from({ length: Math.ceil(filteredProducts.length / productsPerPage) }, (_, i) => (
              <button
                key={i}
                onClick={() => paginate(i + 1)}
                className={`${
                  currentPage === i + 1 ? 'bg-indigo-600' : 'bg-gray-800 bg-opacity-50'
                } text-white px-4 py-2 rounded-full font-semibold transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-gray-900`}
              >
                {i + 1}
              </button>
            ))}
            <button
              onClick={() => paginate(currentPage + 1)}
              disabled={currentPage === Math.ceil(filteredProducts.length / productsPerPage)}
              className="bg-gray-800 bg-opacity-50 text-white px-4 py-2 rounded-full font-semibold transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-gray-900 disabled:opacity-50"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          </div>
        )}
      </div>
    </div>
  )
}