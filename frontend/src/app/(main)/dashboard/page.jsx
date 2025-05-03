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
    <div className="min-h-screen bg-neutral-50">
      {/* Mobile Sidebar Toggle */}
      <div className="lg:hidden fixed top-4 left-4 z-50">
        <button
          onClick={toggleMobileSidebar}
          className="p-2 rounded-lg bg-white shadow-sm hover:bg-neutral-50"
        >
          {isMobileSidebarOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Sidebar Overlay */}
      {isMobileSidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={() => setIsMobileSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 h-full bg-white border-r border-neutral-200 transition-all duration-300 z-50 
          ${isSidebarOpen ? 'w-64' : 'w-20'} 
          ${isMobileSidebarOpen ? 'translate-x-0' : '-translate-x-full'} 
          lg:translate-x-0`}
      >
        {/* Logo */}
        <div className="h-16 flex items-center justify-between px-4 border-b border-neutral-200">
          <Link href="/" className="flex items-center space-x-3">
            <Package size={32} className="text-primary-500" />
            {isSidebarOpen && (
              <span className="text-xl font-bold">Marketplace</span>
            )}
          </Link>
          <button
            onClick={toggleSidebar}
            className="hidden lg:block p-2 rounded-lg hover:bg-neutral-100"
          >
            <Menu size={20} />
          </button>
        </div>

        {/* Navigation */}
        <nav className="p-4">
          <ul className="space-y-2">
            {navItems.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  end={item.href === '/dashboard' || item.href === '/seller/dashboard'}
                  className={({ isActive }) =>
                    `flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors
                    ${
                      isActive
                        ? 'bg-primary-50 text-primary-500'
                        : 'text-neutral-600 hover:bg-neutral-50 hover:text-neutral-900'
                    }`
                  }
                >
                  <item.icon size={20} />
                  {isSidebarOpen && <span>{item.label}</span>}
                </Link>
              </li>
            ))}
          </ul>

          <div className="mt-8 pt-8 border-t border-neutral-200">
            <ul className="space-y-2">
              <li>
                <Link
                  href="/settings"
                  className="flex items-center space-x-3 px-4 py-3 rounded-lg text-neutral-600 hover:bg-neutral-50 hover:text-neutral-900 transition-colors"
                >
                  <Settings size={20} />
                  {isSidebarOpen && <span>Settings</span>}
                </Link>
              </li>
              <li>
                <button className="w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-neutral-600 hover:bg-neutral-50 hover:text-neutral-900 transition-colors">
                  <LogOut size={20} />
                  {isSidebarOpen && <span>Logout</span>}
                </button>
              </li>
            </ul>
          </div>
        </nav>
      </aside>

      {/* Main Content */}
      <main
        className={`min-h-screen transition-all duration-300 
          ${isSidebarOpen ? 'lg:pl-64' : 'lg:pl-20'}`}
      >
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="p-8"
        >
       
        </motion.div>
      </main>
    </div>
  );
}

export default DashboardLayout;