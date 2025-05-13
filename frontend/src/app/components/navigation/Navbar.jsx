"use client";
import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import {
  ShoppingCart,
  User,
  Menu,
  X,
  Search,
  Package,
  ChevronDown,
  Store,
} from "lucide-react";
import useAppContext from "@/context/AppContext";

const Navbar = ({
  isMenuOpen,
  onMobileMenuToggle,
  transparentHeader = false,
}) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const pathname = usePathname();
  const isHomePage = pathname === "/";
  const { user, seller, userLogout, sellerLogout } = useAppContext();
  

    
    console.log('Navbar auth state:', { user, seller });
  

  // Handle scroll events to change navbar appearance
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    // Only add scroll listener if we have a transparent header option
    if (isHomePage || transparentHeader) {
      window.addEventListener('scroll', handleScroll);
      // Initialize the state
      handleScroll();
    } else {
      // For non-transparent pages, always show white background
      setIsScrolled(true);
    }

    return () => window.removeEventListener('scroll', handleScroll);
  }, [isHomePage, transparentHeader]);

  // Determine if we should use transparent styling
  const shouldUseTransparentStyle = 
    (isHomePage || transparentHeader) && !isScrolled;

  // Navbar class based on scroll position
  const navbarClasses = `
    fixed top-0 left-0 right-0 z-50 transition-all duration-300
    ${
      shouldUseTransparentStyle
        ? "bg-transparent py-5"
        : "bg-white shadow-md py-3"
    }
  `;

  // Text and icon color based on transparent state
  const textColorClass = shouldUseTransparentStyle
    ? "text-white"
    : "text-neutral-800";
  const hoverTextColorClass = shouldUseTransparentStyle
    ? "hover:text-primary-200"
    : "hover:text-primary-500";
  const iconColorClass = shouldUseTransparentStyle
    ? "text-white"
    : "text-neutral-700";

  // Link styles
  const linkClasses = `font-medium transition-colors duration-200 ${textColorClass} ${hoverTextColorClass}`;

  return (
    <nav className={navbarClasses}>
      <div className="container-custom flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center space-x-2">
          <Package size={32} className={iconColorClass} />
          <span className={`text-xl font-bold ${textColorClass}`}>
          EchoBazaar 
          </span>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center space-x-8">
          <Link href="/browse-product" className={linkClasses}>
            Products
          </Link>
          <div className="group relative">
            <button className={linkClasses}>Categories</button>
            <div className="absolute left-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 transform origin-top-right">
              <div className="py-1" role="menu" aria-orientation="vertical">
                <Link
                  href="/category/electronics"
                  className="block px-4 py-2 text-sm text-neutral-700 hover:bg-neutral-100"
                >
                  Electronics
                </Link>
                <Link
                  href="/category/clothing"
                  className="block px-4 py-2 text-sm text-neutral-700 hover:bg-neutral-100"
                >
                  Clothing
                </Link>
                <Link
                  href="/category/home"
                  className="block px-4 py-2 text-sm text-neutral-700 hover:bg-neutral-100"
                >
                  Home & Garden
                </Link>
                <Link
                  href="/category/beauty"
                  className="block px-4 py-2 text-sm text-neutral-700 hover:bg-neutral-100"
                >
                  Beauty
                </Link>
              </div>
            </div>
          </div>
          <Link href="/contact" className={linkClasses}>
            Contact
          </Link>
        </div>

        {/* Search and User Actions */}
        <div className="hidden md:flex items-center space-x-4">
          <div className="relative">
            <input
              type="text"
              placeholder="Search products..."
              className="pl-10 pr-4 py-2 w-64 rounded-full border border-neutral-300 focus:outline-none focus:ring-2 focus:ring-primary-300 focus:border-primary-500"
            />
            <Search
              size={18}
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-neutral-500"
            />
          </div>

          {seller && (
            <Link
              href="/seller/dashboard"
              className={`px-3 py-2 rounded-lg flex items-center ${
                shouldUseTransparentStyle
                  ? "text-white hover:bg-white/10"
                  : "text-neutral-700 hover:bg-neutral-100"
              }`}
            >
              <Store size={18} className="mr-1" />
              Dashboard
            </Link>
          )}

          {/* Seller Login - only show if no one is logged in */}
          {!user && !seller && (
            <Link
              href="/seller-login"
              className={`px-4 py-2 rounded-lg border ${
                shouldUseTransparentStyle
                  ? "border-white/30 text-white hover:bg-white/10"
                  : "border-neutral-300 text-neutral-700 hover:bg-neutral-50"
              }`}
            >
              Seller Login
            </Link>
          )}

          {/* User Menu */}
          <div className="relative">
            <button
              onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
              className={`flex items-center space-x-1 p-2 rounded-lg ${
                shouldUseTransparentStyle
                  ? "hover:bg-white/10"
                  : "hover:bg-neutral-100"
              }`}
            >
              {/* Show different icons based on who's logged in */}
              {user ? (
                <>
                  {user.avatar ? (
                    <img 
                      src={user.avatar} 
                      className="w-6 h-6 rounded-full" 
                      alt="User"
                    />
                  ) : (
                    <User size={20} className={iconColorClass} />
                  )}
                </>
              ) : seller ? (
                <>
                  {seller.profileImage ? (
                    <img
                      src={seller.profileImage}
                      className="w-6 h-6 rounded-full"
                      alt="Seller"
                    />
                  ) : (
                    <Store size={20} className={iconColorClass} />
                  )}
                </>
              ) : (
                <User size={20} className={iconColorClass} />
              )}
            </button>

            {isUserMenuOpen && (
              <div className="absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-50">
                <div className="py-1">
                  {/* Show different options based on login state */}
                  {user ? (
                    <>
                      <Link
                        href="/profile/user"
                        className="block px-4 py-2 text-sm text-neutral-700 hover:bg-neutral-100"
                        onClick={() => setIsUserMenuOpen(false)}
                      >
                        My Profile
                      </Link>
                      <Link
                        href="/orders"
                        className="block px-4 py-2 text-sm text-neutral-700 hover:bg-neutral-100"
                        onClick={() => setIsUserMenuOpen(false)}
                      >
                        My Orders
                      </Link>
                      <div className="border-t border-neutral-200 my-1"></div>
                      <button
                        onClick={() => {
                          userLogout();
                          setIsUserMenuOpen(false);
                        }}
                        className="block w-full text-left px-4 py-2 text-sm text-neutral-700 hover:bg-neutral-100"
                      >
                        Logout
                      </button>
                    </>
                  ) : seller ? (
                    <>
                      <Link
                        href="/seller/profile"
                        className="block px-4 py-2 text-sm text-neutral-700 hover:bg-neutral-100"
                        onClick={() => setIsUserMenuOpen(false)}
                      >
                        Seller Profile
                      </Link>
                      <Link
                        href="/seller/products"
                        className="block px-4 py-2 text-sm text-neutral-700 hover:bg-neutral-100"
                        onClick={() => setIsUserMenuOpen(false)}
                      >
                        My Products
                      </Link>
                      <div className="border-t border-neutral-200 my-1"></div>
                      <button
                        onClick={() => {
                          sellerLogout();
                          setIsUserMenuOpen(false);
                        }}
                        className="block w-full text-left px-4 py-2 text-sm text-neutral-700 hover:bg-neutral-100"
                      >
                        Seller Logout
                      </button>
                    </>
                  ) : (
                    <>
                      <Link
                        href="/login"
                        className="block px-4 py-2 text-sm text-neutral-700 hover:bg-neutral-100"
                        onClick={() => setIsUserMenuOpen(false)}
                      >
                        User Login
                      </Link>
                      <Link
                        href="/signup"
                        className="block px-4 py-2 text-sm text-neutral-700 hover:bg-neutral-100"
                        onClick={() => setIsUserMenuOpen(false)}
                      >
                        User Signup
                      </Link>
                      <div className="border-t border-neutral-200 my-1"></div>
                      <Link
                        href="/seller-login"
                        className="block px-4 py-2 text-sm text-neutral-700 hover:bg-neutral-100"
                        onClick={() => setIsUserMenuOpen(false)}
                      >
                        Seller Login
                      </Link>
                    </>
                  )}
                </div>
              </div>
            )}
          </div>

          <Link
            href="/user/cart"
            className={`p-2 rounded-lg ${
              shouldUseTransparentStyle
                ? "hover:bg-white/10"
                : "hover:bg-neutral-100"
            }`}
          >
            <div className="relative">
            <ShoppingCart size={20} className={iconColorClass} />
              <span className="absolute -top-1 -right-1 bg-primary-500 text-white text-xs w-4 h-4 flex items-center justify-center rounded-full">
                3
              </span>
            </div>
          </Link>
        </div>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden p-2 rounded-md focus:outline-none"
          onClick={() => onMobileMenuToggle(!isMenuOpen)}
        >
          {isMenuOpen ? (
            <X size={24} className={textColorClass} />
          ) : (
            <Menu size={24} className={textColorClass} />
          )}
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
