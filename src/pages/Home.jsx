import React from 'react';
import Hero from '../components/Hero';
import ProductCard from '../components/ProductCard';
import StaffSection from '../components/StaffSection';
import GallerySection from '../components/GallerySection';
import EventCard from '../components/EventCard';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Autoplay } from 'swiper/modules';
import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import { productAPI, eventAPI } from '../api';
import LoadingSpinner from '../components/LoadingSpinner';

const Home = () => {
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [upcomingEvents, setUpcomingEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [productsRes, eventsRes] = await Promise.all([
        productAPI.getAll(),
        eventAPI.getUpcoming()
      ]);
      setFeaturedProducts(productsRes.data.slice(0, 4));
      setUpcomingEvents(eventsRes.data.slice(0, 3));
    } catch (error) {
      console.error('Failed to fetch data');
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <LoadingSpinner />;

  return (
    <div>
      <Hero />
      
      {/* Featured Products */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-12"
          >
            <h2 className="section-title">Featured Products</h2>
            <p className="section-subtitle">Discover our most loved coffee creations</p>
          </motion.div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredProducts.map((product, index) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </section>
      
      {/* Events Section */}
      {upcomingEvents.length > 0 && (
        <section className="py-16 bg-gray-50">
          <div className="container mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center mb-12"
            >
              <h2 className="section-title">Upcoming Events</h2>
              <p className="section-subtitle">Don't miss out on our special events and promotions</p>
            </motion.div>
            
            <Swiper
              modules={[Navigation, Autoplay]}
              spaceBetween={30}
              slidesPerView={1}
              navigation
              autoplay={{ delay: 5000 }}
              breakpoints={{
                768: { slidesPerView: 2 },
                1024: { slidesPerView: 3 }
              }}
            >
              {upcomingEvents.map((event) => (
                <SwiperSlide key={event.id}>
                  <EventCard event={event} />
                </SwiperSlide>
              ))}
            </Swiper>
          </div>
        </section>
      )}
      
      <GallerySection />
      <StaffSection />
    </div>
  );
};

export default Home;