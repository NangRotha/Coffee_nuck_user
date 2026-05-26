import React, { useState, useEffect } from 'react';
import { useLocation, Link } from 'react-router-dom';
import { FiCheckCircle, FiClock, FiPackage, FiTruck, FiHome } from 'react-icons/fi';
import { motion } from 'framer-motion';

const OrderTracking = () => {
  const location = useLocation();
  const [order, setOrder] = useState(location.state?.order || null);
  const [currentStep, setCurrentStep] = useState(0);

  const steps = [
    { status: 'pending', label: 'Order Placed', icon: FiClock, description: 'Your order has been received' },
    { status: 'paid', label: 'Payment Confirmed', icon: FiCheckCircle, description: 'Payment has been verified' },
    { status: 'processing', label: 'Preparing', icon: FiPackage, description: 'Your coffee is being prepared' },
    { status: 'completed', label: 'Ready for Pickup', icon: FiTruck, description: 'Your order is ready!' }
  ];

  useEffect(() => {
    if (order) {
      const stepIndex = steps.findIndex(s => s.status === order.status);
      setCurrentStep(stepIndex >= 0 ? stepIndex : 0);
    }
  }, [order]);

  if (!order) {
    return (
      <div className="min-h-screen pt-32 pb-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-2xl font-bold mb-4">No Order Found</h2>
          <Link to="/menu" className="btn-primary inline-block">
            Browse Menu
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-32 pb-16 bg-gray-50">
      <div className="container mx-auto px-4 max-w-3xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl shadow-lg p-8"
        >
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold mb-2">Order Status</h1>
            <p className="text-gray-500">Order ID: {order.transaction_id}</p>
          </div>
          
          {/* Progress Steps */}
          <div className="relative mb-12">
            <div className="absolute top-5 left-0 right-0 h-1 bg-gray-200">
              <div
                className="h-full bg-primary-500 transition-all duration-500"
                style={{ width: `${(currentStep / (steps.length - 1)) * 100}%` }}
              />
            </div>
            
            <div className="relative flex justify-between">
              {steps.map((step, index) => {
                const Icon = step.icon;
                const isCompleted = index <= currentStep;
                const isCurrent = index === currentStep;
                
                return (
                  <div key={step.status} className="text-center">
                    <div
                      className={`w-10 h-10 rounded-full flex items-center justify-center mx-auto mb-2 relative z-10 transition-all duration-300 ${
                        isCompleted
                          ? 'bg-primary-500 text-white'
                          : 'bg-gray-200 text-gray-400'
                      } ${isCurrent ? 'ring-4 ring-primary-200' : ''}`}
                    >
                      <Icon className="text-lg" />
                    </div>
                    <p className="text-sm font-medium">{step.label}</p>
                    <p className="text-xs text-gray-500 mt-1 hidden md:block">{step.description}</p>
                  </div>
                );
              })}
            </div>
          </div>
          
          {/* Order Details */}
          <div className="border-t pt-6">
            <h3 className="font-semibold text-lg mb-4">Order Details</h3>
            <div className="space-y-3 mb-6">
              {order.items?.map((item, index) => (
                <div key={index} className="flex justify-between text-sm">
                  <span>{item.product_name} x{item.quantity}</span>
                  <span className="font-semibold">${(item.price * item.quantity).toFixed(2)}</span>
                </div>
              ))}
            </div>
            
            <div className="border-t pt-4">
              <div className="flex justify-between text-lg font-bold">
                <span>Total</span>
                <span className="text-primary-500">${order.total_amount?.toFixed(2)}</span>
              </div>
            </div>
            
            <div className="mt-6 bg-gray-50 rounded-lg p-4">
              <p className="text-sm text-gray-600 mb-2">
                <span className="font-semibold">Customer:</span> {order.customer_name}
              </p>
              <p className="text-sm text-gray-600">
                <span className="font-semibold">Phone:</span> {order.customer_phone}
              </p>
              {order.notes && (
                <p className="text-sm text-gray-600 mt-2">
                  <span className="font-semibold">Notes:</span> {order.notes}
                </p>
              )}
            </div>
          </div>
          
          <div className="mt-8 text-center">
            <Link to="/menu" className="inline-flex items-center gap-2 text-primary-500 hover:text-primary-600">
              <FiHome /> Back to Menu
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default OrderTracking;