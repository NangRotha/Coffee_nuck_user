import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FiArrowRight, FiCoffee } from 'react-icons/fi';
import { motion } from 'framer-motion';
import { settingsAPI, API_BASE_URL } from '../api';

const Hero = () => {
  const [bannerUrl, setBannerUrl] = useState(null);

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const response = await settingsAPI.get();
      if (response.data.banner_url) {
        setBannerUrl(`${API_BASE_URL}${response.data.banner_url}`);
      }
    } catch (error) {
      console.error('Failed to fetch settings');
    }
  };

  return (
    <section className="relative h-screen flex items-center justify-center overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <img 
          src={bannerUrl || "https://images.unsplash.com/photo-1442512595331-e89e73853f31?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80"}
          alt="Coffee background"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/50"></div>
      </div>

      {/* Content */}
      <div className="relative z-10 text-center text-white px-4">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <div className="flex justify-center mb-4">
            <FiCoffee className="text-6xl text-primary-500 animate-pulse" />
          </div>
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-4 font-playfair">
            Welcome to <span className="text-primary-500">Coffee Paradise</span>
          </h1>
          <p className="text-lg md:text-xl mb-8 max-w-2xl mx-auto">
            Experience the perfect blend of rich aroma, smooth taste, and cozy ambiance.
            Start your day with the finest coffee in town.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/menu" className="btn-primary inline-flex items-center justify-center gap-2">
              Explore Menu <FiArrowRight />
            </Link>
            <Link to="/about" className="btn-secondary inline-flex items-center justify-center gap-2">
              Learn More
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default Hero;