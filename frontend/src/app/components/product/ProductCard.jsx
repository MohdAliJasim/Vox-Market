
import { Heart, Star, ShoppingCart } from 'lucide-react';
import { motion } from 'framer-motion';
import  Button  from '@/app/ui/Button';
import Link from 'next/link';



const ProductCard = ({
  id,
  title,
  price,
  originalPrice,
  image,
  rating,
  reviewCount,
  isFeatured = false,
  isNew = false,
  isSale = false,
}) => {
  // Calculate discount percentage if original price exists
  const discountPercentage = originalPrice 
    ? Math.round(((originalPrice - price) / originalPrice) * 100) 
    : 0;

  return (
    <motion.div 
      className="group relative"
      whileHover={{ y: -5 }}
      transition={{ type: 'spring', stiffness: 400, damping: 17 }}
    >
      <div className="card h-full flex flex-col">
        {/* Product badges */}
        <div className="absolute top-2 left-2 z-10 flex flex-col gap-2">
          {isNew && (
            <span className="bg-primary-500 text-white text-xs font-medium px-2.5 py-1 rounded">
              New
            </span>
          )}
          {isSale && (
            <span className="bg-accent-500 text-white text-xs font-medium px-2.5 py-1 rounded">
              Sale {discountPercentage}% Off
            </span>
          )}
          {isFeatured && (
            <span className="bg-secondary-500 text-white text-xs font-medium px-2.5 py-1 rounded">
              Featured
            </span>
          )}
        </div>

        {/* Wishlist button */}
        <button className="absolute top-2 right-2 z-10 p-1.5 rounded-full bg-white/80 hover:bg-white text-neutral-600 hover:text-primary-500 transition-colors duration-200 shadow-sm">
          <Heart size={18} />
        </button>

        {/* Product image */}
        <Link href={`/products/${id}`} className="relative overflow-hidden aspect-square">
          <img 
            src={image} 
            alt={title}
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
        </Link>

        {/* Product details */}
        <div className="p-4 flex flex-col flex-grow">
          <Link href={`/products/${id}`}>
            <h3 className="font-medium text-neutral-800 hover:text-primary-500 transition-colors duration-200 line-clamp-2 mb-1">
              {title}
            </h3>
          </Link>

          {/* Product price */}
          <div className="flex items-center mb-2 mt-1">
            <span className="font-semibold text-neutral-900">${price.toFixed(2)}</span>
            {originalPrice && (
              <span className="text-neutral-500 text-sm line-through ml-2">
                ${originalPrice.toFixed(2)}
              </span>
            )}
          </div>

          {/* Product rating */}
          <div className="flex items-center mb-3">
            <div className="flex items-center">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  size={14}
                  className={`${
                    i < Math.floor(rating) 
                      ? 'text-amber-400 fill-amber-400' 
                      : 'text-neutral-300'
                  }`}
                />
              ))}
            </div>
            <span className="text-xs text-neutral-500 ml-1">
              ({reviewCount})
            </span>
          </div>

          {/* Add to cart button */}
          <div className="mt-auto">
            <Button 
              variant="primary" 
              size="sm" 
              fullWidth 
              icon={<ShoppingCart size={16} />}
            >
              Add to Cart
            </Button>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default ProductCard;