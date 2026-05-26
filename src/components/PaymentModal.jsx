import React, { useState, useEffect } from 'react';
import { FiX, FiCheckCircle, FiClock, FiRefreshCw } from 'react-icons/fi';
import { motion, AnimatePresence } from 'framer-motion';
import { paymentAPI } from '../api';
import toast from 'react-hot-toast';

const PaymentModal = ({ isOpen, onClose, orderData, onSuccess }) => {
  const [verifying, setVerifying] = useState(false);
  const [verified, setVerified] = useState(false);
  const [timeLeft, setTimeLeft] = useState(300); // 5 minutes

  useEffect(() => {
    if (isOpen && orderData) {
      startVerification();
      startTimer();
    }
  }, [isOpen, orderData]);

  const startTimer = () => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    
    return () => clearInterval(timer);
  };

  const startVerification = () => {
    const interval = setInterval(async () => {
      if (verified) {
        clearInterval(interval);
        return;
      }
      
      setVerifying(true);
      try {
        const response = await paymentAPI.verify(orderData?.order?.transaction_id);
        if (response.data.verified) {
          setVerified(true);
          clearInterval(interval);
          toast.success('Payment successful!');
          setTimeout(() => {
            onSuccess();
          }, 2000);
        }
      } catch (error) {
        console.error('Verification failed:', error);
      } finally {
        setVerifying(false);
      }
    }, 3000); // Check every 3 seconds
    
    return () => clearInterval(interval);
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  if (!isOpen || !orderData) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="bg-white rounded-2xl shadow-xl max-w-md w-full"
      >
        <div className="p-6">
          {/* Header */}
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold">Payment</h2>
            {!verified && (
              <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
                <FiX className="text-2xl" />
              </button>
            )}
          </div>
          
          {!verified ? (
            <>
              {/* QR Code */}
              <div className="text-center mb-6">
                <div className="bg-gray-100 p-4 rounded-2xl inline-block mb-4">
                  {orderData.payment?.qr_data ? (
                    <div className="w-64 h-64 bg-white flex items-center justify-center">
                      {/* QR code would be rendered here using a QR library */}
                      <div className="text-center">
                        <div className="w-48 h-48 bg-gray-200 flex items-center justify-center">
                          <img 
                            src={`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${orderData.payment.qr_data}`}
                            alt="QR Code"
                            className="w-full h-full"
                          />
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="w-64 h-64 bg-gray-200 flex items-center justify-center">
                      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500"></div>
                    </div>
                  )}
                </div>
                
                <p className="text-gray-700 mb-2">
                  Amount: <span className="font-bold text-primary-500">${orderData.order?.total_amount?.toFixed(2)}</span>
                </p>
                <p className="text-sm text-gray-500 mb-4">
                  Order ID: {orderData.order?.transaction_id}
                </p>
                
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 mb-4">
                  <div className="flex items-center justify-center gap-2 text-yellow-700">
                    <FiClock />
                    <span>Payment expires in: <span className="font-bold">{formatTime(timeLeft)}</span></span>
                  </div>
                </div>
                
                <div className="flex items-center justify-center gap-2 text-gray-500 mb-4">
                  {verifying && <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary-500"></div>}
                  <span className="text-sm">Waiting for payment confirmation...</span>
                </div>
                
                <ol className="text-left text-sm text-gray-600 space-y-2 bg-gray-50 p-4 rounded-lg mb-4">
                  <li className="flex gap-2">
                    <span className="font-bold text-primary-500">1.</span>
                    Open your banking app (ABA, ACLEDA, Wing, etc.)
                  </li>
                  <li className="flex gap-2">
                    <span className="font-bold text-primary-500">2.</span>
                    Scan the QR code above
                  </li>
                  <li className="flex gap-2">
                    <span className="font-bold text-primary-500">3.</span>
                    Confirm payment amount: <span className="font-bold">${orderData.order?.total_amount?.toFixed(2)}</span>
                  </li>
                  <li className="flex gap-2">
                    <span className="font-bold text-primary-500">4.</span>
                    Complete the payment
                  </li>
                </ol>
              </div>
              
              <button
                onClick={onClose}
                className="w-full border border-gray-300 py-2 rounded-full text-gray-600 hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
            </>
          ) : (
            /* Success State */
            <div className="text-center py-8">
              <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <FiCheckCircle className="text-4xl text-green-500" />
              </div>
              <h3 className="text-2xl font-bold text-gray-800 mb-2">Payment Successful!</h3>
              <p className="text-gray-600 mb-4">
                Thank you for your order! We'll prepare your coffee right away.
              </p>
              <p className="text-sm text-gray-500">
                Order ID: {orderData.order?.transaction_id}
              </p>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
};

export default PaymentModal;