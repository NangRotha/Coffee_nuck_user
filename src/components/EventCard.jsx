import React from 'react';
import { FiCalendar, FiClock, FiTag } from 'react-icons/fi';
import { format } from 'date-fns';
import { API_BASE_URL } from '../api';

const EventCard = ({ event }) => {
  return (
    <div className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow">
      <div className="h-48 overflow-hidden">
        {event.image ? (
          <img
            src={`${API_BASE_URL}${event.image}`}
            alt={event.title}
            className="w-full h-full object-cover hover:scale-110 transition-transform duration-300"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-r from-primary-500 to-primary-700 flex items-center justify-center">
            <FiCalendar className="text-white text-4xl" />
          </div>
        )}
      </div>
      
      <div className="p-5">
        <h3 className="text-xl font-bold text-gray-800 mb-2">{event.title}</h3>
        <p className="text-gray-600 text-sm mb-4 line-clamp-2">{event.description}</p>
        
        <div className="space-y-2 mb-4">
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <FiCalendar className="text-primary-500" />
            <span>{format(new Date(event.event_date), 'MMM dd, yyyy')}</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <FiClock className="text-primary-500" />
            <span>{format(new Date(event.event_date), 'h:mm a')}</span>
          </div>
        </div>
        
        {event.discount_percent > 0 && (
          <div className="flex items-center gap-2 text-sm text-red-600 bg-red-50 px-3 py-2 rounded-lg">
            <FiTag />
            <span className="font-semibold">{event.discount_percent}% OFF</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default EventCard;