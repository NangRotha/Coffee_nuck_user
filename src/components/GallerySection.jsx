import React, { useState, useEffect } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay } from 'swiper/modules';
import { motion } from 'framer-motion';
import { galleryAPI, API_BASE_URL } from '../api';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

const GallerySection = () => {
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(null);

  useEffect(() => {
    fetchGallery();
  }, []);

  const fetchGallery = async () => {
    try {
      const response = await galleryAPI.getAll();
      setImages(response.data);
    } catch (error) {
      console.error('Failed to fetch gallery');
    } finally {
      setLoading(false);
    }
  };

  if (loading || images.length === 0) return null;

  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h2 className="section-title">Photo Gallery</h2>
          <p className="section-subtitle">Take a glimpse into our cozy coffee shop</p>
        </motion.div>
        
        <Swiper
          modules={[Navigation, Pagination, Autoplay]}
          spaceBetween={20}
          slidesPerView={1}
          navigation
          pagination={{ clickable: true }}
          autoplay={{ delay: 3000, disableOnInteraction: false }}
          breakpoints={{
            640: { slidesPerView: 2 },
            768: { slidesPerView: 3 },
            1024: { slidesPerView: 4 }
          }}
          className="gallery-swiper"
        >
          {images.map((image, index) => (
            <SwiperSlide key={image.id}>
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.1 }}
                className="cursor-pointer group"
                onClick={() => setSelectedImage(image)}
              >
                <div className="aspect-square rounded-xl overflow-hidden shadow-lg">
                  <img
                    src={`${API_BASE_URL}${image.image_url}`}
                    alt={image.title || 'Gallery image'}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                  />
                </div>
              </motion.div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>

      {/* Lightbox Modal */}
      {selectedImage && (
        <div
          className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4 cursor-pointer"
          onClick={() => setSelectedImage(null)}
        >
          <img
            src={`${API_BASE_URL}${selectedImage.image_url}`}
            alt={selectedImage.title}
            className="max-w-full max-h-full object-contain"
          />
          <button
            onClick={() => setSelectedImage(null)}
            className="absolute top-4 right-4 text-white text-4xl hover:text-gray-300"
          >
            ×
          </button>
        </div>
      )}
    </section>
  );
};

export default GallerySection;