import React, { useState, useEffect } from 'react';
import { FiCalendar, FiClock, FiTag, FiMapPin } from 'react-icons/fi';
import { motion } from 'framer-motion';
import { eventAPI, settingsAPI, API_BASE_URL } from '../api';
import { format } from 'date-fns';

const Events = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [settings, setSettings] = useState({});

  useEffect(() => {
    fetchEvents();
    fetchSettings();
  }, []);

  const fetchEvents = async () => {
    try {
      const response = await eventAPI.getAll(true);
      setEvents(response.data);
    } catch (error) {
      console.error('Failed to fetch events');
    } finally {
      setLoading(false);
    }
  };

  const fetchSettings = async () => {
    try {
      const response = await settingsAPI.get();
      setSettings(response.data);
    } catch (error) {
      console.error('Failed to fetch settings');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen pt-32 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500"></div>
      </div>
    );
  }

  return (
    <div className="pt-24 pb-16">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-primary-500 to-primary-700 text-white py-20">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 font-playfair">Events & Promotions</h1>
          <p className="text-lg max-w-2xl mx-auto">
            Join us for special events, promotions, and coffee celebrations
          </p>
        </div>
      </section>

      {/* Events Grid */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          {events.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500">No upcoming events at the moment. Check back soon!</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {events.map((event, index) => (
                <motion.div
                  key={event.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow"
                >
                  <div className="md:flex">
                    <div className="md:w-1/3 h-64 md:h-auto">
{event.image ? (
                         <img
                           src={`${API_BASE_URL}${event.image}`}
                           alt={event.title}
                           className="w-full h-full object-cover"
                         />
                       ) : (
                        <div className="w-full h-full bg-gradient-to-br from-primary-500 to-primary-700 flex items-center justify-center">
                          <FiCalendar className="text-white text-6xl" />
                        </div>
                      )}
                    </div>
                    
                    <div className="md:w-2/3 p-6">
                      <h3 className="text-2xl font-bold text-gray-800 mb-2">{event.title}</h3>
                      <p className="text-gray-600 mb-4">{event.description}</p>
                      
                      <div className="space-y-2 mb-4">
                        <div className="flex items-center gap-2 text-gray-500">
                          <FiCalendar className="text-primary-500" />
                          <span>{format(new Date(event.event_date), 'EEEE, MMMM dd, yyyy')}</span>
                        </div>
                        <div className="flex items-center gap-2 text-gray-500">
                          <FiClock className="text-primary-500" />
                          <span>{format(new Date(event.event_date), 'h:mm a')}</span>
                        </div>
                        <div className="flex items-center gap-2 text-gray-500">
                          <FiMapPin className="text-primary-500" />
                          <span>{settings.address || 'Our Coffee Shop'}</span>
                        </div>
                      </div>
                      
                      {event.discount_percent > 0 && (
                        <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                          <div className="flex items-center gap-2 text-red-600">
                            <FiTag />
                            <span className="font-semibold">{event.discount_percent}% OFF</span>
                            <span className="text-sm">on all items during event</span>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default Events;