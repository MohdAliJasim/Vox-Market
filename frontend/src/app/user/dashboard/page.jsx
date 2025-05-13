'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { format } from 'date-fns';
import { Package, ShoppingBag, User, Settings, LogOut, Menu, X, Bell, Search } from 'lucide-react';
import Card from '@/app/ui/card';

export default function UserDashboard() {
  const [orders, setOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setIsLoading(true);
        // Mock data - replace with actual API call
        const mockOrders = [
          {
            id: 'ORD-001',
            date: new Date(),
            status: 'Processing',
            total: 299.99,
            items: [
              { name: 'Wireless Headphones', quantity: 1 }
            ]
          },
          {
            id: 'ORD-002',
            date: new Date(Date.now() - 86400000),
            status: 'Delivered',
            total: 199.99,
            items: [
              { name: 'Smart Watch', quantity: 1 }
            ]
          }
        ];
        setOrders(mockOrders);
      } catch (err) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchOrders();
  }, []);

  const stats = [
    { title: 'Total Orders', value: orders.length, icon: '📦' },
    { title: 'Wishlist Items', value: '5', icon: '❤️' },
    { title: 'Cart Items', value: '2', icon: '🛒' },
    { title: 'Total Spent', value: '$699.97', icon: '💰' },
  ];

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-red-50 border-red-200 text-red-700 p-4 rounded-lg">
          <p>Error loading dashboard: {error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900">Welcome Back, User!</h1>
          <p className="text-gray-600">Here's what's happening with your account.</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => (
            <Card key={index} className="bg-white p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">{stat.title}</p>
                  <p className="text-2xl font-bold mt-1">{stat.value}</p>
                </div>
                <span className="text-2xl">{stat.icon}</span>
              </div>
            </Card>
          ))}
        </div>

        {/* Recent Orders */}
        <Card className="mb-8">
          <Card.Body>
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">Recent Orders</h2>
              <Link 
                href="/user/orders" 
                className="text-primary-600 hover:text-primary-700"
              >
                View All
              </Link>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead>
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Order ID
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Date
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Total
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {orders.map((order) => (
                    <tr key={order.id}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {order.id}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {format(order.date, 'MMM dd, yyyy')}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          order.status === 'Delivered' 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-yellow-100 text-yellow-800'
                        }`}>
                          {order.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        ${order.total.toFixed(2)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <Link 
                          href={`/user/order-details/${order.id}`}
                          className="text-primary-600 hover:text-primary-900"
                        >
                          View Details
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card.Body>
        </Card>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="bg-primary-50 hover:bg-primary-100 transition-colors cursor-pointer">
            <Link href="/user/cart">
              <Card.Body className="flex items-center justify-between p-6">
                <div>
                  <h3 className="text-lg font-semibold text-primary-900">View Cart</h3>
                  <p className="text-primary-700">2 items in your cart</p>
                </div>
                <ShoppingBag className="h-8 w-8 text-primary-500" />
              </Card.Body>
            </Link>
          </Card>

          <Card className="bg-secondary-50 hover:bg-secondary-100 transition-colors cursor-pointer">
            <Link href="/user/profile">
              <Card.Body className="flex items-center justify-between p-6">
                <div>
                  <h3 className="text-lg font-semibold text-secondary-900">Edit Profile</h3>
                  <p className="text-secondary-700">Update your information</p>
                </div>
                <User className="h-8 w-8 text-secondary-500" />
              </Card.Body>
            </Link>
          </Card>

          <Card className="bg-accent-50 hover:bg-accent-100 transition-colors cursor-pointer">
            <Link href="/user/orders">
              <Card.Body className="flex items-center justify-between p-6">
                <div>
                  <h3 className="text-lg font-semibold text-accent-900">Track Orders</h3>
                  <p className="text-accent-700">View all your orders</p>
                </div>
                <Package className="h-8 w-8 text-accent-500" />
              </Card.Body>
            </Link>
          </Card>
        </div>
      </div>
    </div>
  );
}