'use client';
import Link from 'next/link';

import { useState } from 'react';

import { motion } from 'framer-motion';
import {
  Package,
  User,
  ShoppingBag,
  Settings,
  LogOut,
  Menu,
  X,
  Home,
  Plus,
  List,
  ShoppingCart,
  Clock,
  Users,
} from 'lucide-react';



const DashboardLayout= ({ type }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const toggleMobileSidebar = () => {
    setIsMobileSidebarOpen(!isMobileSidebarOpen);
  };

  const userNavItems = [
    { href: '/dashboard', icon: Home, label: 'Dashboard' },
    { href: '/dashboard/profile', icon: User, label: 'Profile' },
    { href: '/dashboard/orders', icon: ShoppingBag, label: 'Orders' },
  ];

  const sellerNavItems = [
    { href: '/seller/dashboard', icon: Home, label: 'Dashboard' },
    { href: '/seller/dashboard/products/add', icon: Plus, label: 'Add Product' },
    { href: '/seller/dashboard/products', icon: List, label: 'Manage Products' },
    { href: '/seller/dashboard/orders', icon: ShoppingCart, label: 'Orders' },
    { href: '/seller/dashboard/profile', icon: User, label: 'Profile' },
  ];

  const navItems = type === 'user' ? userNavItems : sellerNavItems;

  return (
  <>dashboard</>
  );
}

export default DashboardLayout;