import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FiCheckCircle, FiShoppingBag, FiClock, FiPrinter, FiHome, FiCoffee } from 'react-icons/fi';
import { motion, AnimatePresence } from 'framer-motion';

const SuccessModal = ({ isOpen, onClose, orderData }) => {
  useEffect(() => {
    if (isOpen) {
      // Auto close after 10 seconds
      const timer = setTimeout(() => {
        onClose();
      }, 10000);
      
      return () => clearTimeout(timer);
    }
  }, [isOpen, onClose]);

  if (!isOpen || !orderData) return null;

  const handlePrint = () => {
    const printWindow = window.open('', '_blank');
    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
      <head>
        <title>Order Receipt - ${orderData.order?.transaction_id}</title>
        <style>
          body {
            font-family: Arial, sans-serif;
            padding: 40px;
            max-width: 400px;
            margin: 0 auto;
          }
          .header {
            text-align: center;
            border-bottom: 2px solid #333;
            padding-bottom: 20px;
            margin-bottom: 20px;
          }
          .order-details {
            margin-bottom: 20px;
          }
          .items {
            border-top: 1px solid #ddd;
            border-bottom: 1px solid #ddd;
            padding: 10px 0;
            margin: 10px 0;
          }
          .item {
            display: flex;
            justify-content: space-between;
            margin: 5px 0;
          }
          .total {
            font-size: 18px;
            font-weight: bold;
            text-align: right;
            margin-top: 10px;
          }
          .footer {
            text-align: center;
            margin-top: 30px;
            font-size: 12px;
            color: #666;
          }
        </style>
      </head>
      <body>
        <div class="header">
          <h2>${orderData.shopName || 'Coffee Shop'}</h2>
          <p>Order Receipt</p>
        </div>
        <div class="order-details">
          <p><strong>Order ID:</strong> ${orderData.order?.transaction_id}</p>
          <p><strong>Date:</strong> ${new Date().toLocaleString()}</p>
          <p><strong>Customer:</strong> ${orderData.order?.customer_name}</p>
          <p><strong>Phone:</strong> ${orderData.order?.customer_phone}</p>
        </div>
        <div class="items">
          ${orderData.order?.items?.map(item => `
            <div class="item">
              <span>${item.product_name} x${item.quantity}</span>
              <span>$${(item.price * item.quantity).toFixed(2)}</span>
            </div>
          `).join('')}
        </div>
        <div class="total">
          Total: $${orderData.order?.total_amount?.toFixed(2)}
        </div>
        <div class="footer">
          <p>Thank you for choosing us!</p>
          <p>Your order will be ready for pickup soon.</p>
        </div>
      </body>
      </html>
    `);
    printWindow.document.close();
    printWindow.print();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50"
            onClick={onClose}
          />
          
          {/* Modal */}
          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 50 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 50 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50 w-full max-w-md"
          >
            <div className="bg-white rounded-2xl shadow-2xl overflow-hidden">
              {/* Success Animation Header */}
              <div className="relative bg-gradient-to-r from-green-500 to-emerald-600 py-8">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: 'spring', delay: 0.2 }}
                  className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
                >
                  <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center">
                    <FiCheckCircle className="text-5xl text-green-500" />
                  </div>
                </motion.div>
              </div>
              
              {/* Content */}
              <div className="p-6 text-center">
                <motion.h2
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="text-2xl font-bold text-gray-800 mb-2"
                >
                  Order Placed Successfully!
                </motion.h2>
                
                <motion.p
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                  className="text-gray-500 mb-6"
                >
                  Thank you for your order. We'll notify you when it's ready.
                </motion.p>
                
                {/* Order Info */}
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                  className="bg-gray-50 rounded-xl p-4 mb-6"
                >
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm text-gray-500">Order ID</span>
                    <span className="text-sm font-mono font-semibold text-gray-800">
                      {orderData.order?.transaction_id}
                    </span>
                  </div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm text-gray-500">Total Amount</span>
                    <span className="text-lg font-bold text-primary-500">
                      ${orderData.order?.total_amount?.toFixed(2)}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-500">Est. Pickup Time</span>
                    <span className="text-sm font-semibold text-gray-700 flex items-center gap-1">
                      <FiClock className="text-xs" />
                      {new Date(Date.now() + 15 * 60000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                </motion.div>
                
                {/* Order Items Preview */}
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6 }}
                  className="text-left mb-6"
                >
                  <p className="text-sm font-semibold text-gray-700 mb-2">Order Summary:</p>
                  <div className="space-y-1 max-h-32 overflow-y-auto">
                    {orderData.order?.items?.slice(0, 3).map((item, index) => (
                      <div key={index} className="flex justify-between text-sm">
                        <span className="text-gray-600">{item.product_name} x{item.quantity}</span>
                        <span className="text-gray-800">${(item.price * item.quantity).toFixed(2)}</span>
                      </div>
                    ))}
                    {orderData.order?.items?.length > 3 && (
                      <p className="text-xs text-gray-500 text-center">
                        +{orderData.order.items.length - 3} more items
                      </p>
                    )}
                  </div>
                </motion.div>
                
                {/* Action Buttons */}
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.7 }}
                  className="space-y-3"
                >
                  <Link
                    to={`/order-tracking`}
                    state={{ order: orderData.order }}
                    className="flex items-center justify-center gap-2 w-full bg-primary-500 hover:bg-primary-600 text-white py-3 rounded-xl font-semibold transition-colors"
                  >
                    <FiCoffee className="text-lg" />
                    Track Your Order
                  </Link>
                  
                  <div className="flex gap-3">
                    <button
                      onClick={handlePrint}
                      className="flex-1 flex items-center justify-center gap-2 border-2 border-gray-300 hover:border-primary-500 text-gray-700 hover:text-primary-500 py-2 rounded-xl font-medium transition-colors"
                    >
                      <FiPrinter />
                      Print Receipt
                    </button>
                    
                    <Link
                      to="/menu"
                      onClick={onClose}
                      className="flex-1 flex items-center justify-center gap-2 bg-gray-100 hover:bg-gray-200 text-gray-700 py-2 rounded-xl font-medium transition-colors"
                    >
                      <FiShoppingBag />
                      Order More
                    </Link>
                  </div>
                  
                  <Link
                    to="/"
                    onClick={onClose}
                    className="flex items-center justify-center gap-2 text-gray-500 hover:text-gray-600 text-sm py-2"
                  >
                    <FiHome />
                    Back to Home
                  </Link>
                </motion.div>
              </div>
              
              {/* Close Button */}
              <button
                onClick={onClose}
                className="absolute top-4 right-4 text-white hover:text-gray-200 transition-colors"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            {/* Auto-close countdown indicator */}
            <div className="mt-4 text-center">
              <div className="inline-flex items-center gap-2 bg-white/90 backdrop-blur-sm rounded-full px-4 py-2 shadow-lg">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span className="text-xs text-gray-600">
                  This window will close automatically in a few seconds
                </span>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default SuccessModal;