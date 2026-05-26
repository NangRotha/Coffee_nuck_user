import React, { useState, useEffect } from 'react';
import { FiCoffee, FiHeart, FiStar, FiUsers, FiAward, FiClock } from 'react-icons/fi';
import { motion } from 'framer-motion';
import { staffAPI, settingsAPI } from '../api';
import StaffSection from '../components/StaffSection';

const About = () => {
  const [settings, setSettings] = useState({});
  const [stats, setStats] = useState({
    years: 5,
    customers: 10000,
    staff: 0,
    awards: 3
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [staffRes, settingsRes] = await Promise.all([
        staffAPI.getAll(),
        settingsAPI.get()
      ]);
      setStats(prev => ({ ...prev, staff: staffRes.data.length }));
      setSettings(settingsRes.data);
    } catch (error) {
      console.error('Failed to fetch data');
    }
  };

  const features = [
    { icon: FiCoffee, title: 'Premium Beans', description: 'Sourced from the best coffee farms worldwide' },
    { icon: FiHeart, title: 'Passionate Team', description: 'Dedicated baristas crafting perfect cups' },
    { icon: FiStar, title: 'Quality Guarantee', description: 'Every cup meets our high standards' },
    { icon: FiClock, title: 'Fast Service', description: 'Quick preparation without compromising quality' }
  ];

  return (
    <div className="pt-24 pb-16">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-primary-500 to-primary-700 text-white py-20">
        <div className="container mx-auto px-4 text-center">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-5xl font-bold mb-4 font-playfair"
          >
            About {settings.shop_name || 'Our Coffee Shop'}
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-lg max-w-2xl mx-auto"
          >
            Crafting memorable coffee experiences since 2019
          </motion.p>
        </div>
      </section>

      {/* Story Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="section-title">Our Story</h2>
            <p className="text-gray-600 mb-6 leading-relaxed">
              {settings.about_text || `Founded with a passion for exceptional coffee, ${settings.shop_name || 'our coffee shop'} has grown from a small dream to a beloved local destination. We believe that a great cup of coffee has the power to bring people together, spark conversations, and create lasting memories.`}
            </p>
            <p className="text-gray-600 leading-relaxed">
              Every bean we source is carefully selected from sustainable farms, and every cup is brewed with precision and care. Our team of dedicated baristas undergoes extensive training to ensure that you receive nothing but the best coffee experience every time you visit.
            </p>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="section-title">Why Choose Us</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="text-center"
              >
                <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <feature.icon className="text-2xl text-primary-500" />
                </div>
                <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
                <p className="text-gray-600 text-sm">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="text-4xl font-bold text-primary-500 mb-2">{stats.years}+</div>
              <div className="text-gray-600">Years of Excellence</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-primary-500 mb-2">{stats.customers.toLocaleString()}+</div>
              <div className="text-gray-600">Happy Customers</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-primary-500 mb-2">{stats.staff}+</div>
              <div className="text-gray-600">Team Members</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-primary-500 mb-2">{stats.awards}</div>
              <div className="text-gray-600">Awards Won</div>
            </div>
          </div>
        </div>
      </section>

      {/* Staff Section */}
      <StaffSection />
    </div>
  );
};

export default About;