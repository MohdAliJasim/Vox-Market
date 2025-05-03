'use client';
import { useState } from 'react';
import { motion } from 'framer-motion';
import { Search, Eye, Package, Truck, CheckCircle, Clock } from 'lucide-react';
import Button from '@/app/ui/Button';

// Mock orders data
const mockOrders = [
  {
    id: 'ORD-001',
    customer: {
      name: 'John Doe',
      email: 'john@example.com'
    },
    items: [
      { id: 1, name: 'Wireless Headphones', quantity: 1, price: 199.99 },
      { id: 2, name: 'Smart Watch', quantity: 1, price: 299.99 }
    ],
    total: 499.98,
    status: 'pending',
    date: '2024-03-15T10:30:00Z'
  },
  {
    id: 'ORD-002',
    customer: {
      name: 'Jane Smith',
      email: 'jane@example.com'
    },
    items: [
      { id: 3, name: 'Laptop Stand', quantity: 2, price: 49.99 }
    ],
    total: 99.98,
    status: 'processing',
    date: '2024-03-14T15:45:00Z'
  },
  {
    id: 'ORD-003',
    customer: {
      name: 'Mike Johnson',
      email: 'mike@example.com'
    },
    items: [
      { id: 4, name: 'Mechanical Keyboard', quantity: 1, price: 159.99 }
    ],
    total: 159.99,
    status: 'shipped',
    date: '2024-03-13T09:15:00Z'
  },
  {
    id: 'ORD-004',
    customer: {
      name: 'Sarah Williams',
      email: 'sarah@example.com'
    },
    items: [
      { id: 5, name: 'USB-C Hub', quantity: 1, price: 79.99 },
      { id: 6, name: 'Wireless Mouse', quantity: 1, price: 49.99 }
    ],
    total: 129.98,
    status: 'delivered',
    date: '2024-03-12T14:20:00Z'
  }
];

const ManageOrdersPage = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  // Filter orders
  const filteredOrders = mockOrders.filter(order => {
    const matchesSearch = 
      order.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.customer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.customer.email.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || order.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  const getStatusIcon = (status) => {
    switch (status) {
      case 'pending':
        return <Clock className="text-warning-500" />;
      case 'processing':
        return <Package className="text-primary-500" />;
      case 'shipped':
        return <Truck className="text-secondary-500" />;
      case 'delivered':
        return <CheckCircle className="text-success-500" />;
      default:
        return null;
    }
  };

  const getStatusBadgeClass = (status) => {
    switch (status) {
      case 'pending':
        return 'bg-warning-100 text-warning-800';
      case 'processing':
        return 'bg-primary-100 text-primary-800';
      case 'shipped':
        return 'bg-secondary-100 text-secondary-800';
      case 'delivered':
        return 'bg-success-100 text-success-800';
      default:
        return 'bg-neutral-100 text-neutral-800';
    }
  };

  return (
    <div className="container-custom py-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8">
          <div>
            <h1 className="text-2xl font-bold mb-2">Manage Orders</h1>
            <p className="text-neutral-600">
              {filteredOrders.length} orders found
            </p>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-xl shadow-sm p-4 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="relative">
              <input
                type="text"
                placeholder="Search orders..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="form-input pl-10"
              />
              <Search size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-neutral-400" />
            </div>

            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="form-input"
            >
              <option value="all">All Status</option>
              <option value="pending">Pending</option>
              <option value="processing">Processing</option>
              <option value="shipped">Shipped</option>
              <option value="delivered">Delivered</option>
            </select>
          </div>
        </div>

        {/* Orders Table */}
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-neutral-50">
                  <th className="px-6 py-3 text-left text-sm font-medium text-neutral-500">Order ID</th>
                  <th className="px-6 py-3 text-left text-sm font-medium text-neutral-500">Customer</th>
                  <th className="px-6 py-3 text-left text-sm font-medium text-neutral-500">Items</th>
                  <th className="px-6 py-3 text-left text-sm font-medium text-neutral-500">Total</th>
                  <th className="px-6 py-3 text-left text-sm font-medium text-neutral-500">Status</th>
                  <th className="px-6 py-3 text-left text-sm font-medium text-neutral-500">Date</th>
                  <th className="px-6 py-3 text-right text-sm font-medium text-neutral-500">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-200">
                {filteredOrders.map((order) => (
                  <tr key={order.id} className="hover:bg-neutral-50">
                    <td className="px-6 py-4 font-medium text-neutral-900">
                      {order.id}
                    </td>
                    <td className="px-6 py-4">
                      <div className="font-medium text-neutral-900">{order.customer.name}</div>
                      <div className="text-sm text-neutral-500">{order.customer.email}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-neutral-600">
                        {order.items.map((item, index) => (
                          <div key={item.id}>
                            {item.quantity}x {item.name}
                            {index < order.items.length - 1 && ', '}
                          </div>
                        ))}
                      </div>
                    </td>
                    <td className="px-6 py-4 font-medium text-neutral-900">
                      ${order.total.toFixed(2)}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusBadgeClass(order.status)}`}>
                        <span className="mr-1">{getStatusIcon(order.status)}</span>
                        {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-neutral-600">
                      {new Date(order.date).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <Button
                        variant="outline"
                        size="sm"
                        icon={<Eye size={14} />}
                      >
                        View Details
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default ManageOrdersPage;