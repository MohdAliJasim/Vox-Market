'use client';
import { useState, useEffect } from "react";
import { 
  LayoutDashboard, 
  Package, 
  ShoppingBag, 
  UserRound, 
  Menu, 
  X,
  ChevronRight
} from "lucide-react";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { usePathname } from "next/navigation";

const navItems = [
  {
    title: "Dashboard",
    href: "/seller/dashboard",
    icon: <LayoutDashboard className="h-5 w-5" />,
  },
  {
    title: "Add Product",
    href: "/seller/add-product",
    icon: <ShoppingBag className="h-5 w-5" />,
  },
  {
    title: "Manage Products",
    href: "/seller/manage-product",
    icon: <Package className="h-5 w-5" />,
  },
  {
    title: "Manage Orders",
    href: "/seller/manage-order",
    icon: <ShoppingBag className="h-5 w-5" />,
  },
  {
    title: "Profile",
    href: "/seller/profile",
    icon: <UserRound className="h-5 w-5" />,
  },
];

export default function SellerLayout({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const pathname = usePathname(); // Better way to get current path

  useEffect(() => {
    const checkIfMobile = () => {
      setIsMobile(window.innerWidth < 768);
      if (window.innerWidth >= 768) {
        setSidebarOpen(true);
      }
    };

    checkIfMobile();
    window.addEventListener("resize", checkIfMobile);

    return () => {
      window.removeEventListener("resize", checkIfMobile);
    };
  }, []);

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Mobile overlay */}
      {sidebarOpen && isMobile && (
        <div
          className="fixed inset-0 z-40 bg-gray-600 bg-opacity-75 transition-opacity"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-50 w-64 transform bg-white shadow-md transition-transform duration-300 ease-in-out md:relative md:translate-x-0",
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="flex h-full flex-col">
          {/* Sidebar Header */}
          <div className="flex h-16 items-center justify-between border-b border-gray-200 px-4">
            <Link href="/seller/dashboard" className="flex items-center space-x-2">
              <div className="rounded-md bg-seller-600 p-1">
                <Package className="h-6 w-6 text-white" />
              </div>
              <span className="text-xl font-semibold text-gray-800">EchoBazaar</span>
            </Link>
            <button
              className="rounded-md p-2 text-gray-500 hover:bg-gray-100 md:hidden"
              onClick={() => setSidebarOpen(false)}
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 overflow-y-auto px-2 py-4">
            <ul className="space-y-1">
              {navItems.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className={cn(
                      "flex items-center justify-between rounded-md px-3 py-3 text-sm font-medium hover:bg-gray-100",
                      pathname === item.href
                        ? "bg-seller-50 text-seller-600"
                        : "text-gray-700"
                    )}
                  >
                    <div className="flex items-center space-x-3">
                      <span
                        className={cn(
                          "flex h-7 w-7 items-center justify-center rounded-md",
                          pathname === item.href
                            ? "bg-seller-100 text-seller-600"
                            : "bg-gray-100 text-gray-500"
                        )}
                      >
                        {item.icon}
                      </span>
                      <span>{item.title}</span>
                    </div>
                    {pathname === item.href && (
                      <ChevronRight className="h-4 w-4 text-seller-600" />
                    )}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          {/* User Section */}
          <div className="border-t border-gray-200 p-4">
            <div className="flex items-center space-x-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-200">
                <UserRound className="h-6 w-6 text-gray-500" />
              </div>
              <div className="overflow-hidden">
                <p className="truncate text-sm font-medium">Seller Name</p>
                <p className="truncate text-xs text-gray-500">seller@example.com</p>
              </div>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex flex-1 flex-col overflow-hidden">
        {/* Mobile Header */}
        <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-gray-200 bg-white px-4 md:hidden">
          <button
            className="rounded-md p-2 text-gray-500 hover:bg-gray-100"
            onClick={() => setSidebarOpen(!sidebarOpen)}
          >
            <Menu className="h-5 w-5" />
          </button>
          <span className="text-lg font-semibold text-gray-800">Seller Hub</span>
          <div className="h-10 w-10"></div> {/* Spacer for alignment */}
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-auto p-4 md:p-6">
          <div className="mx-auto max-w-7xl">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}