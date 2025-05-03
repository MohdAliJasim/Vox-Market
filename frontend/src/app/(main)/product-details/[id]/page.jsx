
'use client';
import { useState } from 'react';

import { motion } from 'framer-motion';
import { Star, Heart, Share2, ShoppingCart, Check, ChevronRight, Truck, Shield, RotateCcw } from 'lucide-react';

import ProductCard from '@/app/components/product/ProductCard';
import Button from '@/app/ui/Button';
import { mockProducts } from '@/app/constants/mockProducts';
import { categories } from '@/app/constants/categories';
import { useParams } from 'next/navigation';
import Link from 'next/link';

const ProductDetailsPage = () => {

  const { id } = useParams();
  // Find the product
  const product = mockProducts.find(p => p.id === id);
  
  // If product not found, show error
  if (!product) {
    return (
      <div className="container-custom py-20 text-center">
        <h1 className="text-2xl font-bold mb-4">Product Not Found</h1>
        <p className="mb-8">We couldn't find the product you're looking for.</p>
        <Button href="/browse-product" variant="primary">
          Browse Products
        </Button>
      </div>
    );
  }
  
  // Find the category
  const category = categories.find(c => c.id === product.categoryId);
  
  // State for selected image
  const [selectedImage, setSelectedImage] = useState(product.image);
  
  // State for quantity
  const [quantity, setQuantity] = useState(1);
  
  // Get related products (same category, excluding current product)
  const relatedProducts = mockProducts
    .filter(p => p.categoryId === product.categoryId && p.id !== product.id)
    .slice(0, 4);
  
  // Handle quantity change
  const handleQuantityChange = (value) => {
    if (value >= 1 && value <= product.stock) {
      setQuantity(value);
    }
  };
  
  const decrementQuantity = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1);
    }
  };
  
  const incrementQuantity = () => {
    if (quantity < product.stock) {
      setQuantity(quantity + 1);
    }
  };

  return (
    <div className="page-transition">
      {/* Breadcrumbs */}
      <section className="bg-white border-b border-neutral-200">
        <div className="container-custom py-4">
          <nav className="flex items-center text-sm">
            <Link href="/" className="text-neutral-500 hover:text-primary-500">Home</Link>
            <ChevronRight size={16} className="mx-2 text-neutral-400" />
            <Link href="/browse-product" className="text-neutral-500 hover:text-primary-500">Products</Link>
            {category && (
              <>
                <ChevronRight size={16} className="mx-2 text-neutral-400" />
                <Link href={`/category/${category.id}`} className="text-neutral-500 hover:text-primary-500">
                  {category.name}
                </Link>
              </>
            )}
            <ChevronRight size={16} className="mx-2 text-neutral-400" />
            <span className="text-neutral-900 font-medium">{product.title}</span>
          </nav>
        </div>
      </section>

      {/* Product Details */}
      <section className="py-12 bg-neutral-50">
        <div className="container-custom">
          <div className="bg-white rounded-xl shadow-sm overflow-hidden">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 p-6 md:p-8">
              {/* Product Images */}
              <div className="lg:col-span-1">
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  key={selectedImage}
                  className="aspect-square rounded-lg overflow-hidden mb-4"
                >
                  <img 
                    src={selectedImage} 
                    alt={product.title}
                    className="w-full h-full object-cover"
                  />
                </motion.div>
                
                {product.images && product.images.length > 1 && (
                  <div className="grid grid-cols-5 gap-2">
                    {product.images.map((image, index) => (
                      <button
                        key={index}
                        onClick={() => setSelectedImage(image)}
                        className={`aspect-square rounded-md overflow-hidden border-2 ${
                          selectedImage === image ? 'border-primary-500' : 'border-transparent'
                        }`}
                      >
                        <img 
                          src={image} 
                          alt={`${product.title} - View ${index + 1}`}
                          className="w-full h-full object-cover"
                        />
                      </button>
                    ))}
                  </div>
                )}
              </div>
              
              {/* Product Info */}
              <div className="lg:col-span-2">
                {/* Product badges */}
                <div className="flex flex-wrap gap-2 mb-3">
                  {product.isNew && (
                    <span className="bg-primary-500 text-white text-xs font-medium px-2.5 py-0.5 rounded">
                      New
                    </span>
                  )}
                  {product.isSale && product.originalPrice && (
                    <span className="bg-accent-500 text-white text-xs font-medium px-2.5 py-0.5 rounded">
                      Sale {Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}% Off
                    </span>
                  )}
                  {product.featured && (
                    <span className="bg-secondary-500 text-white text-xs font-medium px-2.5 py-0.5 rounded">
                      Featured
                    </span>
                  )}
                  {product.stock < 10 && (
                    <span className="bg-error-500 text-white text-xs font-medium px-2.5 py-0.5 rounded">
                      Low Stock
                    </span>
                  )}
                </div>
                
                {/* Product title and rating */}
                <h1 className="text-2xl md:text-3xl font-bold text-neutral-900 mb-2">{product.title}</h1>
                
                <div className="flex items-center mb-4">
                  <div className="flex items-center">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        size={18}
                        className={`${
                          i < Math.floor(product.rating) 
                            ? 'text-amber-400 fill-amber-400' 
                            : 'text-neutral-300'
                        }`}
                      />
                    ))}
                  </div>
                  <span className="text-sm text-neutral-600 ml-2">
                    {product.rating.toFixed(1)} ({product.reviewCount} reviews)
                  </span>
                </div>
                
                {/* Product price */}
                <div className="flex items-baseline mb-6">
                  <span className="text-3xl font-bold text-neutral-900">${product.price.toFixed(2)}</span>
                  {product.originalPrice && (
                    <span className="text-lg text-neutral-500 line-through ml-2">
                      ${product.originalPrice.toFixed(2)}
                    </span>
                  )}
                </div>
                
                {/* Product description */}
                <p className="text-neutral-600 mb-6">{product.description}</p>
                
                {/* Product actions */}
                <div className="border-t border-b border-neutral-200 py-6 mb-6">
                  {/* Stock status */}
                  <div className="flex items-center mb-4">
                    <div className={`w-3 h-3 rounded-full mr-2 ${product.stock > 0 ? 'bg-success-500' : 'bg-error-500'}`}></div>
                    <span className={`text-sm ${product.stock > 0 ? 'text-success-500' : 'text-error-500'}`}>
                      {product.stock > 0 ? `In Stock (${product.stock} available)` : 'Out of Stock'}
                    </span>
                  </div>
                  
                  {/* Quantity selector */}
                  <div className="flex items-center mb-4">
                    <span className="text-neutral-700 mr-4">Quantity:</span>
                    <div className="flex items-center border border-neutral-300 rounded-lg">
                      <button 
                        onClick={decrementQuantity}
                        disabled={quantity <= 1}
                        className="px-3 py-2 text-neutral-500 hover:text-neutral-700 disabled:opacity-50"
                      >
                        -
                      </button>
                      <input
                        type="number"
                        min="1"
                        max={product.stock}
                        value={quantity}
                        onChange={(e) => handleQuantityChange(parseInt(e.target.value))}
                        className="w-12 text-center border-x border-neutral-300 py-2 focus:outline-none"
                      />
                      <button 
                        onClick={incrementQuantity}
                        disabled={quantity >= product.stock}
                        className="px-3 py-2 text-neutral-500 hover:text-neutral-700 disabled:opacity-50"
                      >
                        +
                      </button>
                    </div>
                  </div>
                  
                  {/* Action buttons */}
                  <div className="flex flex-col sm:flex-row gap-3">
                    <Button 
                      variant="primary" 
                      size="lg" 
                      fullWidth
                      icon={<ShoppingCart size={20} />}
                      disabled={product.stock === 0}
                    >
                      Add to Cart
                    </Button>
                    <Button 
                      variant="outline" 
                      size="lg" 
                      className="sm:flex-grow-0"
                      icon={<Heart size={20} />}
                    >
                      Wishlist
                    </Button>
                    <Button 
                      variant="outline" 
                      size="lg" 
                      className="sm:flex-grow-0"
                      icon={<Share2 size={20} />}
                    >
                      Share
                    </Button>
                  </div>
                </div>
                
                {/* Product features/benefits */}
                <div className="space-y-3 mb-6">
                  <div className="flex items-start">
                    <div className="flex-shrink-0 h-6 w-6 flex items-center justify-center bg-primary-100 text-primary-600 rounded-full">
                      <Check size={14} />
                    </div>
                    <div className="ml-3">
                      <p className="text-sm text-neutral-600">Free shipping on orders over $50</p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <div className="flex-shrink-0 h-6 w-6 flex items-center justify-center bg-primary-100 text-primary-600 rounded-full">
                      <Check size={14} />
                    </div>
                    <div className="ml-3">
                      <p className="text-sm text-neutral-600">Secure payment with leading providers</p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <div className="flex-shrink-0 h-6 w-6 flex items-center justify-center bg-primary-100 text-primary-600 rounded-full">
                      <Check size={14} />
                    </div>
                    <div className="ml-3">
                      <p className="text-sm text-neutral-600">30-day money-back guarantee</p>
                    </div>
                  </div>
                </div>
                
                {/* Delivery & Returns */}
                <div className="bg-neutral-50 rounded-lg p-4 grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="flex items-start">
                    <Truck size={20} className="text-primary-500 mr-2 flex-shrink-0" />
                    <div>
                      <h4 className="text-sm font-medium text-neutral-900 mb-1">Free Delivery</h4>
                      <p className="text-xs text-neutral-600">On orders over $50</p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <Shield size={20} className="text-primary-500 mr-2 flex-shrink-0" />
                    <div>
                      <h4 className="text-sm font-medium text-neutral-900 mb-1">Secure Payment</h4>
                      <p className="text-xs text-neutral-600">Multiple payment options</p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <RotateCcw size={20} className="text-primary-500 mr-2 flex-shrink-0" />
                    <div>
                      <h4 className="text-sm font-medium text-neutral-900 mb-1">Easy Returns</h4>
                      <p className="text-xs text-neutral-600">30-day return policy</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Product Specifications */}
      {product.specifications && Object.keys(product.specifications).length > 0 && (
        <section className="py-12 bg-white">
          <div className="container-custom">
            <h2 className="text-2xl font-bold mb-6">Specifications</h2>
            
            <div className="bg-neutral-50 rounded-xl overflow-hidden">
              <table className="w-full table-auto">
                <tbody>
                  {Object.entries(product.specifications).map(([key, value], index) => (
                    <tr 
                      key={index} 
                      className={index % 2 === 0 ? 'bg-white' : 'bg-neutral-50'}
                    >
                      <td className="py-3 px-4 border-b border-neutral-200 font-medium text-neutral-700 w-1/3">
                        {key}
                      </td>
                      <td className="py-3 px-4 border-b border-neutral-200 text-neutral-600">
                        {value}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>
      )}

      {/* Related Products */}
      {relatedProducts.length > 0 && (
        <section className="py-12 bg-neutral-50">
          <div className="container-custom">
            <h2 className="text-2xl font-bold mb-6">Related Products</h2>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {relatedProducts.map((relatedProduct) => (
                <ProductCard 
                  key={relatedProduct.id}
                  id={relatedProduct.id}
                  title={relatedProduct.title}
                  price={relatedProduct.price}
                  originalPrice={relatedProduct.originalPrice}
                  image={relatedProduct.image}
                  rating={relatedProduct.rating}
                  reviewCount={relatedProduct.reviewCount}
                  isFeatured={relatedProduct.featured}
                  isNew={relatedProduct.isNew}
                  isSale={relatedProduct.isSale}
                />
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  );
};

export default ProductDetailsPage;