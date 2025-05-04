'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { format } from 'date-fns';
import Card from '@/app/ui/card';
import SellerLayout from '../SellerLayout';

export default function SellerDashboard() {
  const [stats, setStats] = useState([]);
  const [orders, setOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const ordersPerPage = 5;

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        setError(null);
        
        // Simulate API calls with timeout
        await new Promise(resolve => setTimeout(resolve, 800));
        
        // Mock data - replace with actual API calls
        setStats([
          { title: "Total Sales", value: "$12,345", change: "+12%", icon: "💰" },
          { title: "Orders", value: "156", change: "+8%", icon: "📦" },
          { title: "Products", value: "43", change: "+2%", icon: "🛍️" },
          { title: "Customers", value: "89", change: "+15%", icon: "👥" },
        ]);

        const mockOrders = Array.from({ length: 15 }, (_, i) => ({
          id: `ORD-${1000 + i}`,
          customer: ['John Doe', 'Jane Smith', 'Robert Johnson'][i % 3],
          date: new Date(Date.now() - i * 86400000).toISOString(),
          amount: `$${(50 + Math.random() * 200).toFixed(2)}`,
          status: ['Processing', 'Shipped', 'Delivered'][i % 3]
        }));
        
        setOrders(mockOrders);
      } catch (err) {
        setError(err.message || 'Failed to load dashboard data');
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  // Pagination logic
  const indexOfLastOrder = currentPage * ordersPerPage;
  const indexOfFirstOrder = indexOfLastOrder - ordersPerPage;
  const currentOrders = orders.slice(indexOfFirstOrder, indexOfLastOrder);
  const totalPages = Math.ceil(orders.length / ordersPerPage);

  if (isLoading) {
    return (
      <Card className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-500"></div>
        <span className="sr-only">Loading...</span>
      </Card>
    );
  }

  if (error) {
    return (
       
      <Card className="bg-red-50 border-red-200">
        <Card.Body>
          <div className="flex flex-col items-center text-center p-4">
            <span className="text-red-500 text-2xl mb-2">⚠️</span>
            <h3 className="text-lg font-medium text-red-800">Dashboard Error</h3>
            <p className="text-red-600 mb-4">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="px-4 py-2 bg-red-100 text-red-800 rounded-md hover:bg-red-200 transition-colors"
            >
              Retry Loading
            </button>
          </div>
        </Card.Body>
      </Card>
    );
  }

  return (
    
    <SellerLayout>
    <div className="space-y-6">
      {/* Header */}
      <Card>
        <Card.Body className="pb-0">
          <h1 className="text-2xl font-bold">Seller Dashboard</h1>
          <p className="text-muted-foreground">
            {format(new Date(), 'MMMM d, yyyy')} • Overview
          </p>
        </Card.Body>
      </Card>

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat, index) => (
          <Card key={index} hoverable className="hover:shadow-lg transition-all">
            <Card.Body>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">{stat.title}</p>
                  <p className="text-2xl font-bold mt-1">{stat.value}</p>
                </div>
                <span className="text-2xl" aria-hidden="true">{stat.icon}</span>
              </div>
              <p className={`mt-2 text-sm font-medium ${
                stat.change.startsWith('+') ? 'text-green-600' : 'text-red-600'
              }`}>
                {stat.change} from last month
              </p>
            </Card.Body>
          </Card>
        ))}
      </div>

      {/* Recent Orders */}
      <Card>
        <Card.Body>
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold">Recent Orders</h2>
            <Link 
              href="/seller/manage-order" 
              className="text-sm text-primary-600 hover:underline"
            >
              View All
            </Link>
          </div>
          
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200" aria-label="Recent orders">
              <thead>
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Order ID
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Customer
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Amount
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {currentOrders.map((order) => (
                  <tr key={order.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3 whitespace-nowrap text-sm font-medium">
                      <Link 
                        href={`/seller/orders/${order.id}`}
                        className="text-primary-600 hover:underline"
                      >
                        {order.id}
                      </Link>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm">
                      {order.customer}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm">
                      {format(new Date(order.date), 'MMM dd, yyyy')}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm">
                      {order.amount}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        order.status === 'Delivered' 
                          ? 'bg-green-100 text-green-800' 
                          : order.status === 'Shipped' 
                            ? 'bg-blue-100 text-blue-800' 
                            : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {order.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <Card.Footer className="flex justify-between items-center bg-gray-50 px-4 py-3">
              <button
                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="px-3 py-1 rounded-md border border-gray-300 text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100"
              >
                Previous
              </button>
              <span className="text-sm text-gray-700">
                Page {currentPage} of {totalPages}
              </span>
              <button
                onClick={() => setCurrentPage(p => p + 1)}
                disabled={currentPage >= totalPages}
                className="px-3 py-1 rounded-md border border-gray-300 text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100"
              >
                Next
              </button>
            </Card.Footer>
          )}
        </Card.Body>
      </Card>
    </div>
    </SellerLayout>
  );
}