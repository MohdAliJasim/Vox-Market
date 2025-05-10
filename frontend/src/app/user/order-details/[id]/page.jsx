'use client';
import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { Package, Truck, CheckCircle, ArrowLeft } from 'lucide-react';
import Button from '@/app/ui/Button';
import Link from 'next/link';

const OrderDetailsPage = () => {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchOrderDetails = async () => {
      try {
        // Simulate API call
        // Replace with actual API call
        const mockOrder = {
          id: id,
          date: '2024-03-15',
          status: 'processing',
          total: 299.99,
          items: [
            {
              id: 1,
              name: 'Wireless Headphones',
              quantity: 1,
              price: 299.99,
              image: 'https://images.pexels.com/photos/3394650/pexels-photo-3394650.jpeg'
            }
          ],
          shipping: {
            address: '123 Main St',
            city: 'New York',
            state: 'NY',
            zipCode: '10001',
            country: 'United States'
          },
          payment: {
            method: 'Credit Card',
            last4: '4242'
          },
          timeline: [
            {
              status: 'Order Placed',
              date: '2024-03-15T10:00:00Z',
              icon: Package
            },
            {
              status: 'Processing',
              date: '2024-03-15T11:00:00Z',
              icon: Package
            },
            {
              status: 'Shipped',
              date: '2024-03-16T09:00:00Z',
              icon: Truck,
              isCompleted: false
            },
            {
              status: 'Delivered',
              date: null,
              icon: CheckCircle,
              isCompleted: false
            }
          ]
        };
        setOrder(mockOrder);
        setIsLoading(false);
      } catch (error) {
        console.error('Error fetching order details:', error);
        setIsLoading(false);
      }
    };

    if (id) {
      fetchOrderDetails();
    }
  }, [id]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-500"></div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="container-custom py-12">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Order Not Found</h2>
          <p className="text-neutral-600 mb-8">We couldn't find the order you're looking for.</p>
          <Button to="/user/manage-order" variant="primary">
            View All Orders
          </Button>
        </div>
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
        <div className="mb-8">
          <Link
            href="/user/manage-order"
            className="inline-flex items-center text-neutral-600 hover:text-neutral-900"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Orders
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Order Summary */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl shadow-sm p-6 mb-8">
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h1 className="text-2xl font-bold mb-2">Order {order.id}</h1>
                  <p className="text-neutral-600">
                    Placed on {new Date(order.date).toLocaleDateString()}
                  </p>
                </div>
                <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                  order.status === 'delivered'
                    ? 'bg-success-100 text-success-800'
                    : order.status === 'shipped'
                    ? 'bg-primary-100 text-primary-800'
                    : 'bg-warning-100 text-warning-800'
                }`}>
                  {order.status === 'delivered' && <CheckCircle className="h-4 w-4 mr-2" />}
                  {order.status === 'shipped' && <Truck className="h-4 w-4 mr-2" />}
                  {order.status === 'processing' && <Package className="h-4 w-4 mr-2" />}
                  <span className="capitalize">{order.status}</span>
                </span>
              </div>

              <div className="border-t border-neutral-200 pt-6">
                <h2 className="text-lg font-semibold mb-4">Order Items</h2>
                <div className="space-y-4">
                  {order.items.map((item) => (
                    <div key={item.id} className="flex items-center">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-20 h-20 object-cover rounded-lg"
                      />
                      <div className="ml-6 flex-1">
                        <h3 className="font-medium">{item.name}</h3>
                        <p className="text-sm text-neutral-500">Quantity: {item.quantity}</p>
                        <p className="text-sm font-medium">${item.price.toFixed(2)}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Order Timeline */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h2 className="text-lg font-semibold mb-6">Order Timeline</h2>
              <div className="relative">
                <div className="absolute top-0 left-5 h-full w-0.5 bg-neutral-200"></div>
                <div className="space-y-8">
                  {order.timeline.map((event, index) => {
                    const Icon = event.icon;
                    return (
                      <div key={index} className="relative flex items-start">
                        <div className={`absolute left-5 w-0.5 h-full ${
                          index === order.timeline.length - 1 ? 'bg-transparent' : 'bg-neutral-200'
                        }`}></div>
                        <div className={`flex items-center justify-center w-10 h-10 rounded-full ${
                          event.isCompleted === false
                            ? 'bg-neutral-100 text-neutral-400'
                            : 'bg-primary-100 text-primary-600'
                        }`}>
                          <Icon className="h-5 w-5" />
                        </div>
                        <div className="ml-4">
                          <h3 className="font-medium">{event.status}</h3>
                          {event.date && (
                            <p className="text-sm text-neutral-500">
                              {new Date(event.date).toLocaleString()}
                            </p>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>

          {/* Order Details Sidebar */}
          <div>
            <div className="bg-white rounded-xl shadow-sm p-6 sticky top-6">
              <h2 className="text-lg font-semibold mb-4">Order Details</h2>
              
              <div className="space-y-4">
                <div>
                  <h3 className="font-medium mb-2">Shipping Address</h3>
                  <p className="text-sm text-neutral-600">
                    {order.shipping.address}<br />
                    {order.shipping.city}, {order.shipping.state} {order.shipping.zipCode}<br />
                    {order.shipping.country}
                  </p>
                </div>

                <div>
                  <h3 className="font-medium mb-2">Payment Method</h3>
                  <p className="text-sm text-neutral-600">
                    {order.payment.method} ending in {order.payment.last4}
                  </p>
                </div>

                <div className="border-t border-neutral-200 pt-4">
                  <div className="flex justify-between mb-2">
                    <span className="text-neutral-600">Subtotal</span>
                    <span>${order.total.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between mb-2">
                    <span className="text-neutral-600">Shipping</span>
                    <span>Free</span>
                  </div>
                  <div className="flex justify-between mb-2">
                    <span className="text-neutral-600">Tax</span>
                    <span>${(order.total * 0.1).toFixed(2)}</span>
                  </div>
                  <div className="border-t border-neutral-200 pt-2 flex justify-between font-medium">
                    <span>Total</span>
                    <span>${(order.total * 1.1).toFixed(2)}</span>
                  </div>
                </div>

                <div className="mt-6">
                  <Button
                    variant="outline"
                    fullWidth
                    className="mb-3"
                    onClick={() => window.print()}
                  >
                    Print Order
                  </Button>
                  <Button
                    variant="primary"
                    fullWidth
                    href={`mailto:support@example.com?subject=Help with Order ${order.id}`}
                  >
                    Need Help?
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default OrderDetailsPage;