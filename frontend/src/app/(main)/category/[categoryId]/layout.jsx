'use client';
import { useEffect, useState } from "react";
import React from "react";

import Navbar from '@/app/components/navigation/Navbar';
import MobileMenu from '@/app/components/navigation/MobileMenu';




const Layout = ({ children }) => {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  
    useEffect(() => {
      // Close mobile menu on route change
      setIsMobileMenuOpen(false);
      // Scroll to top on route change
      window.scrollTo(0, 0);
    }, []);
  return (
    <>
      <Navbar onMobileMenuToggle={setIsMobileMenuOpen} isMenuOpen={isMobileMenuOpen} transparentHeader/>
      <MobileMenu isOpen={isMobileMenuOpen} onClose={() => setIsMobileMenuOpen(false)} />
      {children}
       
   
    </>
  );
};

export default Layout;
