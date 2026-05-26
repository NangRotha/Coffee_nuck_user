import React from 'react';
import { Link } from 'react-router-dom';
import { FiTrash2, FiMinus, FiPlus, FiShoppingBag, FiArrowLeft } from 'react-icons/fi';
import { motion } from 'framer-motion';
import { useCart } from '../contexts/CartContext';
import { API_BASE_URL } from '../api';

const Cart = () => {
  const { cart, total, updateQuantity, removeFromCart, clearCart } = useCart();

  if (cart.length === 0) {
    return (
      <div className="min-h-screen pt-32 pb-16">
        <div className="container mx-auto px-4 text-center">
          <FiShoppingBag className="text-6xl text-gray-300 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Your cart is empty</h2>
          <p className="text-gray-500 mb-6">Looks like you haven't added any items yet</p>
          <Link to="/menu" className="btn-primary inline-block">
            Browse Menu
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-32 pb-16">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center mb-8">
          <Link to="/menu" className="flex items-center gap-2 text-gray-600 hover:text-primary-500">
            <FiArrowLeft /> Continue Shopping
          </Link>
          <button
            onClick={clearCart}
            className="text-red-500 hover:text-red-600"
          >
            Clear Cart
          </button>
        </div>
        
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h2 className="text-2xl font-bold mb-6">Shopping Cart</h2>
              
              <div className="space-y-4">
                {cart.map((item) => (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="flex gap-4 py-4 border-b"
                  >
                    {/* Image */}
                    <div className="w-24 h-24 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
{item.image ? (
                         <img
                           src={`${API_BASE_URL}${item.image}`}
                           alt={item.name}
                           className="w-full h-full object-cover"
                         />
                       ) : (
                        <div className="w-full h-full flex items-center justify-center text-gray-400">
                          <FiShoppingBag />
                        </div>
                      )}
                    </div>
                    
                    {/* Details */}
                    <div className="flex-1">
                      <div className="flex justify-between mb-2">
                        <h3 className="font-semibold text-gray-800">{item.name}</h3>
                        <button
                          onClick={() => removeFromCart(item.id)}
                          className="text-red-500 hover:text-red-600"
                        >
                          <FiTrash2 />
                        </button>
                      </div>
                      <p className="text-primary-500 font-bold mb-2">
                        ${item.price.toFixed(2)}
                      </p>
                      <div className="flex items-center gap-3">
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          className="w-8 h-8 border rounded-full flex items-center justify-center hover:bg-gray-50"
                        >
                          <FiMinus />
                        </button>
                        <span className="w-8 text-center font-semibold">{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          className="w-8 h-8 border rounded-full flex items-center justify-center hover:bg-gray-50"
                        >
                          <FiPlus />
                        </button>
                      </div>
                    </div>
                    
                    <div className="text-right">
                      <p className="font-bold text-gray-800">
                        ${(item.price * item.quantity).toFixed(2)}
                      </p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
          
          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-lg p-6 sticky top-28">
              <h3 className="text-xl font-bold mb-4">Order Summary</h3>
              
              <div className="space-y-2 mb-4">
                <div className="flex justify-between">
                  <span className="text-gray-600">Subtotal</span>
                  <span className="font-semibold">${total.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Delivery Fee</span>
                  <span className="font-semibold">$0.00</span>
                </div>
                <div className="border-t pt-2 mt-2">
                  <div className="flex justify-between text-lg font-bold">
                    <span>Total</span>
                    <span className="text-primary-500">${total.toFixed(2)}</span>
                  </div>
                </div>
              </div>
              
              <Link
                to="/checkout"
                className="block w-full bg-primary-500 hover:bg-primary-600 text-white text-center py-3 rounded-full font-semibold transition-colors"
              >
                Proceed to Checkout
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;