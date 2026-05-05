import React, { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { Link } from 'react-router-dom';
import { Clock, Truck, ChefHat, CheckCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function ActiveOrderMenu() {
  const { user } = useContext(AuthContext);
  const [activeOrder, setActiveOrder] = useState(null);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    if (!user) return;
    
    const fetchActiveOrder = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await axios.get('http://localhost:5000/api/orders/active', {
          headers: { 'x-auth-token': token }
        });
        if (res.data && res.data.length > 0) {
          setActiveOrder(res.data[0]); // Show the most recent active order
        } else {
          setActiveOrder(null);
        }
      } catch (err) {
        console.error('Failed to fetch active order', err);
      }
    };

    fetchActiveOrder();
    const interval = setInterval(fetchActiveOrder, 10000);
    return () => clearInterval(interval);
  }, [user]);

  if (!activeOrder) return null;

  const getStatusIcon = (status) => {
    switch (status) {
      case 'accepted': return <CheckCircle size={16} />;
      case 'cooking': return <ChefHat size={16} />;
      case 'out_for_delivery': return <Truck size={16} />;
      default: return <Clock size={16} />;
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'accepted': return 'Accepted';
      case 'cooking': return 'Cooking';
      case 'out_for_delivery': return 'On the way';
      default: return 'Pending';
    }
  };

  return (
    <div className="relative">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 bg-brand-50 hover:bg-brand-100 text-brand-600 px-4 py-2 rounded-full font-medium transition-colors border border-brand-200"
      >
        <span className="relative flex h-3 w-3">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-brand-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-3 w-3 bg-brand-500"></span>
        </span>
        Track Order
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="absolute top-full right-0 mt-3 w-72 bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden z-50"
          >
            <div className="p-4 border-b border-gray-100 bg-gray-50">
              <div className="flex justify-between items-start mb-1">
                <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Order Status</span>
                <span className="text-xs font-medium text-gray-500">#{activeOrder._id.substring(activeOrder._id.length - 6).toUpperCase()}</span>
              </div>
              <h4 className="font-bold text-gray-900">{activeOrder.restaurant?.name || 'Restaurant'}</h4>
            </div>
            
            <div className="p-4">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-full bg-brand-100 text-brand-600 flex items-center justify-center">
                  {getStatusIcon(activeOrder.status)}
                </div>
                <div>
                  <p className="font-bold text-brand-600">{getStatusText(activeOrder.status)}</p>
                  <p className="text-sm text-gray-500">Arriving in approx 15-20 min</p>
                </div>
              </div>
              
              <Link to={`/track/${activeOrder._id}`} onClick={() => setIsOpen(false)} className="block w-full text-center bg-gray-900 hover:bg-black text-white py-2 rounded-xl text-sm font-medium transition">
                View Live Map
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
