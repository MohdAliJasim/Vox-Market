import { useState, useEffect } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { ShoppingCart, User, Menu, X, Search, Package } from 'lucide-react';


const Navbar = ({ isMenuOpen, onMobileMenuToggle }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const location = useLocation();
  const isHomePage = location.pathname === '/';

  // Handle scroll events to change navbar appearance
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Determine navbar appearance based on scroll position and current page
  const navbarClasses = `
    fixed top-0 left-0 right-0 z-50 transition-all duration-300
    ${isScrolled || !isHomePage ? 'bg-white shadow-md py-3' : 'bg-transparent py-5'}
  `;

  // Link styles based on current scroll position and page
  const linkClasses = `
    font-medium transition-colors duration-200
    ${isScrolled || !isHomePage ? 'text-neutral-800 hover:text-primary-500' : 'text-white hover:text-primary-200'}
  `;

  const activeLinkClasses = `
    ${isScrolled || !isHomePage ? 'text-primary-500' : 'text-primary-200'}
  `;

  return (
    <nav className={navbarClasses}>
      <div className="container-custom flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center space-x-2">
          <Package 
            size={32} 
            className={`${isScrolled || !isHomePage ? 'text-primary-500' : 'text-white'}`} 
          />
          <span 
            className={`text-xl font-bold ${isScrolled || !isHomePage ? 'text-neutral-900' : 'text-white'}`}
          >
            Marketplace
          </span>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center space-x-8">
          <NavLink 
            to="/products" 
            className={({ isActive }) => 
              `${linkClasses} ${isActive ? activeLinkClasses : ''}`
            }
          >
            Products
          </NavLink>
          <div className="group relative">
            <button className={linkClasses}>
              Categories
            </button>
            <div className="absolute left-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 transform origin-top-right">
              <div className="py-1" role="menu" aria-orientation="vertical">
                <Link to="/category/electronics" className="block px-4 py-2 text-sm text-neutral-700 hover:bg-neutral-100">Electronics</Link>
                <Link to="/category/clothing" className="block px-4 py-2 text-sm text-neutral-700 hover:bg-neutral-100">Clothing</Link>
                <Link to="/category/home" className="block px-4 py-2 text-sm text-neutral-700 hover:bg-neutral-100">Home & Garden</Link>
                <Link to="/category/beauty" className="block px-4 py-2 text-sm text-neutral-700 hover:bg-neutral-100">Beauty</Link>
              </div>
            </div>
          </div>
          <NavLink 
            to="/contact" 
            className={({ isActive }) => 
              `${linkClasses} ${isActive ? activeLinkClasses : ''}`
            }
          >
            Contact
          </NavLink>
        </div>

        {/* Search and User Actions */}
        <div className="hidden md:flex items-center space-x-4">
          <div className="relative">
            <input
              type="text"
              placeholder="Search products..."
              className="pl-10 pr-4 py-2 w-64 rounded-full border border-neutral-300 focus:outline-none focus:ring-2 focus:ring-primary-300 focus:border-primary-500"
            />
            <Search size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-neutral-500" />
          </div>

          <Link 
            to="/login" 
            className={`p-2 rounded-full ${isScrolled || !isHomePage ? 'hover:bg-neutral-100' : 'hover:bg-white/10'}`}
          >
            <User 
              size={20} 
              className={isScrolled || !isHomePage ? 'text-neutral-700' : 'text-white'} 
            />
          </Link>
          <Link 
            to="/cart" 
            className={`p-2 rounded-full ${isScrolled || !isHomePage ? 'hover:bg-neutral-100' : 'hover:bg-white/10'}`}
          >
            <div className="relative">
              <ShoppingCart 
                size={20} 
                className={isScrolled || !isHomePage ? 'text-neutral-700' : 'text-white'} 
              />
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
            <X size={24} className={isScrolled || !isHomePage ? 'text-neutral-800' : 'text-white'} />
          ) : (
            <Menu size={24} className={isScrolled || !isHomePage ? 'text-neutral-800' : 'text-white'} />
          )}
        </button>
      </div>
    </nav>
  );
};

export default Navbar;