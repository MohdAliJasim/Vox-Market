'use client';
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Search, Filter, Package, Truck, CheckCircle, Clock } from 'lucide-react';
import Link from 'next/link';

const ManageOrderPage = () => {
  const [orders, setOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate API call
    const fetchOrders = async () => {
      try {
        // Mock data - replace with actual API call
        const mockOrders = [
          {
            id: 'ORD-001',
            date: '2024-03-15',
            status: 'processing',
            total: 299.99,
            items: [
              { name: 'Wireless Headphones', quantity: 1, price: 299.99 }
            ]
          },
          {
            id: 'ORD-002',
            date: '2024-03-14',
            status: 'shipped',
            total: 199.99,
            items: [
              { name: 'Smart Watch', quantity: 1, price: 199.99 }
            ]
          },
          {
            id: 'ORD-003',
            date: '2024-03-13',
            status: 'delivered',
            total: 499.99,
            items: [
              { name: 'Tablet', quantity: 1, price: 499.99 }
            ]
          }
        ];
        setOrders(mockOrders);
        setFilteredOrders(mockOrders);
        setIsLoading(false);
      } catch (error) {
        console.error('Error fetching orders:', error);
        setIsLoading(false);
      }
    };

    fetchOrders();
  }, []);

  useEffect(() => {
    let result = orders;

    // Apply status filter
    if (statusFilter !== 'all') {
      result = result.filter(order => order.status === statusFilter);
    }

    // Apply search filter
    if (searchQuery) {
      result = result.filter(order =>
        order.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
        order.items.some(item => 
          item.name.toLowerCase().includes(searchQuery.toLowerCase())
        )
      );
    }

    setFilteredOrders(result);
  }, [statusFilter, searchQuery, orders]);

  const getStatusIcon = (status) => {
    switch (status) {
      case 'processing':
        return <Clock className="text-warning-500" />;
      case 'shipped':
        return <Truck className="text-primary-500" />;
      case 'delivered':
        return <CheckCircle className="text-success-500" />;
      default:
        return <Package className="text-neutral-500" />;
    }
  };

  const getStatusBadgeClass = (status) => {
    switch (status) {
      case 'processing':
        return 'bg-warning-100 text-warning-800';
      case 'shipped':
        return 'bg-primary-100 text-primary-800';
      case 'delivered':
        return 'bg-success-100 text-success-800';
      default:
        return 'bg-neutral-100 text-neutral-800';
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-500"></div>
      </div>
    );
  }

  return (
    <div className="container-custom py-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-2xl font-bold">My Orders</h1>
          <div className="flex space-x-4">
            <div className="relative">
              <input
                type="text"
                placeholder="Search orders..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 pr-4 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-neutral-400" size={20} />
            </div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="border border-neutral-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500"
            >
              <option value="all">All Orders</option>
              <option value="processing">Processing</option>
              <option value="shipped">Shipped</option>
              <option value="delivered">Delivered</option>
            </select>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-neutral-200">
              <thead>
                <tr className="bg-neutral-50">
                  <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">
                    Order ID
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">
                    Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">
                    Items
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">
                    Total
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-200">
                {filteredOrders.map((order) => (
                  <tr key={order.id} className="hover:bg-neutral-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-neutral-900">
                      {order.id}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-neutral-500">
                      {new Date(order.date).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 text-sm text-neutral-500">
                      <ul>
                        {order.items.map((item, index) => (
                          <li key={index}>
                            {item.quantity}x {item.name}
                          </li>
                        ))}
                      </ul>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      ${order.total.toFixed(2)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusBadgeClass(order.status)}`}>
                        {getStatusIcon(order.status)}
                        <span className="ml-1 capitalize">{order.status}</span>
                      </span>
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
        </div>

        {filteredOrders.length === 0 && (
          <div className="text-center py-8">
            <Package className="mx-auto h-12 w-12 text-neutral-400" />
            <h3 className="mt-2 text-sm font-medium text-neutral-900">No orders found</h3>
            <p className="mt-1 text-sm text-neutral-500">
              {searchQuery || statusFilter !== 'all'
                ? 'Try adjusting your filters'
                : 'Start shopping to see your orders here'}
            </p>
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default ManageOrderPage;