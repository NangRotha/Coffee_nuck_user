import React, { useState } from 'react';
import { FiShoppingCart, FiHeart, FiStar } from 'react-icons/fi';
import { motion } from 'framer-motion';
import { useCart } from '../contexts/CartContext';
import toast from 'react-hot-toast';
import { API_BASE_URL } from '../api';
import { formatMoney } from '../utils/format';

const ProductCard = ({ product }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isLiked, setIsLiked] = useState(false);
  const { addToCart } = useCart();

  const handleAddToCart = () => {
    if (product.status === 'out_of_stock') {
      toast.error('Sorry, this product is out of stock!');
      return;
    }
    addToCart(product, 1);
  };

    const discount = product.price > 0 && product.discount_price > 0 && product.discount_price < product.price
      ? Math.round(((product.price - product.discount_price) / product.price) * 100)
      : 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -5 }}
      transition={{ duration: 0.3 }}
      className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Image Container */}
      <div className="relative h-64 overflow-hidden bg-gray-100">
        {product.image ? (
          <img
            src={`${API_BASE_URL}${product.image}`}
            alt={product.name}
            className="w-full h-full object-cover transition-transform duration-500"
            style={{ transform: isHovered ? 'scale(1.1)' : 'scale(1)' }}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-400">
            <FiShoppingCart className="text-6xl" />
          </div>
        )}
        
        {/* Discount Badge */}
        {discount > 0 && (
          <div className="absolute top-3 left-3 bg-red-500 text-white px-2 py-1 rounded-lg text-sm font-bold">
            {discount}% OFF
          </div>
        )}
        
        {/* Stock Badge */}
        {product.status === 'out_of_stock' && (
          <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
            <span className="bg-red-500 text-white px-4 py-2 rounded-full font-bold">
              Out of Stock
            </span>
          </div>
        )}
        
        {/* Like Button */}
        <button
          onClick={() => setIsLiked(!isLiked)}
          className="absolute top-3 right-3 bg-white/90 p-2 rounded-full shadow-md hover:bg-white transition-colors"
        >
          <FiHeart className={`text-xl ${isLiked ? 'text-red-500 fill-red-500' : 'text-gray-600'}`} />
        </button>
      </div>
      
      {/* Content */}
      <div className="p-5">
        {/* Category */}
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs text-primary-500 font-semibold uppercase tracking-wide">
            {product.category}
          </span>
          <div className="flex items-center gap-1">
            <FiStar className="text-yellow-400 text-sm fill-yellow-400" />
            <span className="text-sm text-gray-600">4.5</span>
          </div>
        </div>
        
        {/* Name */}
        <h3 className="text-xl font-semibold text-gray-800 mb-2 font-playfair">
          {product.name}
        </h3>
        
        {/* Description */}
        <p className="text-gray-600 text-sm mb-4 line-clamp-2">
          {product.description || 'A delicious coffee beverage made with premium ingredients.'}
        </p>
        
        {/* Price */}
        <div className="flex items-center justify-between mb-4">
          <div>
              {product.price > 0 && product.discount_price > 0 && product.discount_price < product.price ? (
                <div>
                  <span className="text-2xl font-bold text-primary-500">
                    ${formatMoney(product.discount_price)}
                  </span>
                  <span className="text-sm text-gray-400 line-through ml-2">
                    ${formatMoney(product.price)}
                  </span>
                </div>
              ) : (
                <span className="text-2xl font-bold text-primary-500">
                  ${formatMoney(product.price)}
                </span>
              )}
          </div>
          {product.stock_quantity < 10 && product.stock_quantity > 0 && (
            <span className="text-xs text-orange-500">
              Only {product.stock_quantity} left!
            </span>
          )}
        </div>
        
        {/* Add to Cart Button */}
        <button
          onClick={handleAddToCart}
          disabled={product.status === 'out_of_stock'}
          className={`w-full py-3 rounded-full font-semibold transition-all duration-300 flex items-center justify-center gap-2 ${
            product.status === 'out_of_stock'
              ? 'bg-gray-300 cursor-not-allowed text-gray-500'
              : 'bg-primary-500 hover:bg-primary-600 text-white hover:shadow-lg transform hover:scale-105'
          }`}
        >
          <FiShoppingCart />
          {product.status === 'out_of_stock' ? 'Out of Stock' : 'Add to Cart'}
        </button>
      </div>
    </motion.div>
  );
};

export default ProductCard;