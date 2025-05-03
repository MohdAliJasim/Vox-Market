
'use client';
import { motion } from 'framer-motion';
import { CheckCircle, ShoppingBag, Truck, Clock } from 'lucide-react';
import Button from '@/app/ui/Button';
import Link from 'next/link';

const ThankYouPage = () => {

  
  // In a real app, you would get these from the location state or API
  const orderNumber = "ORD-" + Math.floor(100000 + Math.random() * 900000);
  const orderDate = new Date().toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
  const estimatedDelivery = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  return (
    <div className="page-transition">
      <section className="py-16 md:py-24 bg-neutral-50">
        <div className="container-custom max-w-3xl">
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="bg-white rounded-xl shadow-sm overflow-hidden"
          >
            <div className="p-8 md:p-12 text-center">
              <div className="w-20 h-20 mx-auto flex items-center justify-center bg-primary-100 text-primary-600 rounded-full mb-6">
                <CheckCircle size={40} />
              </div>
              
              <h1 className="text-3xl md:text-4xl font-bold mb-4">Thank You for Your Order!</h1>
              <p className="text-lg text-neutral-600 mb-8 max-w-xl mx-auto">
                Your order has been successfully placed. We've sent a confirmation email with your order details.
              </p>
              
              <div className="bg-neutral-50 rounded-lg p-6 mb-8 text-left">
                <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-4">
                  <div>
                    <h2 className="text-xl font-semibold">Order Summary</h2>
                    <p className="text-neutral-600 text-sm">Order #{orderNumber}</p>
                  </div>
                  <div className="mt-2 md:mt-0">
                    <p className="text-neutral-600 text-sm">Order Date: {orderDate}</p>
                  </div>
                </div>
                
                <div className="border-t border-neutral-200 my-4"></div>
                
                <div className="space-y-6">
                  <div className="flex items-start">
                    <div className="flex-shrink-0 h-10 w-10 flex items-center justify-center bg-primary-100 text-primary-600 rounded-full">
                      <ShoppingBag size={20} />
                    </div>
                    <div className="ml-4">
                      <h3 className="text-sm font-medium text-neutral-900 mb-1">Order Confirmed</h3>
                      <p className="text-sm text-neutral-600">
                        Your order has been received and is now being processed.
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <div className="flex-shrink-0 h-10 w-10 flex items-center justify-center bg-primary-100 text-primary-600 rounded-full">
                      <Truck size={20} />
                    </div>
                    <div className="ml-4">
                      <h3 className="text-sm font-medium text-neutral-900 mb-1">Shipping Information</h3>
                      <p className="text-sm text-neutral-600">
                        You'll receive a shipping confirmation email with tracking information once your order ships.
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <div className="flex-shrink-0 h-10 w-10 flex items-center justify-center bg-primary-100 text-primary-600 rounded-full">
                      <Clock size={20} />
                    </div>
                    <div className="ml-4">
                      <h3 className="text-sm font-medium text-neutral-900 mb-1">Estimated Delivery</h3>
                      <p className="text-sm text-neutral-600">
                        Your order is expected to be delivered by {estimatedDelivery}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-4">
                <Button href="/browse-product" variant="primary">
                  Continue Shopping
                </Button>
                <Button href="/track-order" variant="outline">
                  Track Your Order
                </Button>
              </div>
            </div>
            
            <div className="bg-neutral-50 p-6 text-center border-t border-neutral-200">
              <p className="text-neutral-600 mb-2">
                If you have any questions or concerns about your order, please{' '}
                <Link href="/contact" className="text-primary-500 hover:text-primary-600">
                  contact our support team
                </Link>.
              </p>
              <p className="text-neutral-500 text-sm">
                Order reference: {orderNumber}
              </p>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default ThankYouPage;