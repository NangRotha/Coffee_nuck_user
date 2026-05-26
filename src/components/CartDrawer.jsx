import React from 'react';
import { Link } from 'react-router-dom';
import { FiX, FiMinus, FiPlus, FiTrash2, FiShoppingBag } from 'react-icons/fi';
import { motion, AnimatePresence } from 'framer-motion';
import { useCart } from '../contexts/CartContext';
import { API_BASE_URL } from '../api';

const CartDrawer = ({ isOpen, onClose }) => {
  const { cart, total, updateQuantity, removeFromCart } = useCart();

  const itemCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/50 z-50"
          />
          
          {/* Drawer */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'tween', duration: 0.3 }}
            className="fixed right-0 top-0 h-full w-full max-w-md bg-white shadow-2xl z-50 flex flex-col"
          >
            {/* Header */}
            <div className="flex justify-between items-center p-6 border-b">
              <div>
                <h2 className="text-2xl font-bold text-gray-800">Your Cart</h2>
                <p className="text-sm text-gray-500">{itemCount} {itemCount === 1 ? 'item' : 'items'}</p>
              </div>
              <button
                onClick={onClose}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              >
                <FiX className="text-2xl" />
              </button>
            </div>
            
            {/* Cart Items */}
            <div className="flex-1 overflow-y-auto p-6">
              {cart.length === 0 ? (
                <div className="text-center py-12">
                  <FiShoppingBag className="text-6xl text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-500">Your cart is empty</p>
                  <Link
                    to="/menu"
                    onClick={onClose}
                    className="inline-block mt-4 text-primary-500 hover:text-primary-600"
                  >
                    Browse Menu →
                  </Link>
                </div>
              ) : (
                <div className="space-y-4">
                  {cart.map((item) => (
                    <div key={item.id} className="flex gap-4 py-4 border-b">
                      {/* Image */}
                      <div className="w-20 h-20 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
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
                        <div className="flex justify-between mb-1">
                          <h3 className="font-semibold text-gray-800">{item.name}</h3>
                          <button
                            onClick={() => removeFromCart(item.id)}
                            className="text-red-500 hover:text-red-600"
                          >
                            <FiTrash2 className="text-sm" />
                          </button>
                        </div>
                        <p className="text-primary-500 font-bold mb-2">
                          ${(item.price * item.quantity).toFixed(2)}
                        </p>
                        <div className="flex items-center gap-3">
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                            className="w-8 h-8 border rounded-full flex items-center justify-center hover:bg-gray-50"
                          >
                            <FiMinus className="text-sm" />
                          </button>
                          <span className="w-8 text-center font-semibold">{item.quantity}</span>
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            className="w-8 h-8 border rounded-full flex items-center justify-center hover:bg-gray-50"
                          >
                            <FiPlus className="text-sm" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
            
            {/* Footer */}
            {cart.length > 0 && (
              <div className="border-t p-6 space-y-4">
                <div className="flex justify-between text-lg font-semibold">
                  <span>Total</span>
                  <span className="text-primary-500">${total.toFixed(2)}</span>
                </div>
                <Link
                  to="/checkout"
                  onClick={onClose}
                  className="block w-full bg-primary-500 hover:bg-primary-600 text-white text-center py-3 rounded-full font-semibold transition-colors"
                >
                  Proceed to Checkout
                </Link>
                <button
                  onClick={onClose}
                  className="w-full text-gray-500 hover:text-gray-600 text-sm"
                >
                  Continue Shopping
                </button>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default CartDrawer;