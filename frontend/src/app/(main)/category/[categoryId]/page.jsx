'use client'
import React from 'react';
import { useState, useEffect } from 'react';

import { motion } from 'framer-motion';
import { Filter, ChevronDown, ChevronRight } from 'lucide-react';
import ProductCard from '@/app/components/product/ProductCard';
import Button from '@/app/ui/Button';
import { mockProducts } from '@/app/constants/mockProducts';
import { categories } from '@/app/constants/categories';
import { useParams } from 'next/navigation';
import Link from 'next/link';

const CategoryPage = () => {
  const { categoryId } = useParams();
  
  // Find the category
  const category = categories.find(c => c.id === categoryId);
  
  // If category not found, show error
  if (!category) {
    return (
      <div className="container-custom py-20 text-center">
        <h1 className="text-2xl font-bold mb-4">Category Not Found</h1>
        <p className="mb-8">We couldn&apos;t find the category you&apos;re looking for.</p>
        <Button to="/products" variant="primary">
          Browse Products
        </Button>
      </div>
    );
  }
  // Filter products by category
  const [products, setProducts] = useState(mockProducts.filter(p => p.categoryId === categoryId));
  const [sortBy, setSortBy] = useState('featured');
  const [isFilterMenuOpen, setIsFilterMenuOpen] = useState(false);
  
  // Apply sorting
  useEffect(() => {
    let sortedProducts = [...products];
    
    switch (sortBy) {
      case 'price-low-high':
        sortedProducts.sort((a, b) => a.price - b.price);
        break;
      case 'price-high-low':
        sortedProducts.sort((a, b) => b.price - a.price);
        break;
      case 'newest':
        sortedProducts.sort((a, b) => 
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
        break;
      case 'rating':
        sortedProducts.sort((a, b) => b.rating - a.rating);
        break;
      // 'featured' is default, no sorting needed
      default:
        break;
    }
    
    setProducts(sortedProducts);
  }, [sortBy, categoryId]);
  

  return (
    <div className="page-transition">
      {/* Category Hero */}
      <section className="relative bg-primary-900 text-white">
        <div className="absolute inset-0 bg-gradient-to-r from-primary-900 to-primary-800 opacity-80"></div>
        {category.image && (
          <div 
            className="absolute inset-0 bg-cover bg-center mix-blend-overlay"
            style={{ backgroundImage: `url(${category.image})` }}
          ></div>
        )}
        
        <div className="container-custom relative z-10 py-16">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            {/* Breadcrumbs */}
            <nav className="flex items-center text-sm mb-4">
              <Link href="/" className="text-white/70 hover:text-white">Home</Link>
              <ChevronRight size={16} className="mx-2 text-white/50" />
              <Link href="/browse-product" className="text-white/70 hover:text-white">Products</Link>
              <ChevronRight size={16} className="mx-2 text-white/50" />
              <span className="text-white font-medium">{category.name}</span>
            </nav>
            
            <h1 className="text-4xl md:text-5xl font-bold mb-4">{category.name}</h1>
            <p className="text-lg mb-0 text-white/90 max-w-2xl">
              {category.description}
            </p>
          </motion.div>
        </div>
      </section>

      {/* Category Content */}
      <section className="py-12 bg-neutral-50">
        <div className="container-custom">
          {/* Sort Controls */}
          <div className="flex flex-wrap justify-between items-center mb-8">
            <p className="text-neutral-600 mb-4 md:mb-0">
              Showing <span className="font-medium text-neutral-900">{products.length}</span> products
            </p>
            
            <div className="relative">
              <button 
                onClick={() => setIsFilterMenuOpen(!isFilterMenuOpen)}
                className="px-4 py-2 rounded-lg border border-neutral-300 bg-white flex items-center justify-between w-56 focus:outline-none focus:ring-2 focus:ring-primary-300 focus:border-primary-500"
              >
                <div className="flex items-center">
                  <Filter size={16} className="mr-2 text-neutral-500" />
                  <span>
                    {sortBy === 'featured' && 'Featured'}
                    {sortBy === 'price-low-high' && 'Price: Low to High'}
                    {sortBy === 'price-high-low' && 'Price: High to Low'}
                    {sortBy === 'newest' && 'Newest Arrivals'}
                    {sortBy === 'rating' && 'Highest Rated'}
                  </span>
                </div>
                <ChevronDown size={16} />
              </button>
              
              {isFilterMenuOpen && (
                <div className="absolute right-0 mt-2 w-56 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-10">
                  <div className="py-1">
                    <button 
                      onClick={() => {
                        setSortBy('featured');
                        setIsFilterMenuOpen(false);
                      }}
                      className="block px-4 py-2 text-sm text-neutral-700 hover:bg-neutral-100 w-full text-left"
                    >
                      Featured
                    </button>
                    <button 
                      onClick={() => {
                        setSortBy('price-low-high');
                        setIsFilterMenuOpen(false);
                      }}
                      className="block px-4 py-2 text-sm text-neutral-700 hover:bg-neutral-100 w-full text-left"
                    >
                      Price: Low to High
                    </button>
                    <button 
                      onClick={() => {
                        setSortBy('price-high-low');
                        setIsFilterMenuOpen(false);
                      }}
                      className="block px-4 py-2 text-sm text-neutral-700 hover:bg-neutral-100 w-full text-left"
                    >
                      Price: High to Low
                    </button>
                    <button 
                      onClick={() => {
                        setSortBy('newest');
                        setIsFilterMenuOpen(false);
                      }}
                      className="block px-4 py-2 text-sm text-neutral-700 hover:bg-neutral-100 w-full text-left"
                    >
                      Newest Arrivals
                    </button>
                    <button 
                      onClick={() => {
                        setSortBy('rating');
                        setIsFilterMenuOpen(false);
                      }}
                      className="block px-4 py-2 text-sm text-neutral-700 hover:bg-neutral-100 w-full text-left"
                    >
                      Highest Rated
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
          
          {/* Products Grid */}
          {products.length === 0 ? (
            <div className="bg-white rounded-xl p-8 text-center">
              <h3 className="text-lg font-medium text-neutral-900 mb-2">No products found</h3>
              <p className="text-neutral-600 mb-4">
                We couldn&apos;t find any products in this category right now.
              </p>
              <Button to="/products" variant="primary">
                Browse All Products
              </Button>
            </div>
          ) : (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
            >
              {products.map((product) => (
                <motion.div
                  key={product.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.3 }}
                >
                  <ProductCard 
                    id={product.id}
                    title={product.title}
                    price={product.price}
                    originalPrice={product.originalPrice}
                    image={product.image}
                    rating={product.rating}
                    reviewCount={product.reviewCount}
                    isFeatured={product.featured}
                    isNew={product.isNew}
                    isSale={product.isSale}
                  />
                </motion.div>
              ))}
            </motion.div>
          )}
        </div>
      </section>

      {/* Other Categories */}
      <section className="py-12 bg-white">
        <div className="container-custom">
          <h2 className="text-2xl font-bold mb-8">Other Categories You Might Like</h2>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {categories
              .filter(c => c.id !== categoryId)
              .slice(0, 4)
              .map((otherCategory) => (
                <Link 
                  key={otherCategory.id}
                  href={`/category/${otherCategory.id}`}
                  className="group block relative rounded-xl overflow-hidden aspect-video shadow-sm hover:shadow-md transition-shadow duration-200"
                >
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent z-10"></div>
                  <img 
                    src={otherCategory.image} 
                    alt={otherCategory.name}
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                  <div className="absolute bottom-0 left-0 right-0 p-4 z-20">
                    <h3 className="text-xl font-semibold text-white mb-1">{otherCategory.name}</h3>
                    <p className="text-white/80 text-sm hidden sm:block">{otherCategory.description.substring(0, 60)}...</p>
                  </div>
                </Link>
              ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default CategoryPage;