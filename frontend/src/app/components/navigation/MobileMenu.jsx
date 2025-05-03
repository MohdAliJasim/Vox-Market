import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { ChevronDown, ChevronRight, ShoppingCart, User, Package, Search } from 'lucide-react';
import { useState } from 'react';



const MobileMenu = ({ isOpen, onClose }) => {
  const [expandedCategory, setExpandedCategory] = useState(false);

  const toggleCategory = () => {
    setExpandedCategory(!expandedCategory);
  };

  const menuVariants = {
    closed: {
      x: '-100%',
      transition: {
        type: 'tween',
        duration: 0.25,
        ease: 'easeInOut',
      },
    },
    open: {
      x: 0,
      transition: {
        type: 'tween',
        duration: 0.25,
        ease: 'easeInOut',
      },
    },
  };

  const linkVariants = {
    closed: { opacity: 0, x: -20 },
    open: (i) => ({
      opacity: 1,
      x: 0,
      transition: {
        delay: 0.1 + i * 0.1,
        duration: 0.3,
      },
    }),
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.5 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black z-40"
            onClick={onClose}
          />

          {/* Menu */}
          <motion.div
            initial="closed"
            animate="open"
            exit="closed"
            variants={menuVariants}
            className="fixed top-0 left-0 bottom-0 w-4/5 max-w-xs bg-white z-50 shadow-xl flex flex-col"
          >
            <div className="p-4 border-b border-neutral-200 flex items-center">
              <Package size={24} className="text-primary-500 mr-2" />
              <span className="text-lg font-bold">Marketplace</span>
            </div>

            <div className="p-4">
              <div className="relative mb-4">
                <input
                  type="text"
                  placeholder="Search products..."
                  className="pl-10 pr-4 py-2 w-full rounded-full border border-neutral-300 focus:outline-none focus:ring-2 focus:ring-primary-300 focus:border-primary-500"
                />
                <Search size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-neutral-500" />
              </div>
            </div>

            <nav className="flex-1 overflow-y-auto px-4">
              <ul className="space-y-1">
                <motion.li
                  custom={0}
                  variants={linkVariants}
                >
                  <Link
                    href="/"
                    className={({ isActive }) =>
                      `flex items-center py-3 px-2 rounded-lg transition-colors ${
                        isActive ? 'bg-primary-50 text-primary-500' : 'text-neutral-800 hover:bg-neutral-50'
                      }`
                    }
                    onClick={onClose}
                  >
                    Home
                  </Link>
                </motion.li>

                <motion.li
                  custom={1}
                  variants={linkVariants}
                >
                  <Link
                    href="/products"
                    className={({ isActive }) =>
                      `flex items-center py-3 px-2 rounded-lg transition-colors ${
                        isActive ? 'bg-primary-50 text-primary-500' : 'text-neutral-800 hover:bg-neutral-50'
                      }`
                    }
                    onClick={onClose}
                  >
                    Products
                  </Link>
                </motion.li>

                <motion.li
                  custom={2}
                  variants={linkVariants}
                >
                  <button
                    onClick={toggleCategory}
                    className="flex items-center justify-between w-full py-3 px-2 rounded-lg transition-colors text-neutral-800 hover:bg-neutral-50"
                  >
                    <span>Categories</span>
                    {expandedCategory ? <ChevronDown size={20} /> : <ChevronRight size={20} />}
                  </button>

                  <AnimatePresence>
                    {expandedCategory && (
                      <motion.ul
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="ml-4 overflow-hidden"
                      >
                        <li>
                          <Link
                            href="/category/electronics"
                            className="flex items-center py-2 px-2 rounded-lg transition-colors text-neutral-700 hover:bg-neutral-50"
                            onClick={onClose}
                          >
                            Electronics
                          </Link>
                        </li>
                        <li>
                          <Link
                            href="/category/clothing"
                            className="flex items-center py-2 px-2 rounded-lg transition-colors text-neutral-700 hover:bg-neutral-50"
                            onClick={onClose}
                          >
                            Clothing
                          </Link>
                        </li>
                        <li>
                          <Link
                            href="/category/home"
                            className="flex items-center py-2 px-2 rounded-lg transition-colors text-neutral-700 hover:bg-neutral-50"
                            onClick={onClose}
                          >
                            Home & Garden
                          </Link>
                        </li>
                        <li>
                          <Link
                            href="/category/beauty"
                            className="flex items-center py-2 px-2 rounded-lg transition-colors text-neutral-700 hover:bg-neutral-50"
                            onClick={onClose}
                          >
                            Beauty
                          </Link>
                        </li>
                      </motion.ul>
                    )}
                  </AnimatePresence>
                </motion.li>

                <motion.li
                  custom={3}
                  variants={linkVariants}
                >
                  <Link
                    href="/contact"
                    className={({ isActive }) =>
                      `flex items-center py-3 px-2 rounded-lg transition-colors ${
                        isActive ? 'bg-primary-50 text-primary-500' : 'text-neutral-800 hover:bg-neutral-50'
                      }`
                    }
                    onClick={onClose}
                  >
                    Contact
                  </Link>
                </motion.li>

                <motion.li
                  custom={4}
                  variants={linkVariants}
                >
                  <Link
                    href="/feedback"
                    className={({ isActive }) =>
                      `flex items-center py-3 px-2 rounded-lg transition-colors ${
                        isActive ? 'bg-primary-50 text-primary-500' : 'text-neutral-800 hover:bg-neutral-50'
                      }`
                    }
                    onClick={onClose}
                  >
                    Feedback
                  </Link>
                </motion.li>
              </ul>

              <div className="border-t border-neutral-200 my-4 pt-4">
                <ul className="space-y-1">
                  <motion.li
                    custom={5}
                    variants={linkVariants}
                  >
                    <Link
                      href="/login"
                      className="flex items-center py-3 px-2 rounded-lg transition-colors text-neutral-800 hover:bg-neutral-50"
                      onClick={onClose}
                    >
                      <User size={18} className="mr-2" />
                      Login
                    </Link>
                  </motion.li>
                  <motion.li
                    custom={6}
                    variants={linkVariants}
                  >
                    <Link
                      href="/signup"
                      className="flex items-center py-3 px-2 rounded-lg transition-colors text-neutral-800 hover:bg-neutral-50"
                      onClick={onClose}
                    >
                      <User size={18} className="mr-2" />
                      Signup
                    </Link>
                  </motion.li>
                  <motion.li
                    custom={7}
                    variants={linkVariants}
                  >
                    <Link
                    href="/seller/login"
                      className="flex items-center py-3 px-2 rounded-lg transition-colors text-neutral-800 hover:bg-neutral-50"
                      onClick={onClose}
                    >
                      <Package size={18} className="mr-2" />
                      Seller Login
                    </Link>
                  </motion.li>
                  <motion.li
                    custom={8}
                    variants={linkVariants}
                  >
                    <Link
                      href="/cart"
                      className="flex items-center py-3 px-2 rounded-lg transition-colors text-neutral-800 hover:bg-neutral-50"
                      onClick={onClose}
                    >
                      <ShoppingCart size={18} className="mr-2" />
                      Cart
                    </Link>
                  </motion.li>
                </ul>
              </div>
            </nav>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default MobileMenu;