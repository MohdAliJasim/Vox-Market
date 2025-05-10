'use client';
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Trash2, Plus, Minus, ShoppingBag } from 'lucide-react';
import Button from '@/app/ui/Button';
import { useCart } from '@/context/CartContext';
import { useRouter } from 'next/navigation';

const CartPage = () => {
  const { cartitems, removeFromCart, updateQuantity } = useCart();
  const [subtotal, setSubtotal] = useState(0);
  const router = useRouter();

  useEffect(() => {
    const total = cartitems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    setSubtotal(total);
  }, [cartitems]);

  const handleQuantityChange = (productId, newQuantity) => {
    if (newQuantity >= 1) {
      updateQuantity(productId, newQuantity);
    }
  };

  const handleRemoveItem = (productId) => {
    removeFromCart(productId);
  };

  const handleCheckout = () => {
    router.push('/checkout');
  };

  return (
    <div className="container-custom py-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-2xl font-bold mb-8">Shopping Cart</h1>

        {cartitems.length === 0 ? (
          <div className="bg-white rounded-xl shadow-sm p-8 text-center">
            <ShoppingBag className="mx-auto h-12 w-12 text-neutral-400 mb-4" />
            <h2 className="text-xl font-semibold mb-2">Your cart is empty</h2>
            <p className="text-neutral-600 mb-6">
              Looks like you haven't added any items to your cart yet.
            </p>
            <Button to="/browse-product" variant="primary">
              Continue Shopping
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Cart Items */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-xl shadow-sm overflow-hidden">
                <div className="divide-y divide-neutral-200">
                  {cartitems.map((item) => (
                    <div key={item.productid} className="p-6">
                      <div className="flex items-center">
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-20 h-20 object-cover rounded-lg"
                        />
                        <div className="ml-6 flex-1">
                          <h3 className="text-lg font-medium">{item.name}</h3>
                          <p className="text-neutral-500">${item.price.toFixed(2)}</p>
                        </div>
                        <div className="flex items-center space-x-4">
                          <div className="flex items-center border border-neutral-200 rounded-lg">
                            <button
                              onClick={() => handleQuantityChange(item.productid, item.quantity - 1)}
                              className="p-2 hover:bg-neutral-50"
                            >
                              <Minus size={16} />
                            </button>
                            <span className="px-4">{item.quantity}</span>
                            <button
                              onClick={() => handleQuantityChange(item.productid, item.quantity + 1)}
                              className="p-2 hover:bg-neutral-50"
                            >
                              <Plus size={16} />
                            </button>
                          </div>
                          <button
                            onClick={() => handleRemoveItem(item.productid)}
                            className="text-error-500 hover:text-error-600"
                          >
                            <Trash2 size={20} />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-xl shadow-sm p-6">
                <h2 className="text-xl font-semibold mb-4">Order Summary</h2>
                <div className="space-y-4">
                  <div className="flex justify-between">
                    <span>Subtotal</span>
                    <span>${subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Shipping</span>
                    <span>Free</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Tax</span>
                    <span>${(subtotal * 0.1).toFixed(2)}</span>
                  </div>
                  <div className="border-t border-neutral-200 pt-4">
                    <div className="flex justify-between font-semibold">
                      <span>Total</span>
                      <span>${(subtotal + (subtotal * 0.1)).toFixed(2)}</span>
                    </div>
                  </div>
                </div>
                <Button
                  variant="primary"
                  fullWidth
                  className="mt-6"
                  onClick={handleCheckout}
                >
                  Proceed to Checkout
                </Button>
                <Button
                  to="/browse-product"
                  variant="outline"
                  fullWidth
                  className="mt-4"
                >
                  Continue Shopping
                </Button>
              </div>
            </div>
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default CartPage;