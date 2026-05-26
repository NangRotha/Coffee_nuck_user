import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FiCoffee, FiMapPin, FiPhone, FiMail, FiClock, FiFacebook, FiInstagram, FiTwitter, FiHeart } from 'react-icons/fi';
import { settingsAPI } from '../api';

const Footer = () => {
  const [settings, setSettings] = useState({
    shop_name: 'Coffee Shop',
    address: '',
    phone: '',
    email: '',
    opening_hours: ''
  });

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const response = await settingsAPI.get();
      setSettings(response.data);
    } catch (error) {
      console.error('Failed to fetch settings');
    }
  };

  return (
    <footer className="bg-gray-900 text-white pt-12 pb-6">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <FiCoffee className="text-2xl text-primary-500" />
              <h3 className="text-xl font-bold">{settings.shop_name}</h3>
            </div>
            <p className="text-gray-400 mb-4">
              Serving the finest coffee in town. Quality beans, perfect brewing, and warm smiles.
            </p>
            <div className="flex gap-3">
              <a href="#" className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-primary-500 transition-colors">
                <FiFacebook />
              </a>
              <a href="#" className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-primary-500 transition-colors">
                <FiInstagram />
              </a>
              <a href="#" className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-primary-500 transition-colors">
                <FiTwitter />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li><Link to="/" className="text-gray-400 hover:text-primary-400 transition-colors">Home</Link></li>
              <li><Link to="/menu" className="text-gray-400 hover:text-primary-400 transition-colors">Menu</Link></li>
              <li><Link to="/about" className="text-gray-400 hover:text-primary-400 transition-colors">About Us</Link></li>
              <li><Link to="/events" className="text-gray-400 hover:text-primary-400 transition-colors">Events</Link></li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Contact Info</h3>
            <ul className="space-y-3">
              {settings.address && (
                <li className="flex items-start gap-3">
                  <FiMapPin className="text-primary-500 mt-1" />
                  <span className="text-gray-400 text-sm">{settings.address}</span>
                </li>
              )}
              {settings.phone && (
                <li className="flex items-center gap-3">
                  <FiPhone className="text-primary-500" />
                  <span className="text-gray-400">{settings.phone}</span>
                </li>
              )}
              {settings.email && (
                <li className="flex items-center gap-3">
                  <FiMail className="text-primary-500" />
                  <span className="text-gray-400">{settings.email}</span>
                </li>
              )}
              {settings.opening_hours && (
                <li className="flex items-start gap-3">
                  <FiClock className="text-primary-500 mt-1" />
                  <span className="text-gray-400 text-sm">{settings.opening_hours}</span>
                </li>
              )}
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Newsletter</h3>
            <p className="text-gray-400 mb-3">Subscribe for special offers and updates!</p>
            <form className="flex">
              <input
                type="email"
                placeholder="Your email"
                className="flex-1 px-4 py-2 rounded-l-lg focus:outline-none text-gray-800"
              />
              <button className="bg-primary-500 hover:bg-primary-600 px-4 py-2 rounded-r-lg transition-colors">
                Subscribe
              </button>
            </form>
          </div>
        </div>

        <div className="border-t border-gray-800 pt-6 text-center">
          <p className="text-gray-400 text-sm">
            © 2024 {settings.shop_name}. All rights reserved. Made with <FiHeart className="inline text-red-500" /> for coffee lovers.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;