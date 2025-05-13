"use client";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Star,
  Heart,
  Share2,
  ShoppingCart,
  Check,
  ChevronRight,
  Truck,
  Shield,
  RotateCcw,
} from "lucide-react";
import ProductCard from "@/app/components/product/ProductCard";
import Button from "@/app/ui/Button";
import { useParams } from "next/navigation";
import Link from "next/link";
import axios from "axios";
import { toast } from "react-hot-toast";
import { useCart } from "@/context/CartContext";

const ProductDetailsPage = () => {
  const { addToCart, cartitems } = useCart();
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [selectedImage, setSelectedImage] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [specifications, setSpecifications] = useState({});

  // Fetch product data
  useEffect(() => {
    const fetchProductData = async () => {
      try {
        setLoading(true);
        setError(null);

        // First fetch the product details
        const productResponse = await axios.get(
          `${process.env.NEXT_PUBLIC_API_URL}/p/getbyid/${id}`
        );

        if (!productResponse.data) {
          throw new Error("Product not found");
        }

        setProduct(productResponse.data);
        setSelectedImage(productResponse.data.imageUrl);

        // Parse specifications if they exist
        if (productResponse.data.specifications) {
          try {
            const specs =
              typeof productResponse.data.specifications === "string"
                ? JSON.parse(productResponse.data.specifications)
                : productResponse.data.specifications;
            setSpecifications(specs);
          } catch (e) {
            console.error("Error parsing specifications:", e);
          }
        }

        // Then fetch related products
        try {
          if (productResponse.data.category) {
            const relatedResponse = await axios.get(
              `${
                process.env.NEXT_PUBLIC_API_URL
              }/p/browse/category/${encodeURIComponent(
                productResponse.data.category
              )}`
            );
            setRelatedProducts(
              relatedResponse.data
                .filter((p) => p._id !== productResponse.data._id)
                .slice(0, 4)
            );
          }
        } catch (relatedError) {
          console.error("Error fetching related products:", relatedError);
          setRelatedProducts([]);
        }
      } catch (err) {
        console.error("Error fetching product:", err);
        setError(
          err.response?.data?.message || err.message || "Failed to load product"
        );
        toast.error("Failed to load product details");
      } finally {
        setLoading(false);
      }
    };

    fetchProductData();
  }, [id]);

  const handleAddToCart = async () => {
    try {
      const cartItem = {
        productid: product._id,
        quantity,
        price: product.price,
        name: product.name,
        image: product.imageUrl,
      };

      addToCart(cartItem);
      toast.success("Added to cart");
    } catch (err) {
      toast.error("Failed to add to cart");
    }
  };

  // const handleAddToCart = async () => {
  //   try {
  //     const cartItem = {
  //       productid: product._id,
  //       quantity,
  //       price: product.price,
  //       name: product.name,
  //       image: product.imageUrl,
  //     };

  //     console.log(cartItem);
  //     // Save to localStorage or send to backend
  //     const existing = JSON.parse(localStorage.getItem('Cart') || '[]');
  //     console.log(existing);
  //     localStorage.setItem('Cart', JSON.stringify([...existing, cartItem]));
  //     toast.success('Added to cart');
  //   } catch (err) {
  //     toast.error('Failed to add to cart');
  //   }
  // };

  const handleQuantityChange = (value) => {
    if (value >= 1 && value <= (product?.stock || 1)) {
      setQuantity(value);
    }
  };

  const decrementQuantity = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1);
    }
  };

  const incrementQuantity = () => {
    if (product && quantity < product.stock) {
      setQuantity(quantity + 1);
    }
  };

  if (loading) {
    return (
      <div className="container-custom py-20 text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-500 mx-auto mb-4"></div>
        <p>Loading product details...</p>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="container-custom py-20 text-center">
        <h1 className="text-2xl font-bold mb-4">Product Not Found</h1>
        <p className="mb-8">
          {error || "We couldn't find the product you're looking for."}
        </p>
        <Button href="/browse-product" variant="primary">
          Browse Products
        </Button>
      </div>
    );
  }

  // Debugging logs (remove in production)
  console.log("Product data:", product);
  console.log("Related products:", relatedProducts);

  // Calculate if product is new (less than 7 days old)
  const isNew = product.createdAt
    ? new Date(product.createdAt) >
      new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
    : false;

  // For demo purposes - you might want to get these from your API
  const rating = 4; // Default rating if not provided
  const reviewCount = 12; // Default review count if not provided

  return (
    <div className="page-transition">
      {/* Breadcrumbs */}
      <section className="bg-white border-b border-neutral-200">
        <div className="container-custom py-4">
          <nav className="flex items-center text-sm">
            <Link href="/" className="text-neutral-500 hover:text-primary-500">
              Home
            </Link>
            <ChevronRight size={16} className="mx-2 text-neutral-400" />
            <Link
              href="/browse-product"
              className="text-neutral-500 hover:text-primary-500"
            >
              Products
            </Link>
            {product.category && (
              <>
                <ChevronRight size={16} className="mx-2 text-neutral-400" />
                <Link
                  href={`/category/${product.category}`}
                  className="text-neutral-500 hover:text-primary-500"
                >
                  {product.category}
                </Link>
              </>
            )}
            <ChevronRight size={16} className="mx-2 text-neutral-400" />
            <span className="text-neutral-900 font-medium">{product.name}</span>
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
                    alt={product.name}
                    className="w-full h-full object-cover"
                  />
                </motion.div>

                {/* If you have multiple images, you can display them here */}
                {/* {product.images && product.images.length > 1 && (
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
                          alt={`${product.name} - View ${index + 1}`}
                          className="w-full h-full object-cover"
                        />
                      </button>
                    ))}
                  </div>
                )} */}
              </div>

              {/* Product Info */}
              <div className="lg:col-span-2">
                {/* Product badges */}
                <div className="flex flex-wrap gap-2 mb-3">
                  {isNew && (
                    <span className="bg-primary-500 text-white text-xs font-medium px-2.5 py-0.5 rounded">
                      New
                    </span>
                  )}
                  {product.stock < 10 && product.stock > 0 && (
                    <span className="bg-error-500 text-white text-xs font-medium px-2.5 py-0.5 rounded">
                      Low Stock
                    </span>
                  )}
                  {product.stock <= 0 && (
                    <span className="bg-error-500 text-white text-xs font-medium px-2.5 py-0.5 rounded">
                      Out of Stock
                    </span>
                  )}
                </div>

                {/* Product title and rating */}
                <h1 className="text-2xl md:text-3xl font-bold text-neutral-900 mb-2">
                  {product.name}
                </h1>

                <div className="flex items-center mb-4">
                  <div className="flex items-center">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        size={18}
                        className={`${
                          i < Math.floor(rating)
                            ? "text-amber-400 fill-amber-400"
                            : "text-neutral-300"
                        }`}
                      />
                    ))}
                  </div>
                  <span className="text-sm text-neutral-600 ml-2">
                    {rating.toFixed(1)} ({reviewCount} reviews)
                  </span>
                </div>

                {/* Product price */}
                <div className="flex items-baseline mb-6">
                  <span className="text-3xl font-bold text-neutral-900">
                    ${product.price.toFixed(2)}
                  </span>
                </div>

                {/* Product description */}
                <p className="text-neutral-600 mb-6">{product.description}</p>

                {/* Product actions */}
                <div className="border-t border-b border-neutral-200 py-6 mb-6">
                  {/* Stock status */}
                  <div className="flex items-center mb-4">
                    <div
                      className={`w-3 h-3 rounded-full mr-2 ${
                        product.stock > 0 ? "bg-success-500" : "bg-error-500"
                      }`}
                    ></div>
                    <span
                      className={`text-sm ${
                        product.stock > 0
                          ? "text-success-500"
                          : "text-error-500"
                      }`}
                    >
                      {product.stock > 0
                        ? `In Stock (${product.stock} available)`
                        : "Out of Stock"}
                    </span>
                  </div>

                  {/* Quantity selector */}
                  {product.stock > 0 && (
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
                          onChange={(e) =>
                            handleQuantityChange(parseInt(e.target.value))
                          }
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
                  )}

                  {/* Action buttons */}
                  <div className="flex flex-col sm:flex-row gap-3">
                    <Button
                      onClick={handleAddToCart}
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
                {cartitems.some((item) => item.productid === product._id) && (
                  <div className="text-success-500 text-sm mb-4 flex items-center">
                    <Check size={16} className="mr-1" /> This item is in your
                    cart
                  </div>
                )}

                {/* Product features/benefits */}
                <div className="space-y-3 mb-6">
                  <div className="flex items-start">
                    <div className="flex-shrink-0 h-6 w-6 flex items-center justify-center bg-primary-100 text-primary-600 rounded-full">
                      <Check size={14} />
                    </div>
                    <div className="ml-3">
                      <p className="text-sm text-neutral-600">
                        Free shipping on orders over $50
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <div className="flex-shrink-0 h-6 w-6 flex items-center justify-center bg-primary-100 text-primary-600 rounded-full">
                      <Check size={14} />
                    </div>
                    <div className="ml-3">
                      <p className="text-sm text-neutral-600">
                        Secure payment with leading providers
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <div className="flex-shrink-0 h-6 w-6 flex items-center justify-center bg-primary-100 text-primary-600 rounded-full">
                      <Check size={14} />
                    </div>
                    <div className="ml-3">
                      <p className="text-sm text-neutral-600">
                        30-day money-back guarantee
                      </p>
                    </div>
                  </div>
                </div>

                {/* Delivery & Returns */}
                <div className="bg-neutral-50 rounded-lg p-4 grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="flex items-start">
                    <Truck
                      size={20}
                      className="text-primary-500 mr-2 flex-shrink-0"
                    />
                    <div>
                      <h4 className="text-sm font-medium text-neutral-900 mb-1">
                        Free Delivery
                      </h4>
                      <p className="text-xs text-neutral-600">
                        On orders over $50
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <Shield
                      size={20}
                      className="text-primary-500 mr-2 flex-shrink-0"
                    />
                    <div>
                      <h4 className="text-sm font-medium text-neutral-900 mb-1">
                        Secure Payment
                      </h4>
                      <p className="text-xs text-neutral-600">
                        Multiple payment options
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <RotateCcw
                      size={20}
                      className="text-primary-500 mr-2 flex-shrink-0"
                    />
                    <div>
                      <h4 className="text-sm font-medium text-neutral-900 mb-1">
                        Easy Returns
                      </h4>
                      <p className="text-xs text-neutral-600">
                        30-day return policy
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Product Specifications */}
      {Object.keys(specifications).length > 0 && (
        <section className="py-12 bg-white">
          <div className="container-custom">
            <h2 className="text-2xl font-bold mb-6">Specifications</h2>

            <div className="bg-neutral-50 rounded-xl overflow-hidden">
              <table className="w-full table-auto">
                <tbody>
                  {Object.entries(specifications).map(([key, value], index) => (
                    <tr
                      key={index}
                      className={index % 2 === 0 ? "bg-white" : "bg-neutral-50"}
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
            <h2 className="text-2xl font-bold mb-6">You May Also Like</h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {relatedProducts.map((relatedProduct) => (
                <ProductCard
                  key={relatedProduct._id}
                  id={relatedProduct._id}
                  title={relatedProduct.name}
                  price={relatedProduct.price}
                  image={relatedProduct.imageUrl}
                  description={relatedProduct.description}
                  category={relatedProduct.category}
                  stock={relatedProduct.stock}
                  createdAt={relatedProduct.createdAt}
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
