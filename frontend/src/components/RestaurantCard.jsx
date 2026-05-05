import React from 'react';
import { Star, Clock, MapPin } from 'lucide-react';

const RestaurantCard = ({ restaurant, onClick }) => {
  return (
    <div 
      className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 cursor-pointer group"
      onClick={onClick}
    >
      <div className="relative h-48 overflow-hidden bg-gray-100">
        <img 
          src={restaurant.image} 
          alt={restaurant.name} 
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        {restaurant.rating >= 4.5 && (
          <div className="absolute top-4 left-4 bg-yellow-400 text-yellow-900 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
            Top Rated
          </div>
        )}
      </div>
      
      <div className="p-5">
        <div className="flex justify-between items-start mb-2">
          <h3 className="text-xl font-bold text-gray-900 group-hover:text-brand-600 transition-colors">
            {restaurant.name}
          </h3>
          <div className="flex items-center gap-1 bg-green-50 text-green-700 px-2 py-1 rounded-lg">
            <Star className="w-4 h-4 fill-current" />
            <span className="font-bold text-sm">{restaurant.rating}</span>
          </div>
        </div>
        
        <p className="text-gray-500 text-sm mb-4 line-clamp-2 min-h-[40px]">
          {restaurant.description}
        </p>
        
        {restaurant.cuisineTypes && restaurant.cuisineTypes.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-4">
            {restaurant.cuisineTypes.slice(0, 3).map((cuisine, index) => (
              <span key={index} className="bg-gray-100 text-gray-600 text-xs px-2 py-1 rounded-md">
                {cuisine}
              </span>
            ))}
          </div>
        )}
        
        <div className="flex items-center gap-4 text-sm text-gray-500 border-t border-gray-100 pt-4">
          <div className="flex items-center gap-1">
            <Clock className="w-4 h-4 text-brand-500" />
            <span>{restaurant.deliveryTime || '30-45 min'}</span>
          </div>
          {restaurant.location && (
            <div className="flex items-center gap-1">
              <MapPin className="w-4 h-4 text-brand-500" />
              <span className="truncate max-w-[120px]">{restaurant.location}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default RestaurantCard;
