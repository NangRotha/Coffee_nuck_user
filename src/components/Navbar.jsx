import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { FiCoffee, FiShoppingCart, FiMenu, FiX, FiHome, FiInfo, FiCalendar, FiShoppingBag } from 'react-icons/fi';
import { useCart } from '../contexts/CartContext';
import { settingsAPI, API_BASE_URL } from '../api';

const Navbar = ({ onCartClick }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [shopName, setShopName] = useState('Coffee Shop');
  const [logo, setLogo] = useState(null);
  const { getCartCount } = useCart();
  const location = useLocation();

  useEffect(() => {
    fetchSettings();
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const fetchSettings = async () => {
    try {
      const response = await settingsAPI.get();
      setShopName(response.data.shop_name);
      if (response.data.logo_url) {
        setLogo(`${API_BASE_URL}${response.data.logo_url}`);
      }
    } catch (error) {
      console.error('Failed to fetch settings');
    }
  };

  const handleScroll = () => {
    setIsScrolled(window.scrollY > 50);
  };

  const navLinks = [
    { path: '/', name: 'Home', icon: FiHome },
    { path: '/menu', name: 'Menu', icon: FiShoppingBag },
    { path: '/about', name: 'About', icon: FiInfo },
    { path: '/events', name: 'Events', icon: FiCalendar },
  ];

  const cartCount = getCartCount();

  return (
    <>
      <nav className={`fixed top-0 w-full z-50 transition-all duration-300 ${
        isScrolled ? 'bg-white shadow-lg py-3' : 'bg-gradient-to-b from-black/50 to-transparent py-5'
      }`}>
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-2">
              {logo ? (
                <img src={logo} alt={shopName} className="h-10 w-auto" />
              ) : (
                <FiCoffee className={`text-2xl ${isScrolled ? 'text-primary-500' : 'text-white'}`} />
              )}
              <span className={`font-playfair text-xl font-bold ${isScrolled ? 'text-gray-800' : 'text-white'}`}>
                {shopName}
              </span>
            </Link>

            {/* Desktop Menu */}
            <div className="hidden md:flex items-center gap-8">
              {navLinks.map((link) => {
                const Icon = link.icon;
                const isActive = location.pathname === link.path;
                return (
                  <Link
                    key={link.path}
                    to={link.path}
                    className={`flex items-center gap-1 transition-colors ${
                      isScrolled 
                        ? isActive ? 'text-primary-500' : 'text-gray-600 hover:text-primary-500'
                        : isActive ? 'text-primary-300' : 'text-white hover:text-primary-200'
                    }`}
                  >
                    <Icon className="text-sm" />
                    <span>{link.name}</span>
                  </Link>
                );
              })}
            </div>

            {/* Cart Button */}
            <div className="flex items-center gap-4">
              <button
                onClick={onCartClick}
                className={`relative p-2 rounded-full transition-colors ${
                  isScrolled ? 'hover:bg-gray-100' : 'hover:bg-white/20'
                }`}
              >
                <FiShoppingCart className={`text-xl ${isScrolled ? 'text-gray-700' : 'text-white'}`} />
                {cartCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-primary-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                    {cartCount}
                  </span>
                )}
              </button>

              {/* Mobile Menu Button */}
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="md:hidden p-2 rounded-full hover:bg-white/20"
              >
                {isMobileMenuOpen ? (
                  <FiX className={`text-xl ${isScrolled ? 'text-gray-700' : 'text-white'}`} />
                ) : (
                  <FiMenu className={`text-xl ${isScrolled ? 'text-gray-700' : 'text-white'}`} />
                )}
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 bg-white z-40 pt-20 px-4">
          <div className="flex flex-col gap-4">
            {navLinks.map((link) => {
              const Icon = link.icon;
              const isActive = location.pathname === link.path;
              return (
                <Link
                  key={link.path}
                  to={link.path}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`flex items-center gap-3 py-3 px-4 rounded-lg transition-colors ${
                    isActive ? 'bg-primary-50 text-primary-500' : 'text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  <Icon className="text-xl" />
                  <span className="font-medium">{link.name}</span>
                </Link>
              );
            })}
          </div>
        </div>
      )}
    </>
  );
};

export default Navbar;