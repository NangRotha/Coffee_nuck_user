import React, { useState, useEffect } from 'react';
import { FiUser, FiMail, FiPhone, FiStar } from 'react-icons/fi';
import { motion } from 'framer-motion';
import { staffAPI, API_BASE_URL } from '../api';

const StaffSection = () => {
  const [staff, setStaff] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStaff();
  }, []);

  const fetchStaff = async () => {
    try {
      const response = await staffAPI.getAll();
      setStaff(response.data);
    } catch (error) {
      console.error('Failed to fetch staff');
    } finally {
      setLoading(false);
    }
  };

  if (loading) return null;

  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <h2 className="section-title">Meet Our Team</h2>
        <p className="section-subtitle">
          Passionate professionals dedicated to serving you the perfect cup
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {staff.map((member, index) => (
            <motion.div
              key={member.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow"
            >
              <div className="relative h-64 bg-gradient-to-br from-primary-500 to-primary-700 flex items-center justify-center">
{member.image ? (
                   <img
                     src={`${API_BASE_URL}${member.image}`}
                     alt={member.name}
                     className="w-full h-full object-cover"
                   />
                 ) : (
                  <FiUser className="text-white text-6xl" />
                )}
                {member.is_manager && (
                  <div className="absolute top-4 right-4 bg-yellow-500 text-white px-2 py-1 rounded-full text-xs flex items-center gap-1">
                    <FiStar className="text-xs" /> Manager
                  </div>
                )}
              </div>
              
              <div className="p-5">
                <h3 className="text-xl font-semibold text-gray-800 mb-1">{member.name}</h3>
                <p className="text-primary-500 font-medium mb-3">{member.position}</p>
                <p className="text-gray-600 text-sm mb-4">{member.bio || 'Passionate about serving the best coffee experience'}</p>
                
                <div className="space-y-2 text-sm">
                  {member.email && (
                    <div className="flex items-center gap-2 text-gray-500">
                      <FiMail className="text-xs" />
                      <span className="text-xs">{member.email}</span>
                    </div>
                  )}
                  {member.phone && (
                    <div className="flex items-center gap-2 text-gray-500">
                      <FiPhone className="text-xs" />
                      <span className="text-xs">{member.phone}</span>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default StaffSection;