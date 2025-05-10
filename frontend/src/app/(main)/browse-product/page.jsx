"use client";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Filter,
  Search,
  ChevronDown,
  Grid3X3,
  LayoutList,
  X,
} from "lucide-react";
import ProductCard from "@/app/components/product/ProductCard";
import Button from "@/app/ui/Button";
import axios from "axios";
import Navbar from '@/app/components/navigation/Navbar';
import MobileMenu from '@/app/components/navigation/MobileMenu';
import { toast } from "react-hot-toast";

const BrowseProductsPage = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [products, setProducts] = useState([]);
  const [allProducts, setAllProducts] = useState([]); // Store all products from API
  const [viewMode, setViewMode] = useState("grid");
  const [isFilterMenuOpen, setIsFilterMenuOpen] = useState(false);
  const [filters, setFilters] = useState({
    categories: [],
    priceRange: { min: 0, max: 1000 },
    rating: 0,
    sortBy: "featured",
  });
  const [searchQuery, setSearchQuery] = useState("");
  const [isFilterDrawerOpen, setIsFilterDrawerOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [categories, setCategories] = useState([]); // Store categories from API
  useEffect(() => {
    // Close mobile menu on route change
    setIsMobileMenuOpen(false);
    // Scroll to top on route change
    window.scrollTo(0, 0);
  }, []);

  // Fetch products and categories from API
  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);

        // Fetch products
        const productsResponse = await axios.get(
          `${process.env.NEXT_PUBLIC_API_URL}/p/browse`
        );
        setAllProducts(productsResponse.data);
        setProducts(productsResponse.data);

        // Fetch categories
        const categoriesResponse = await axios.get(
          `${process.env.NEXT_PUBLIC_API_URL}/p/browse/categories`
        );
        setCategories(
          categoriesResponse.data.map((name, index) => ({
            id: index.toString(),
            name,
          }))
        );
      } catch (error) {
        console.error("Error fetching data:", error);
        toast.error("Failed to load products");
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  // Effect to filter products based on current filters and search query
  useEffect(() => {
    let filteredProducts = [...allProducts];

    // Filter by search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filteredProducts = filteredProducts.filter(
        (product) =>
          product.name.toLowerCase().includes(query) ||
          (product.description &&
            product.description.toLowerCase().includes(query))
      );
    }

    // Filter by categories
    if (filters.categories.length > 0) {
      filteredProducts = filteredProducts.filter((product) =>
        filters.categories.includes(product.category)
      );
    }

    // Filter by price range
    filteredProducts = filteredProducts.filter(
      (product) =>
        product.price >= filters.priceRange.min &&
        product.price <= filters.priceRange.max
    );

    // Sort products
    switch (filters.sortBy) {
      case "price-low-high":
        filteredProducts.sort((a, b) => a.price - b.price);
        break;
      case "price-high-low":
        filteredProducts.sort((a, b) => b.price - a.price);
        break;
      case "newest":
        filteredProducts.sort(
          (a, b) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
        break;
      // 'featured' is default, no sorting needed
      default:
        break;
    }

    setProducts(filteredProducts);
  }, [filters, searchQuery, allProducts]);

  const toggleCategoryFilter = (categoryName) => {
    setFilters((prev) => {
      const categories = prev.categories.includes(categoryName)
        ? prev.categories.filter((name) => name !== categoryName)
        : [...prev.categories, categoryName];

      return { ...prev, categories };
    });
  };
  const handlePriceChange = (key, value) => {
    setFilters((prev) => ({
      ...prev,
      priceRange: {
        ...prev.priceRange,
        [key]: value,
      },
    }));
  };

  const handleRatingChange = (rating) => {
    setFilters((prev) => ({ ...prev, rating }));
  };

  const handleSortChange = (sortBy) => {
    setFilters((prev) => ({ ...prev, sortBy }));
  };

  const clearFilters = () => {
    setFilters({
      categories: [],
      priceRange: { min: 0, max: 1000 },
      rating: 0,
      sortBy: "featured",
    });
    setSearchQuery("");
  };

  const toggleFilterDrawer = () => {
    setIsFilterDrawerOpen(!isFilterDrawerOpen);
  };

  if (isLoading) {
    return (
      <div className="page-transition min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-500 mx-auto mb-4"></div>
          <p>Loading products...</p>
        </div>
      </div>
    );
  }
    
    
     
  return (
    <div className="page-transition">
      <Navbar onMobileMenuToggle={setIsMobileMenuOpen} isMenuOpen={isMobileMenuOpen} />
      <MobileMenu isOpen={isMobileMenuOpen} onClose={() => setIsMobileMenuOpen(false)} />
       {/* Products Header */}
      <section className="bg-white border-b border-neutral-200 mt-16">
        <div className="container-custom py-8">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center space-y-4 md:space-y-0">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold">All Products</h1>{" "}
              <p className="text-neutral-600">
                Browse our collection of quality products
              </p>{" "}
            </div>

            <div className="w-full md:w-auto flex flex-col md:flex-row space-y-2 md:space-y-0 md:space-x-2">
              {/* Search Bar */}
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search products..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 pr-4 py-2 w-full md:w-64 rounded-lg border border-neutral-300 focus:outline-none focus:ring-2 focus:ring-primary-300 focus:border-primary-500"
                />
                <Search
                  size={18}
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 text-neutral-500"
                />
              </div>

              {/* Mobile Filter Button */}
              <Button
                variant="outline"
                className="md:hidden flex items-center justify-center"
                onClick={toggleFilterDrawer}
                icon={<Filter size={18} />}
              >
                Filters
              </Button>

              {/* Sort Dropdown */}
              <div className="relative">
                <button
                  onClick={() => setIsFilterMenuOpen(!isFilterMenuOpen)}
                  className="px-4 py-2 rounded-lg border border-neutral-300 bg-white flex items-center justify-between w-full md:w-56 focus:outline-none focus:ring-2 focus:ring-primary-300 focus:border-primary-500"
                >
                  <span>
                    {filters.sortBy === "featured" && "Featured"}
                    {filters.sortBy === "price-low-high" &&
                      "Price: Low to High"}
                    {filters.sortBy === "price-high-low" &&
                      "Price: High to Low"}
                    {filters.sortBy === "newest" && "Newest Arrivals"}
                    {filters.sortBy === "rating" && "Highest Rated"}
                  </span>
                  <ChevronDown size={16} />
                </button>

                {isFilterMenuOpen && (
                  <div className="absolute right-0 mt-2 w-56 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-10">
                    <div className="py-1">
                      <button
                        onClick={() => {
                          handleSortChange("featured");
                          setIsFilterMenuOpen(false);
                        }}
                        className="block px-4 py-2 text-sm text-neutral-700 hover:bg-neutral-100 w-full text-left"
                      >
                        Featured
                      </button>
                      <button
                        onClick={() => {
                          handleSortChange("price-low-high");
                          setIsFilterMenuOpen(false);
                        }}
                        className="block px-4 py-2 text-sm text-neutral-700 hover:bg-neutral-100 w-full text-left"
                      >
                        Price: Low to High
                      </button>
                      <button
                        onClick={() => {
                          handleSortChange("price-high-low");
                          setIsFilterMenuOpen(false);
                        }}
                        className="block px-4 py-2 text-sm text-neutral-700 hover:bg-neutral-100 w-full text-left"
                      >
                        Price: High to Low
                      </button>
                      <button
                        onClick={() => {
                          handleSortChange("newest");
                          setIsFilterMenuOpen(false);
                        }}
                        className="block px-4 py-2 text-sm text-neutral-700 hover:bg-neutral-100 w-full text-left"
                      >
                        Newest Arrivals
                      </button>
                      <button
                        onClick={() => {
                          handleSortChange("rating");
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

              {/* View Mode Buttons */}
              <div className="hidden md:flex border border-neutral-300 rounded-lg overflow-hidden">
                <button
                  onClick={() => setViewMode("grid")}
                  className={`p-2 ${
                    viewMode === "grid" ? "bg-neutral-100" : "bg-white"
                  }`}
                  title="Grid view"
                >
                  <Grid3X3 size={20} className="text-neutral-700" />
                </button>
                <button
                  onClick={() => setViewMode("list")}
                  className={`p-2 ${
                    viewMode === "list" ? "bg-neutral-100" : "bg-white"
                  }`}
                  title="List view"
                >
                  <LayoutList size={20} className="text-neutral-700" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>
      {/* Mobile Filter Drawer */}
      {isFilterDrawerOpen && (
        <div className="fixed inset-0 z-50 overflow-hidden">
          <div
            className="absolute inset-0 bg-black bg-opacity-50"
            onClick={toggleFilterDrawer}
          ></div>

          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ duration: 0.3 }}
            className="absolute inset-y-0 right-0 max-w-xs w-full bg-white shadow-xl overflow-y-auto"
          >
            <div className="p-4 border-b border-neutral-200 flex justify-between items-center">
              <h3 className="text-lg font-semibold">Filters</h3>
              <button onClick={toggleFilterDrawer} className="p-1">
                <X size={20} className="text-neutral-500" />
              </button>
            </div>

            <div className="p-4">
              <div className="mb-6">
                <h4 className="font-medium mb-2">Categories</h4>
                <div className="space-y-2">
                  {categories.map((category) => (
                    <div key={category.id} className="flex items-center">
                      <input
                        type="checkbox"
                        id={`mobile-category-${category.id}`}
                        checked={filters.categories.includes(category.id)}
                        onChange={() => toggleCategoryFilter(category.id)}
                        className="h-4 w-4 text-primary-500 border-neutral-300 rounded focus:ring-primary-500"
                      />
                      <label
                        htmlFor={`mobile-category-${category.id}`}
                        className="ml-2 text-neutral-700"
                      >
                        {category.name}
                      </label>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mb-6">
                <h4 className="font-medium mb-2">Price Range</h4>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label
                      htmlFor="mobile-price-min"
                      className="block text-sm text-neutral-600 mb-1"
                    >
                      Min ($)
                    </label>
                    <input
                      type="number"
                      id="mobile-price-min"
                      min="0"
                      value={filters.priceRange.min}
                      onChange={(e) =>
                        handlePriceChange("min", parseInt(e.target.value))
                      }
                      className="w-full px-3 py-2 rounded-lg border border-neutral-300 focus:outline-none focus:ring-2 focus:ring-primary-300 focus:border-primary-500"
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="mobile-price-max"
                      className="block text-sm text-neutral-600 mb-1"
                    >
                      Max ($)
                    </label>
                    <input
                      type="number"
                      id="mobile-price-max"
                      min="0"
                      value={filters.priceRange.max}
                      onChange={(e) =>
                        handlePriceChange("max", parseInt(e.target.value))
                      }
                      className="w-full px-3 py-2 rounded-lg border border-neutral-300 focus:outline-none focus:ring-2 focus:ring-primary-300 focus:border-primary-500"
                    />
                  </div>
                </div>
              </div>

              <div className="mb-6">
                <h4 className="font-medium mb-2">Minimum Rating</h4>
                <div className="flex items-center space-x-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      onClick={() => handleRatingChange(star)}
                      className="p-1"
                    >
                      <svg
                        className={`w-6 h-6 ${
                          star <= filters.rating
                            ? "text-amber-400 fill-amber-400"
                            : "text-neutral-300"
                        }`}
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                      </svg>
                    </button>
                  ))}
                  {filters.rating > 0 && (
                    <button
                      onClick={() => handleRatingChange(0)}
                      className="ml-2 text-sm text-neutral-500 hover:text-neutral-700"
                    >
                      Clear
                    </button>
                  )}
                </div>
              </div>

              <div className="pt-4 flex flex-col space-y-2">
                <Button variant="primary" onClick={toggleFilterDrawer}>
                  Apply Filters
                </Button>
                <Button variant="outline" onClick={clearFilters}>
                  Clear All Filters
                </Button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
      {/* Main Content */}
      <section className="py-8 bg-neutral-50">
        <div className="container-custom">
          <div className="flex flex-col md:flex-row gap-8">
            {/* Filters - Desktop */}
            <div className="hidden md:block w-64 flex-shrink-0">
              <div className="bg-white rounded-xl shadow-sm p-6 sticky top-24">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="font-semibold text-lg">Filters</h3>
                  <button
                    onClick={clearFilters}
                    className="text-sm text-primary-500 hover:text-primary-600"
                  >
                    Clear all
                  </button>
                </div>

                <div className="space-y-6">
                  {/* Categories Filter */}
                  <div>
                    <h4 className="font-medium mb-2">Categories</h4>
                    <div className="space-y-2">
                      {categories.map((category) => (
                        <div key={category.id} className="flex items-center">
                          <input
                            type="checkbox"
                            id={`category-${category.id}`}
                            checked={filters.categories.includes(category.name)}
                            onChange={() => toggleCategoryFilter(category.name)}
                            className="h-4 w-4 text-primary-500 border-neutral-300 rounded focus:ring-primary-500"
                          />
                          <label
                            htmlFor={`category-${category.id}`}
                            className="ml-2 text-neutral-700"
                          >
                            {category.name}
                          </label>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Price Range Filter */}
                  <div>
                    <h4 className="font-medium mb-2">Price Range</h4>
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label
                          htmlFor="price-min"
                          className="block text-sm text-neutral-600 mb-1"
                        >
                          Min ($)
                        </label>
                        <input
                          type="number"
                          id="price-min"
                          min="0"
                          value={filters.priceRange.min}
                          onChange={(e) =>
                            handlePriceChange("min", parseInt(e.target.value))
                          }
                          className="w-full px-3 py-2 rounded-lg border border-neutral-300 focus:outline-none focus:ring-2 focus:ring-primary-300 focus:border-primary-500"
                        />
                      </div>
                      <div>
                        <label
                          htmlFor="price-max"
                          className="block text-sm text-neutral-600 mb-1"
                        >
                          Max ($)
                        </label>
                        <input
                          type="number"
                          id="price-max"
                          min="0"
                          value={filters.priceRange.max}
                          onChange={(e) =>
                            handlePriceChange("max", parseInt(e.target.value))
                          }
                          className="w-full px-3 py-2 rounded-lg border border-neutral-300 focus:outline-none focus:ring-2 focus:ring-primary-300 focus:border-primary-500"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Rating Filter */}
                  <div>
                    <h4 className="font-medium mb-2">Minimum Rating</h4>
                    <div className="flex items-center space-x-1">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          onClick={() => handleRatingChange(star)}
                          className="p-1"
                        >
                          <svg
                            className={`w-6 h-6 ${
                              star <= filters.rating
                                ? "text-amber-400 fill-amber-400"
                                : "text-neutral-300"
                            }`}
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          >
                            <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                          </svg>
                        </button>
                      ))}
                      {filters.rating > 0 && (
                        <button
                          onClick={() => handleRatingChange(0)}
                          className="ml-2 text-sm text-neutral-500 hover:text-neutral-700"
                        >
                          Clear
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Products Grid */}
            <div className="flex-grow">
              {/* Results Count */}
              <div className="mb-6">
                <p className="text-neutral-600">
                  Showing{" "}
                  <span className="font-medium text-neutral-900">
                    {products.length}
                  </span>{" "}
                  products
                </p>
              </div>

              {products.length === 0 ? (
                <div className="bg-white rounded-xl p-8 text-center">
                  <h3 className="text-lg font-medium text-neutral-900 mb-2">
                    No products found
                  </h3>
                  <p className="text-neutral-600 mb-4">
                    We couldn&apos;t find any products matching your criteria.
                  </p>
                  <Button variant="outline" onClick={clearFilters}>
                    Clear Filters
                  </Button>
                </div>
              ) : (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className={
                    viewMode === "grid"
                      ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
                      : "space-y-6"
                  }
                >
                  {products.map((product) => (
                    <motion.div
                      key={product._id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      layout
                      transition={{ duration: 0.3 }}
                    >
                      {viewMode === "grid" ? (
                        <ProductCard
                          id={product._id}
                          title={product.name}
                          price={product.price}
                          image={product.imageUrl}
                          description={product.description}
                          category={product.category}
                        />
                      ) : (
                        <div className="card flex flex-col md:flex-row">
                          <div className="md:w-1/3 aspect-square">
                            <img
                              src={product.imageUrl}
                              alt={product.name}
                              className="w-full h-full object-cover rounded-t-xl md:rounded-l-xl md:rounded-t-none"
                            />
                          </div>
                          <div className="p-6 flex flex-col flex-grow">
                            <h3 className="text-lg font-medium text-neutral-900 mb-2">
                              {product.name}
                            </h3>
                            <p className="text-neutral-600 mb-4 line-clamp-2">
                              {product.description}
                            </p>
                            <div className="flex items-center mb-4">
                              <span className="font-semibold text-neutral-900 text-lg">
                                ${product.price.toFixed(2)}
                              </span>
                            </div>
                            <div className="mt-auto flex space-x-2">
                              <Button
                                to={`/product-details/${product._id}`}
                                variant="outline"
                                className="flex-1"
                              >
                                View Details
                              </Button>
                              <Button variant="primary" className="flex-1">
                                Add to Cart
                              </Button>
                            </div>
                          </div>
                        </div>
                      )}
                    </motion.div>
                  ))}
                </motion.div>
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default BrowseProductsPage;
// 'use client'
// import { useState, useEffect } from 'react';
// import { motion } from 'framer-motion';
// import { Filter, Search, ChevronDown, Grid3X3, LayoutList, X } from 'lucide-react';
// import ProductCard from '@/app/components/product/ProductCard';

// import Button from '@/app/ui/Button';
// import { mockProducts } from '@/app/constants/mockProducts';
// import { categories } from '@/app/constants/categories';

// const BrowseProductsPage = () => {
//   const [products, setProducts] = useState(mockProducts);
//   const [viewMode, setViewMode] = useState('grid');
//   const [isFilterMenuOpen, setIsFilterMenuOpen] = useState(false);
//   const [filters, setFilters] = useState({
//     categories: [] ,
//     priceRange: { min: 0, max: 1000 },
//     rating: 0,
//     sortBy: 'featured'
//   });

//   // Search state
//   const [searchQuery, setSearchQuery] = useState('');

//   // For mobile filter drawer
//   const [isFilterDrawerOpen, setIsFilterDrawerOpen] = useState(false);

//   // Effect to filter products based on current filters and search query
//   useEffect(() => {
//     let filteredProducts = [...mockProducts];

//     // Filter by search query
//     if (searchQuery) {
//       const query = searchQuery.toLowerCase();
//       filteredProducts = filteredProducts.filter(
//         product => product.title.toLowerCase().includes(query) || product.description.toLowerCase().includes(query)
//       );
//     }

//     // Filter by categories
//     if (filters.categories.length > 0) {
//       filteredProducts = filteredProducts.filter(product =>
//         filters.categories.includes(product.categoryId)
//       );
//     }

//     // Filter by price range
//     filteredProducts = filteredProducts.filter(product =>
//       product.price >= filters.priceRange.min && product.price <= filters.priceRange.max
//     );

//     // Filter by rating
//     if (filters.rating > 0) {
//       filteredProducts = filteredProducts.filter(product =>
//         product.rating >= filters.rating
//       );
//     }

//     // Sort products
//     switch (filters.sortBy) {
//       case 'price-low-high':
//         filteredProducts.sort((a, b) => a.price - b.price);
//         break;
//       case 'price-high-low':
//         filteredProducts.sort((a, b) => b.price - a.price);
//         break;
//       case 'newest':
//         filteredProducts.sort((a, b) =>
//           new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
//         );
//         break;
//       case 'rating':
//         filteredProducts.sort((a, b) => b.rating - a.rating);
//         break;
//       // 'featured' is default, no sorting needed
//       default:
//         break;
//     }

//     setProducts(filteredProducts);
//   }, [filters, searchQuery]);

//   const toggleCategoryFilter = (categoryId) => {
//     setFilters(prev => {
//       const categories = prev.categories.includes(categoryId)
//         ? prev.categories.filter(id => id !== categoryId)
//         : [...prev.categories, categoryId];

//       return { ...prev, categories };
//     });
//   };

//   const handlePriceChange = (key, value) => {
//     setFilters(prev => ({
//       ...prev,
//       priceRange: {
//         ...prev.priceRange,
//         [key]: value
//       }
//     }));
//   };

//   const handleRatingChange = (rating) => {
//     setFilters(prev => ({ ...prev, rating }));
//   };

//   const handleSortChange = (sortBy) => {
//     setFilters(prev => ({ ...prev, sortBy }));
//   };

//   const clearFilters = () => {
//     setFilters({
//       categories: [],
//       priceRange: { min: 0, max: 1000 },
//       rating: 0,
//       sortBy: 'featured'
//     });
//     setSearchQuery('');
//   };

//   const toggleFilterDrawer = () => {
//     setIsFilterDrawerOpen(!isFilterDrawerOpen);
//   };

//   return (
//     <div className="page-transition">
//       {/* Products Header */}
//       <section className="bg-white border-b border-neutral-200">
//         <div className="container-custom py-8">
//           <div className="flex flex-col md:flex-row justify-between items-start md:items-center space-y-4 md:space-y-0">
//             <div>
//               <h1 className="text-2xl md:text-3xl font-bold">All Products</h1>
//               <p className="text-neutral-600">Browse our collection of quality products</p>
//             </div>

//             <div className="w-full md:w-auto flex flex-col md:flex-row space-y-2 md:space-y-0 md:space-x-2">
//               {/* Search Bar */}
//               <div className="relative">
//                 <input
//                   type="text"
//                   placeholder="Search products..."
//                   value={searchQuery}
//                   onChange={(e) => setSearchQuery(e.target.value)}
//                   className="pl-10 pr-4 py-2 w-full md:w-64 rounded-lg border border-neutral-300 focus:outline-none focus:ring-2 focus:ring-primary-300 focus:border-primary-500"
//                 />
//                 <Search size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-neutral-500" />
//               </div>

//               {/* Mobile Filter Button */}
//               <Button
//                 variant="outline"
//                 className="md:hidden flex items-center justify-center"
//                 onClick={toggleFilterDrawer}
//                 icon={<Filter size={18} />}
//               >
//                 Filters
//               </Button>

//               {/* Sort Dropdown */}
//               <div className="relative">
//                 <button
//                   onClick={() => setIsFilterMenuOpen(!isFilterMenuOpen)}
//                   className="px-4 py-2 rounded-lg border border-neutral-300 bg-white flex items-center justify-between w-full md:w-56 focus:outline-none focus:ring-2 focus:ring-primary-300 focus:border-primary-500"
//                 >
//                   <span>
//                     {filters.sortBy === 'featured' && 'Featured'}
//                     {filters.sortBy === 'price-low-high' && 'Price: Low to High'}
//                     {filters.sortBy === 'price-high-low' && 'Price: High to Low'}
//                     {filters.sortBy === 'newest' && 'Newest Arrivals'}
//                     {filters.sortBy === 'rating' && 'Highest Rated'}
//                   </span>
//                   <ChevronDown size={16} />
//                 </button>

//                 {isFilterMenuOpen && (
//                   <div className="absolute right-0 mt-2 w-56 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-10">
//                     <div className="py-1">
//                       <button
//                         onClick={() => {
//                           handleSortChange('featured');
//                           setIsFilterMenuOpen(false);
//                         }}
//                         className="block px-4 py-2 text-sm text-neutral-700 hover:bg-neutral-100 w-full text-left"
//                       >
//                         Featured
//                       </button>
//                       <button
//                         onClick={() => {
//                           handleSortChange('price-low-high');
//                           setIsFilterMenuOpen(false);
//                         }}
//                         className="block px-4 py-2 text-sm text-neutral-700 hover:bg-neutral-100 w-full text-left"
//                       >
//                         Price: Low to High
//                       </button>
//                       <button
//                         onClick={() => {
//                           handleSortChange('price-high-low');
//                           setIsFilterMenuOpen(false);
//                         }}
//                         className="block px-4 py-2 text-sm text-neutral-700 hover:bg-neutral-100 w-full text-left"
//                       >
//                         Price: High to Low
//                       </button>
//                       <button
//                         onClick={() => {
//                           handleSortChange('newest');
//                           setIsFilterMenuOpen(false);
//                         }}
//                         className="block px-4 py-2 text-sm text-neutral-700 hover:bg-neutral-100 w-full text-left"
//                       >
//                         Newest Arrivals
//                       </button>
//                       <button
//                         onClick={() => {
//                           handleSortChange('rating');
//                           setIsFilterMenuOpen(false);
//                         }}
//                         className="block px-4 py-2 text-sm text-neutral-700 hover:bg-neutral-100 w-full text-left"
//                       >
//                         Highest Rated
//                       </button>
//                     </div>
//                   </div>
//                 )}
//               </div>

//               {/* View Mode Buttons */}
//               <div className="hidden md:flex border border-neutral-300 rounded-lg overflow-hidden">
//                 <button
//                   onClick={() => setViewMode('grid')}
//                   className={`p-2 ${viewMode === 'grid' ? 'bg-neutral-100' : 'bg-white'}`}
//                   title="Grid view"
//                 >
//                   <Grid3X3 size={20} className="text-neutral-700" />
//                 </button>
//                 <button
//                   onClick={() => setViewMode('list')}
//                   className={`p-2 ${viewMode === 'list' ? 'bg-neutral-100' : 'bg-white'}`}
//                   title="List view"
//                 >
//                   <LayoutList size={20} className="text-neutral-700" />
//                 </button>
//               </div>
//             </div>
//           </div>
//         </div>
//       </section>

//       {/* Mobile Filter Drawer */}
//       {isFilterDrawerOpen && (
//         <div className="fixed inset-0 z-50 overflow-hidden">
//           <div className="absolute inset-0 bg-black bg-opacity-50" onClick={toggleFilterDrawer}></div>

//           <motion.div
//             initial={{ x: '100%' }}
//             animate={{ x: 0 }}
//             exit={{ x: '100%' }}
//             transition={{ duration: 0.3 }}
//             className="absolute inset-y-0 right-0 max-w-xs w-full bg-white shadow-xl overflow-y-auto"
//           >
//             <div className="p-4 border-b border-neutral-200 flex justify-between items-center">
//               <h3 className="text-lg font-semibold">Filters</h3>
//               <button onClick={toggleFilterDrawer} className="p-1">
//                 <X size={20} className="text-neutral-500" />
//               </button>
//             </div>

//             <div className="p-4">
//               <div className="mb-6">
//                 <h4 className="font-medium mb-2">Categories</h4>
//                 <div className="space-y-2">
//                   {categories.map((category) => (
//                     <div key={category.id} className="flex items-center">
//                       <input
//                         type="checkbox"
//                         id={`mobile-category-${category.id}`}
//                         checked={filters.categories.includes(category.id)}
//                         onChange={() => toggleCategoryFilter(category.id)}
//                         className="h-4 w-4 text-primary-500 border-neutral-300 rounded focus:ring-primary-500"
//                       />
//                       <label htmlFor={`mobile-category-${category.id}`} className="ml-2 text-neutral-700">
//                         {category.name}
//                       </label>
//                     </div>
//                   ))}
//                 </div>
//               </div>

//               <div className="mb-6">
//                 <h4 className="font-medium mb-2">Price Range</h4>
//                 <div className="grid grid-cols-2 gap-2">
//                   <div>
//                     <label htmlFor="mobile-price-min" className="block text-sm text-neutral-600 mb-1">Min ($)</label>
//                     <input
//                       type="number"
//                       id="mobile-price-min"
//                       min="0"
//                       value={filters.priceRange.min}
//                       onChange={(e) => handlePriceChange('min', parseInt(e.target.value))}
//                       className="w-full px-3 py-2 rounded-lg border border-neutral-300 focus:outline-none focus:ring-2 focus:ring-primary-300 focus:border-primary-500"
//                     />
//                   </div>
//                   <div>
//                     <label htmlFor="mobile-price-max" className="block text-sm text-neutral-600 mb-1">Max ($)</label>
//                     <input
//                       type="number"
//                       id="mobile-price-max"
//                       min="0"
//                       value={filters.priceRange.max}
//                       onChange={(e) => handlePriceChange('max', parseInt(e.target.value))}
//                       className="w-full px-3 py-2 rounded-lg border border-neutral-300 focus:outline-none focus:ring-2 focus:ring-primary-300 focus:border-primary-500"
//                     />
//                   </div>
//                 </div>
//               </div>

//               <div className="mb-6">
//                 <h4 className="font-medium mb-2">Minimum Rating</h4>
//                 <div className="flex items-center space-x-1">
//                   {[1, 2, 3, 4, 5].map((star) => (
//                     <button
//                       key={star}
//                       onClick={() => handleRatingChange(star)}
//                       className="p-1"
//                     >
//                       <svg
//                         className={`w-6 h-6 ${
//                           star <= filters.rating ? 'text-amber-400 fill-amber-400' : 'text-neutral-300'
//                         }`}
//                         xmlns="http://www.w3.org/2000/svg"
//                         viewBox="0 0 24 24"
//                         stroke="currentColor"
//                         strokeWidth="2"
//                         strokeLinecap="round"
//                         strokeLinejoin="round"
//                       >
//                         <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
//                       </svg>
//                     </button>
//                   ))}
//                   {filters.rating > 0 && (
//                     <button
//                       onClick={() => handleRatingChange(0)}
//                       className="ml-2 text-sm text-neutral-500 hover:text-neutral-700"
//                     >
//                       Clear
//                     </button>
//                   )}
//                 </div>
//               </div>

//               <div className="pt-4 flex flex-col space-y-2">
//                 <Button variant="primary" onClick={toggleFilterDrawer}>
//                   Apply Filters
//                 </Button>
//                 <Button variant="outline" onClick={clearFilters}>
//                   Clear All Filters
//                 </Button>
//               </div>
//             </div>
//           </motion.div>
//         </div>
//       )}

//       {/* Main Content */}
//       <section className="py-8 bg-neutral-50">
//         <div className="container-custom">
//           <div className="flex flex-col md:flex-row gap-8">
//             {/* Filters - Desktop */}
//             <div className="hidden md:block w-64 flex-shrink-0">
//               <div className="bg-white rounded-xl shadow-sm p-6 sticky top-24">
//                 <div className="flex justify-between items-center mb-4">
//                   <h3 className="font-semibold text-lg">Filters</h3>
//                   <button
//                     onClick={clearFilters}
//                     className="text-sm text-primary-500 hover:text-primary-600"
//                   >
//                     Clear all
//                   </button>
//                 </div>

//                 <div className="space-y-6">
//                   {/* Categories Filter */}
//                   <div>
//                     <h4 className="font-medium mb-2">Categories</h4>
//                     <div className="space-y-2">
//                       {categories.map((category) => (
//                         <div key={category.id} className="flex items-center">
//                           <input
//                             type="checkbox"
//                             id={`category-${category.id}`}
//                             checked={filters.categories.includes(category.id)}
//                             onChange={() => toggleCategoryFilter(category.id)}
//                             className="h-4 w-4 text-primary-500 border-neutral-300 rounded focus:ring-primary-500"
//                           />
//                           <label htmlFor={`category-${category.id}`} className="ml-2 text-neutral-700">
//                             {category.name}
//                           </label>
//                         </div>
//                       ))}
//                     </div>
//                   </div>

//                   {/* Price Range Filter */}
//                   <div>
//                     <h4 className="font-medium mb-2">Price Range</h4>
//                     <div className="grid grid-cols-2 gap-2">
//                       <div>
//                         <label htmlFor="price-min" className="block text-sm text-neutral-600 mb-1">Min ($)</label>
//                         <input
//                           type="number"
//                           id="price-min"
//                           min="0"
//                           value={filters.priceRange.min}
//                           onChange={(e) => handlePriceChange('min', parseInt(e.target.value))}
//                           className="w-full px-3 py-2 rounded-lg border border-neutral-300 focus:outline-none focus:ring-2 focus:ring-primary-300 focus:border-primary-500"
//                         />
//                       </div>
//                       <div>
//                         <label htmlFor="price-max" className="block text-sm text-neutral-600 mb-1">Max ($)</label>
//                         <input
//                           type="number"
//                           id="price-max"
//                           min="0"
//                           value={filters.priceRange.max}
//                           onChange={(e) => handlePriceChange('max', parseInt(e.target.value))}
//                           className="w-full px-3 py-2 rounded-lg border border-neutral-300 focus:outline-none focus:ring-2 focus:ring-primary-300 focus:border-primary-500"
//                         />
//                       </div>
//                     </div>
//                   </div>

//                   {/* Rating Filter */}
//                   <div>
//                     <h4 className="font-medium mb-2">Minimum Rating</h4>
//                     <div className="flex items-center space-x-1">
//                       {[1, 2, 3, 4, 5].map((star) => (
//                         <button
//                           key={star}
//                           onClick={() => handleRatingChange(star)}
//                           className="p-1"
//                         >
//                           <svg
//                             className={`w-6 h-6 ${
//                               star <= filters.rating ? 'text-amber-400 fill-amber-400' : 'text-neutral-300'
//                             }`}
//                             xmlns="http://www.w3.org/2000/svg"
//                             viewBox="0 0 24 24"
//                             stroke="currentColor"
//                             strokeWidth="2"
//                             strokeLinecap="round"
//                             strokeLinejoin="round"
//                           >
//                             <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
//                           </svg>
//                         </button>
//                       ))}
//                       {filters.rating > 0 && (
//                         <button
//                           onClick={() => handleRatingChange(0)}
//                           className="ml-2 text-sm text-neutral-500 hover:text-neutral-700"
//                         >
//                           Clear
//                         </button>
//                       )}
//                     </div>
//                   </div>
//                 </div>
//               </div>
//             </div>

//             {/* Products Grid */}
//             <div className="flex-grow">
//               {/* Results Count */}
//               <div className="mb-6">
//                 <p className="text-neutral-600">
//                   Showing <span className="font-medium text-neutral-900">{products.length}</span> products
//                 </p>
//               </div>

//               {products.length === 0 ? (
//                 <div className="bg-white rounded-xl p-8 text-center">
//                   <h3 className="text-lg font-medium text-neutral-900 mb-2">No products found</h3>
//                   <p className="text-neutral-600 mb-4">
//                     We couldn't find any products matching your criteria.
//                   </p>
//                   <Button variant="outline" onClick={clearFilters}>
//                     Clear Filters
//                   </Button>
//                 </div>
//               ) : (
//                 <motion.div
//                   initial={{ opacity: 0 }}
//                   animate={{ opacity: 1 }}
//                   className={
//                     viewMode === 'grid'
//                       ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
//                       : "space-y-6"
//                   }
//                 >
//                   {products.map((product) => (
//                     <motion.div
//                       key={product.id}
//                       initial={{ opacity: 0 }}
//                       animate={{ opacity: 1 }}
//                       layout
//                       transition={{ duration: 0.3 }}
//                     >
//                       {viewMode === 'grid' ? (
//                         <ProductCard
//                           id={product.id}
//                           title={product.title}
//                           price={product.price}
//                           originalPrice={product.originalPrice}
//                           image={product.image}
//                           rating={product.rating}
//                           reviewCount={product.reviewCount}
//                           isFeatured={product.featured}
//                           isNew={product.isNew}
//                           isSale={product.isSale}
//                         />
//                       ) : (
//                         <div className="card flex flex-col md:flex-row">
//                           <div className="md:w-1/3 aspect-square">
//                             <img
//                               src={product.image}
//                               alt={product.title}
//                               className="w-full h-full object-cover rounded-t-xl md:rounded-l-xl md:rounded-t-none"
//                             />
//                           </div>
//                           <div className="p-6 flex flex-col flex-grow">
//                             <h3 className="text-lg font-medium text-neutral-900 mb-2">
//                               {product.title}
//                             </h3>
//                             <p className="text-neutral-600 mb-4 line-clamp-2">
//                               {product.description}
//                             </p>
//                             <div className="flex items-center mb-2">
//                               <div className="flex items-center">
//                                 {[...Array(5)].map((_, i) => (
//                                   <svg
//                                     key={i}
//                                     className={`w-4 h-4 ${
//                                       i < Math.floor(product.rating)
//                                         ? 'text-amber-400 fill-amber-400'
//                                         : 'text-neutral-300'
//                                     }`}
//                                     xmlns="http://www.w3.org/2000/svg"
//                                     viewBox="0 0 24 24"
//                                     stroke="currentColor"
//                                     strokeWidth="2"
//                                     strokeLinecap="round"
//                                     strokeLinejoin="round"
//                                   >
//                                     <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
//                                   </svg>
//                                 ))}
//                               </div>
//                               <span className="text-sm text-neutral-500 ml-1">
//                                 ({product.reviewCount})
//                               </span>
//                             </div>
//                             <div className="flex items-center mb-4">
//                               <span className="font-semibold text-neutral-900 text-lg">${product.price.toFixed(2)}</span>
//                               {product.originalPrice && (
//                                 <span className="text-neutral-500 text-sm line-through ml-2">
//                                   ${product.originalPrice.toFixed(2)}
//                                 </span>
//                               )}
//                             </div>
//                             <div className="mt-auto flex space-x-2">
//                               <Button
//                                 to={`/product-details/${product.id}`}
//                                 variant="outline"
//                                 className="flex-1"
//                               >
//                                 View Details
//                               </Button>
//                               <Button variant="primary" className="flex-1">
//                                 Add to Cart
//                               </Button>
//                             </div>
//                           </div>
//                         </div>
//                       )}
//                     </motion.div>
//                   ))}
//                 </motion.div>
//               )}
//             </div>
//           </div>
//         </div>
//       </section>
//     </div>
//   );
// };

// export default BrowseProductsPage;
