import Link from 'next/link';

import { Facebook, Instagram, Twitter, Package, Mail, MapPin, Phone } from 'lucide-react';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-neutral-900 text-white pt-16 pb-8">
      <div className="container-custom">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          {/* Logo and Description */}
          <div>
            <div className="flex items-center mb-4">
              <Package size={32} className="text-primary-400 mr-2" />
              <span className="text-xl font-bold">Marketplace</span>
            </div>
            <p className="text-neutral-400 mb-6">
              Your one-stop destination for quality products from trusted sellers.
              We connect buyers and sellers in a secure, user-friendly platform.
            </p>
            <div className="flex space-x-4">
              <a 
                href="#" 
                className="text-neutral-400 hover:text-white transition-colors duration-200"
                aria-label="Facebook"
              >
                <Facebook size={20} />
              </a>
              <a 
                href="#" 
                className="text-neutral-400 hover:text-white transition-colors duration-200"
                aria-label="Instagram"
              >
                <Instagram size={20} />
              </a>
              <a 
                href="#" 
                className="text-neutral-400 hover:text-white transition-colors duration-200"
                aria-label="Twitter"
              >
                <Twitter size={20} />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2">
              <li>
                <Link href="/products" className="text-neutral-400 hover:text-white transition-colors duration-200">
                  All Products
                </Link>
              </li>
              <li>
                <Link href="/category/featured" className="text-neutral-400 hover:text-white transition-colors duration-200">
                  Featured Items
                </Link>
              </li>
              <li>
                <Link href="/category/bestsellers" className="text-neutral-400 hover:text-white transition-colors duration-200">
                  Best Sellers
                </Link>
              </li>
              <li>
                <Link href="/category/new" className="text-neutral-400 hover:text-white transition-colors duration-200">
                  New Arrivals
                </Link>
              </li>
              <li>
                <Link href="/category/deals" className="text-neutral-400 hover:text-white transition-colors duration-200">
                  Special Deals
                </Link>
              </li>
            </ul>
          </div>

          {/* Account */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Account</h4>
            <ul className="space-y-2">
              <li>
                <Link href="/login" className="text-neutral-400 hover:text-white transition-colors duration-200">
                  Customer Login
                </Link>
              </li>
              <li>
                <Link href="/signup" className="text-neutral-400 hover:text-white transition-colors duration-200">
                  Create Account
                </Link>
              </li>
              <li>
                <Link href="/seller/login" className="text-neutral-400 hover:text-white transition-colors duration-200">
                  Seller Login
                </Link>
              </li>
              <li>
                <Link href="/seller/signup" className="text-neutral-400 hover:text-white transition-colors duration-200">
                  Become a Seller
                </Link>
              </li>
              <li>
                <Link href="/track-order" className="text-neutral-400 hover:text-white transition-colors duration-200">
                  Track Order
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Contact Us</h4>
            <ul className="space-y-4">
              <li className="flex items-start">
                <MapPin size={20} className="text-primary-400 mr-3 mt-1 flex-shrink-0" />
                <span className="text-neutral-400">
                  123 Market Street, San Francisco, CA 94103, United States
                </span>
              </li>
              <li className="flex items-center">
                <Phone size={20} className="text-primary-400 mr-3 flex-shrink-0" />
                <span className="text-neutral-400">+1 (555) 123-4567</span>
              </li>
              <li className="flex items-center">
                <Mail size={20} className="text-primary-400 mr-3 flex-shrink-0" />
                <span className="text-neutral-400">support@marketplace.com</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-neutral-800 flex flex-col md:flex-row justify-between items-center">
          <p className="text-neutral-500 text-sm mb-4 md:mb-0">
            &copy; {currentYear} Marketplace. All rights reserved.
          </p>
          <div className="flex flex-wrap justify-center space-x-4 text-sm text-neutral-500">
            <Link href="/privacy-policy" className="hover:text-white transition-colors duration-200 mb-2 md:mb-0">
              Privacy Policy
            </Link>
            <Link href="/terms-of-service" className="hover:text-white transition-colors duration-200 mb-2 md:mb-0">
              Terms of Service
            </Link>
            <Link href="/refund-policy" className="hover:text-white transition-colors duration-200 mb-2 md:mb-0">
              Refund Policy
            </Link>
            <Link href="/contact" className="hover:text-white transition-colors duration-200 mb-2 md:mb-0">
              Contact Us
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;