'use client'
import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, ShoppingBag, Shield, Truck, Award, Clock } from 'lucide-react';
import  Button  from '@/app/ui/Button';
import  ProductCard  from '@/app/components/product/ProductCard';
import  SectionHeading  from '@/app/components/common/SectionHeading';
import { categories } from '@/app/constants/categories';
import { mockProducts } from '@/app/constants/mockProducts';
import Link from 'next/link';
import Footer from '@/app/components/navigation/Footer';
import Navbar from './components/navigation/Navbar';
import MobileMenu from './components/navigation/MobileMenu';

const HomePage = () => {

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);


  useEffect(() => {
    // Close mobile menu on route change
    setIsMobileMenuOpen(false);
    // Scroll to top on route change
    window.scrollTo(0, 0);
  }, []);
  // Filter products
  const featuredProducts = mockProducts.filter(product => product.featured).slice(0, 4);
  const newArrivals = mockProducts.filter(product => product.isNew).slice(0, 4);
  const featuredCategories = categories.filter(category => category.featured).slice(0, 4);

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
      },
    },
  };

  return (
    <div className="page-transition">
      <Navbar onMobileMenuToggle={setIsMobileMenuOpen} isMenuOpen={isMobileMenuOpen} />
      <MobileMenu isOpen={isMobileMenuOpen} onClose={() => setIsMobileMenuOpen(false)} />
      {/* Hero Section */}
      <section className="relative bg-primary-900 text-white">
        <div className="absolute inset-0 bg-gradient-to-r from-primary-900 to-primary-800 opacity-90"></div>
        <div className="absolute inset-0 bg-[url('https://images.pexels.com/photos/3965545/pexels-photo-3965545.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2')] bg-cover bg-center mix-blend-overlay"></div>
        
        <div className="container-custom relative z-10 py-20 md:py-32">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-2xl"
          >
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4">Discover Amazing Products</h1>
            <p className="text-lg md:text-xl mb-8 text-white/90">
              Shop the latest trends and products from thousands of trusted sellers.
              Your ultimate marketplace for quality and convenience.
            </p>
            <div className="flex flex-wrap gap-4">
              <Button to="/browse-product" variant="accent" size="lg">
                Shop Now
              </Button>
              <Button to="/seller-signup" variant="outline" size="lg" className="bg-white/10 border-white/20 text-white hover:bg-white/20">
                Become a Seller
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Featured Categories */}
      <section className="py-16 bg-white">
        <div className="container-custom">
          <SectionHeading 
            title="Shop by Category" 
            subtitle="Browse our popular categories and find what you're looking for"
          />
          
          <motion.div 
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
          >
            {featuredCategories.map((category) => (
              <motion.div key={category.id} variants={itemVariants}>
                <Link 
                  href={`/category/${category.id}`} 
                  className="group block relative rounded-xl overflow-hidden aspect-square shadow-sm hover:shadow-md transition-shadow duration-200"
                >
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent z-10"></div>
                  <img 
                    src={category.image} 
                    alt={category.name}
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                  <div className="absolute bottom-0 left-0 right-0 p-4 z-20 transition-transform duration-300 group-hover:translate-y-[-5px]">
                    <h3 className="text-xl font-semibold text-white mb-1">{category.name}</h3>
                    <p className="text-white/80 text-sm">{category.description}</p>
                  </div>
                </Link>
              </motion.div>
            ))}
          </motion.div>
          
          <div className="text-center mt-10">
            <Button to="/categories" variant="outline" className="px-6" icon={<ArrowRight size={16} />}>
              View All Categories
            </Button>
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-16 bg-neutral-50">
        <div className="container-custom">
          <SectionHeading 
            title="Featured Products" 
            subtitle="Handpicked selections from our top sellers"
          />
          
          <motion.div 
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
          >
            {featuredProducts.map((product) => (
              <motion.div key={product.id} variants={itemVariants}>
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
          
          <div className="text-center mt-10">
            <Button to="/browse-product" variant="primary" className="px-6" icon={<ShoppingBag size={16} />}>
              View All Products
            </Button>
          </div>
        </div>
      </section>

      {/* New Arrivals */}
      <section className="py-16 bg-white">
        <div className="container-custom">
          <SectionHeading 
            title="New Arrivals" 
            subtitle="The latest products added to our marketplace"
          />
          
          <motion.div 
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
          >
            {newArrivals.map((product) => (
              <motion.div key={product.id} variants={itemVariants}>
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
          
          <div className="text-center mt-10">
            <Button to="/browse-product?filter=new" variant="outline" className="px-6" icon={<Clock size={16} />}>
              View All New Arrivals
            </Button>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-16 bg-primary-500 text-white">
        <div className="container-custom">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">Ready to Start Selling?</h2>
            <p className="text-lg mb-8 text-white/90">
              Join thousands of sellers who have already started their journey.
              It's free to sign up and only takes a few minutes to get your shop up and running.
            </p>
            <Button to="/seller-signup" variant="accent" size="lg" className="px-8">
              Become a Seller Today
            </Button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-white">
        <div className="container-custom">
          <SectionHeading 
            title="Why Shop With Us?" 
            subtitle="We're committed to providing the best shopping experience"
          />
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-10">
            <div className="flex flex-col items-center text-center p-6 rounded-lg hover:bg-neutral-50 transition-colors duration-200">
              <div className="w-16 h-16 flex items-center justify-center bg-primary-100 text-primary-600 rounded-full mb-4">
                <Truck size={32} />
              </div>
              <h3 className="text-lg font-semibold mb-2">Fast Delivery</h3>
              <p className="text-neutral-600">Quick and reliable shipping options to get your orders delivered on time.</p>
            </div>
            
            <div className="flex flex-col items-center text-center p-6 rounded-lg hover:bg-neutral-50 transition-colors duration-200">
              <div className="w-16 h-16 flex items-center justify-center bg-secondary-100 text-secondary-600 rounded-full mb-4">
                <Shield size={32} />
              </div>
              <h3 className="text-lg font-semibold mb-2">Secure Shopping</h3>
              <p className="text-neutral-600">Your transactions and personal information are protected with advanced security.</p>
            </div>
            
            <div className="flex flex-col items-center text-center p-6 rounded-lg hover:bg-neutral-50 transition-colors duration-200">
              <div className="w-16 h-16 flex items-center justify-center bg-accent-100 text-accent-600 rounded-full mb-4">
                <ArrowRight size={32} />
              </div>
              <h3 className="text-lg font-semibold mb-2">Easy Returns</h3>
              <p className="text-neutral-600">Hassle-free return process if you're not completely satisfied with your purchase.</p>
            </div>
            
            <div className="flex flex-col items-center text-center p-6 rounded-lg hover:bg-neutral-50 transition-colors duration-200">
              <div className="w-16 h-16 flex items-center justify-center bg-success-100 text-success-500 rounded-full mb-4">
                <Award size={32} />
              </div>
              <h3 className="text-lg font-semibold mb-2">Quality Products</h3>
              <p className="text-neutral-600">We ensure all products meet our high standards for quality and authenticity.</p>
            </div>
          </div>
        </div>
      </section>
      <Footer/>
    </div>
  );
};

export default HomePage;