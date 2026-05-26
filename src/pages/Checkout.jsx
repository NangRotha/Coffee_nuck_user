import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiUser, FiPhone, FiMessageSquare, FiCreditCard, FiShield, FiClock, FiArrowLeft } from 'react-icons/fi';
import { motion } from 'framer-motion';
import { useCart } from '../contexts/CartContext';
import { orderAPI, paymentAPI, settingsAPI } from '../api';
import toast from 'react-hot-toast';
import PaymentModal from '../components/PaymentModal';
import SuccessModal from '../components/SuccessModal';
import { formatMoney } from '../utils/format';

const Checkout = () => {
  const navigate = useNavigate();
  const { cart, total, clearCart } = useCart();
  const [loading, setLoading] = useState(false);
  const [paymentModalOpen, setPaymentModalOpen] = useState(false);
  const [successModalOpen, setSuccessModalOpen] = useState(false);
  const [orderData, setOrderData] = useState(null);
  const [completedOrder, setCompletedOrder] = useState(null);
  const [shopName, setShopName] = useState('Coffee Shop');
  const [formData, setFormData] = useState({
    customer_name: '',
    customer_phone: '',
    customer_telegram_id: '',
    notes: ''
  });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    // Check if cart is empty
    if (cart.length === 0) {
      navigate('/menu');
      toast.error('Your cart is empty. Please add items to checkout.');
    }
    
    // Fetch shop settings
    fetchShopSettings();
  }, [cart, navigate]);

  const fetchShopSettings = async () => {
    try {
      const response = await settingsAPI.get();
      setShopName(response.data.shop_name || 'Coffee Shop');
    } catch (error) {
      console.error('Failed to fetch shop settings');
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.customer_name.trim()) {
      newErrors.customer_name = 'Name is required';
    } else if (formData.customer_name.length < 2) {
      newErrors.customer_name = 'Name must be at least 2 characters';
    }
    
    if (!formData.customer_phone.trim()) {
      newErrors.customer_phone = 'Phone number is required';
    } else if (!/^[0-9+\-\s()]{8,15}$/.test(formData.customer_phone)) {
      newErrors.customer_phone = 'Please enter a valid phone number';
    }
    
    if (formData.customer_telegram_id && formData.customer_telegram_id.length < 3) {
      newErrors.customer_telegram_id = 'Telegram ID must be at least 3 characters';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error for this field when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      toast.error('Please fix the form errors');
      return;
    }
    
    setLoading(true);
    
    try {
       // Prepare order items
       const orderItems = cart.map(item => ({
         product_id: item.id,
         product_name: item.name,
         quantity: item.quantity,
         price: (item.price > 0 && item.discount_price > 0 && item.discount_price < item.price) 
                ? item.discount_price 
                : item.price
       }));
      
      // Create order
      const orderResponse = await orderAPI.create({
        ...formData,
        items: orderItems
      });
      
      const order = orderResponse.data;
      
      // Create payment QR
      const paymentResponse = await paymentAPI.createQR(order.id);
      
      setOrderData({
        order: order,
        payment: paymentResponse.data
      });
      
      setPaymentModalOpen(true);
      
    } catch (error) {
      const errorMessage = error.response?.data?.detail || 'Failed to create order. Please try again.';
      toast.error(errorMessage);
      console.error('Checkout error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handlePaymentSuccess = () => {
    setCompletedOrder(orderData);
    setSuccessModalOpen(true);
    clearCart();
  };

  const handleSuccessClose = () => {
    setSuccessModalOpen(false);
    if (completedOrder?.order) {
      navigate('/order-tracking', { state: { order: completedOrder.order } });
    } else {
      navigate('/');
    }
  };

  const subtotal = total;
  const serviceFee = 0;
  const grandTotal = subtotal + serviceFee;

  if (cart.length === 0) {
    return null; // Will redirect in useEffect
  }

  return (
    <div className="min-h-screen pt-24 pb-16 bg-gradient-to-b from-gray-50 to-white">
      <div className="container mx-auto px-4 max-w-6xl">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => navigate('/cart')}
            className="flex items-center gap-2 text-gray-600 hover:text-primary-500 transition-colors mb-4"
          >
            <FiArrowLeft /> Back to Cart
          </button>
          <h1 className="text-3xl md:text-4xl font-bold text-gray-800 text-center font-playfair">
            Checkout
          </h1>
          <p className="text-gray-500 text-center mt-2">
            Complete your order and enjoy delicious coffee
          </p>
        </div>
        
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Checkout Form - Left Column */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="lg:col-span-2"
          >
            <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
              {/* Progress Steps */}
              <div className="bg-gray-50 px-6 py-4 border-b">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-primary-500">
                    <div className="w-8 h-8 bg-primary-500 text-white rounded-full flex items-center justify-center text-sm font-bold">1</div>
                    <span className="font-medium">Information</span>
                  </div>
                  <div className="flex-1 h-px bg-gray-300 mx-4"></div>
                  <div className="flex items-center gap-2 text-gray-400">
                    <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center text-sm font-bold">2</div>
                    <span className="font-medium">Payment</span>
                  </div>
                  <div className="flex-1 h-px bg-gray-300 mx-4"></div>
                  <div className="flex items-center gap-2 text-gray-400">
                    <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center text-sm font-bold">3</div>
                    <span className="font-medium">Complete</span>
                  </div>
                </div>
              </div>
              
              <form onSubmit={handleSubmit} className="p-6 space-y-6">
                {/* Customer Information Section */}
                <div>
                  <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
                    <FiUser className="text-primary-500" />
                    Customer Information
                  </h2>
                  
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Full Name <span className="text-red-500">*</span>
                      </label>
                      <div className="relative">
                        <FiUser className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                        <input
                          type="text"
                          name="customer_name"
                          required
                          value={formData.customer_name}
                          onChange={handleInputChange}
                          className={`pl-10 input-field ${errors.customer_name ? 'border-red-500 focus:ring-red-500' : ''}`}
                          placeholder="Enter your full name"
                        />
                      </div>
                      {errors.customer_name && (
                        <p className="text-xs text-red-500 mt-1">{errors.customer_name}</p>
                      )}
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Phone Number <span className="text-red-500">*</span>
                      </label>
                      <div className="relative">
                        <FiPhone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                        <input
                          type="tel"
                          name="customer_phone"
                          required
                          value={formData.customer_phone}
                          onChange={handleInputChange}
                          className={`pl-10 input-field ${errors.customer_phone ? 'border-red-500 focus:ring-red-500' : ''}`}
                          placeholder="e.g., 012 345 678"
                        />
                      </div>
                      {errors.customer_phone && (
                        <p className="text-xs text-red-500 mt-1">{errors.customer_phone}</p>
                      )}
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Telegram ID <span className="text-gray-400">(Optional)</span>
                      </label>
                      <div className="relative">
                        <FiMessageSquare className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                        <input
                          type="text"
                          name="customer_telegram_id"
                          value={formData.customer_telegram_id}
                          onChange={handleInputChange}
                          className={`pl-10 input-field ${errors.customer_telegram_id ? 'border-red-500 focus:ring-red-500' : ''}`}
                          placeholder="e.g., @username or 123456789"
                        />
                      </div>
                      {errors.customer_telegram_id && (
                        <p className="text-xs text-red-500 mt-1">{errors.customer_telegram_id}</p>
                      )}
                      <p className="text-xs text-gray-500 mt-2 flex items-center gap-1">
                        <FiShield className="text-xs" />
                        We'll send order updates to your Telegram
                      </p>
                    </div>
                  </div>
                </div>
                
                {/* Order Notes Section */}
                <div>
                  <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
                    <FiMessageSquare className="text-primary-500" />
                    Special Instructions
                  </h2>
                  
                  <div>
                    <textarea
                      name="notes"
                      rows="3"
                      value={formData.notes}
                      onChange={handleInputChange}
                      className="input-field"
                      placeholder="Any special requests? (e.g., less sugar, extra hot, etc.)"
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      Let us know if you have any special requirements
                    </p>
                  </div>
                </div>
                
                {/* Payment Methods Section */}
                <div>
                  <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
                    <FiCreditCard className="text-primary-500" />
                    Payment Method
                  </h2>
                  
                  <div className="border-2 border-primary-200 bg-primary-50 rounded-xl p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-white rounded-lg flex items-center justify-center shadow-sm">
                          <FiCreditCard className="text-2xl text-primary-500" />
                        </div>
                        <div>
                          <p className="font-semibold text-gray-800">KHQR Pay</p>
                          <p className="text-xs text-gray-500">Pay with ABA, ACLEDA, Wing, or any bank</p>
                        </div>
                      </div>
                      <div className="w-5 h-5 bg-primary-500 rounded-full flex items-center justify-center">
                        <div className="w-2 h-2 bg-white rounded-full"></div>
                      </div>
                    </div>
                    
                    <div className="mt-3 pt-3 border-t border-primary-200">
                      <div className="flex items-center gap-2 text-xs text-gray-600">
                        <FiShield />
                        <span>Secure payment via KHQR Gateway</span>
                        <FiClock className="ml-2" />
                        <span>Payment expires in 5 minutes</span>
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-primary-500 hover:bg-primary-600 text-white py-3 rounded-xl font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {loading ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
                      Processing...
                    </>
                  ) : (
                    <>
                      <FiCreditCard />
                      Place Order & Pay
                    </>
                  )}
                </button>
                
                <p className="text-center text-xs text-gray-500">
                  By placing your order, you agree to our Terms of Service and Privacy Policy
                </p>
              </form>
            </div>
          </motion.div>
          
          {/* Order Summary - Right Column */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="lg:col-span-1"
          >
            <div className="bg-white rounded-2xl shadow-lg p-6 sticky top-28">
              <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                <FiCreditCard />
                Order Summary
              </h2>
              
              {/* Items List */}
              <div className="max-h-80 overflow-y-auto space-y-3 mb-4">
                {cart.map((item) => (
                  <div key={item.id} className="flex justify-between items-start py-2 border-b">
                    <div className="flex-1">
                      <p className="font-medium text-gray-800">{item.name}</p>
                      <p className="text-xs text-gray-500">Quantity: {item.quantity}</p>
                    </div>
                     <p className="font-semibold text-gray-800">
                       ${formatMoney(((item.price > 0 && item.discount_price > 0 && item.discount_price < item.price) ? item.discount_price : item.price) * item.quantity)}
                     </p>
                  </div>
                ))}
              </div>
              
              {/* Price Breakdown */}
              <div className="space-y-2 pt-4 border-t">
                 <div className="flex justify-between text-sm">
                   <span className="text-gray-600">Subtotal</span>
                   <span className="text-gray-800">${formatMoney(subtotal)}</span>
                 </div>
                 <div className="flex justify-between text-sm">
                   <span className="text-gray-600">Service Fee</span>
                   <span className="text-gray-800">${formatMoney(serviceFee)}</span>
                 </div>
                 <div className="flex justify-between text-lg font-bold pt-2 border-t">
                   <span className="text-gray-800">Total</span>
                   <span className="text-primary-500">${formatMoney(grandTotal)}</span>
                 </div>
              </div>
              
              {/* Estimated Info */}
              <div className="mt-4 bg-gray-50 rounded-lg p-3">
                <div className="flex items-center gap-2 text-sm text-gray-600 mb-2">
                  <FiClock className="text-primary-500" />
                  <span>Estimated Preparation Time</span>
                </div>
                <p className="text-xs text-gray-500">
                  ~15-20 minutes after payment confirmation
                </p>
              </div>
              
              {/* Secure Badge */}
              <div className="mt-4 text-center">
                <div className="flex items-center justify-center gap-2 text-xs text-gray-500">
                  <FiShield />
                  <span>100% Secure Payment</span>
                  <span className="w-1 h-1 bg-gray-300 rounded-full"></span>
                  <span>SSL Encrypted</span>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
      
      {/* Payment Modal */}
      <PaymentModal
        isOpen={paymentModalOpen}
        onClose={() => {
          setPaymentModalOpen(false);
          setOrderData(null);
        }}
        orderData={orderData}
        onSuccess={handlePaymentSuccess}
      />
      
      {/* Success Modal */}
      <SuccessModal
        isOpen={successModalOpen}
        onClose={handleSuccessClose}
        orderData={{
          order: completedOrder?.order,
          shopName: shopName
        }}
      />
    </div>
  );
};

export default Checkout;