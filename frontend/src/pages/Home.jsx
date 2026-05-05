import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import SearchBar from '../components/SearchBar';
import RestaurantCard from '../components/RestaurantCard';

export default function Home() {
  const [restaurants, setRestaurants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    fetchData('');
  }, []);

  const fetchData = async (query) => {
    setLoading(true);
    try {
      if (query) {
        const res = await axios.get(`http://localhost:5000/api/search?q=${query}&type=restaurant`);
        setRestaurants(res.data.restaurants || []);
      } else {
        const res = await axios.get('http://localhost:5000/api/restaurants');
        setRestaurants(res.data);
      }
    } catch (err) {
      console.error('Error fetching restaurants:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (query) => {
    setSearchQuery(query);
    fetchData(query);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fade-in">
      <section className="text-center py-16 bg-gradient-to-br from-brand-50 to-white rounded-3xl mb-12 shadow-sm border border-brand-100 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full opacity-10 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-brand-500 via-transparent to-transparent pointer-events-none"></div>
        <div className="relative z-10">
          <h1 className="text-5xl font-extrabold text-gray-900 mb-6 tracking-tight">
            Craving something <span className="text-brand-500">delicious?</span>
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-8">
            Explore the best restaurants in your area and enjoy a premium dining experience delivered right to your door.
          </p>
          <SearchBar onSearch={handleSearch} />
        </div>
      </section>
      
      <div className="flex justify-between items-end mb-8">
        <h2 className="text-3xl font-bold text-gray-900">
          {searchQuery ? `Search Results for "${searchQuery}"` : 'Popular Restaurants Near You'}
        </h2>
        <span className="text-gray-500 font-medium">{restaurants.length} places</span>
      </div>

      {loading ? (
        <div className="flex justify-center items-center py-32">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-500"></div>
        </div>
      ) : restaurants.length === 0 ? (
        <div className="text-center py-20 text-gray-500">
          <p className="text-xl">No restaurants found matching your criteria.</p>
          <button 
            onClick={() => handleSearch('')}
            className="mt-4 px-6 py-2 bg-brand-100 text-brand-600 font-medium rounded-full hover:bg-brand-200 transition-colors"
          >
            Clear Search
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {restaurants.map(rest => (
            <Link to={`/restaurant/${rest._id}`} key={rest._id} className="block no-underline">
              <RestaurantCard restaurant={rest} />
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
