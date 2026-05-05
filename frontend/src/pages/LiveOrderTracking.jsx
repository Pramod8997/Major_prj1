import React, { useEffect, useState, useCallback } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import { CheckCircle, Clock, MapPin, Package, ChefHat, Truck } from 'lucide-react';
import { GoogleMap, useJsApiLoader, Marker, Polyline } from '@react-google-maps/api';
import toast from 'react-hot-toast';

const mapContainerStyle = {
  width: '100%',
  height: '100%',
  borderRadius: '16px'
};

// Dummy coordinates for simulation
const restaurantLocation = { lat: 40.7128, lng: -74.0060 }; // NYC
const userLocation = { lat: 40.730610, lng: -73.935242 };

export default function LiveOrderTracking() {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  // Load Google Maps script
  const { isLoaded } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY || "" // Fallback will show dev watermark
  });

  const fetchOrder = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get('http://localhost:5000/api/orders/history', {
        headers: { 'x-auth-token': token }
      });
      const currentOrder = res.data.find(o => o._id === id);
      
      if (order && currentOrder && order.status !== currentOrder.status) {
        toast.success(`Status Update: ${currentOrder.status.replace('_', ' ').toUpperCase()}`, { icon: '🔔' });
      }
      
      setOrder(currentOrder);
      setLoading(false);
    } catch (err) {
      console.error(err);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrder();
    const interval = setInterval(fetchOrder, 5000);
    return () => clearInterval(interval);
  }, [id, order]);

  if (loading) return <div className="text-center py-32"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-500 mx-auto"></div></div>;
  if (!order) return <div className="text-center py-32 text-xl text-gray-500">Order not found</div>;

  const statuses = ['pending', 'accepted', 'cooking', 'out_for_delivery', 'delivered'];
  const currentStepIndex = statuses.indexOf(order.status);

  const steps = [
    { key: 'pending', label: 'Order Placed', icon: <Package size={20} /> },
    { key: 'accepted', label: 'Order Accepted', icon: <CheckCircle size={20} /> },
    { key: 'cooking', label: 'Cooking', icon: <ChefHat size={20} /> },
    { key: 'out_for_delivery', label: 'Out for Delivery', icon: <Truck size={20} /> },
    { key: 'delivered', label: 'Delivered', icon: <MapPin size={20} /> }
  ];

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 animate-fade-in">
      <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="bg-brand-500 text-white p-8 text-center relative overflow-hidden">
           <div className="relative z-10">
             <h1 className="text-3xl font-bold mb-2">Order Tracking</h1>
             <p className="text-brand-100">Order #{order._id.substring(order._id.length - 8).toUpperCase()}</p>
           </div>
        </div>
        
        <div className="p-8 grid grid-cols-1 md:grid-cols-2 gap-12">
          <div className="mb-12 relative">
            <div className="absolute left-[23px] top-4 bottom-4 w-[2px] bg-gray-100"></div>
            
            <div className="space-y-8 relative">
              {steps.map((step, index) => {
                const isCompleted = currentStepIndex >= index;
                const isCurrent = currentStepIndex === index;
                
                return (
                  <div key={step.key} className={`flex items-start gap-6 transition-opacity duration-500 ${isCompleted ? 'opacity-100' : 'opacity-40'}`}>
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center shrink-0 border-4 z-10 transition-colors duration-300 ${
                      isCompleted ? 'bg-brand-500 border-brand-100 text-white' : 'bg-gray-100 border-white text-gray-400'
                    } ${isCurrent ? 'ring-4 ring-brand-100' : ''}`}>
                      {step.icon}
                    </div>
                    <div className="pt-2">
                      <h3 className={`text-lg font-bold ${isCurrent ? 'text-brand-600' : 'text-gray-900'}`}>{step.label}</h3>
                      {isCurrent && <p className="text-sm text-gray-500 mt-1">We are currently processing this step.</p>}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="h-full min-h-[400px]">
            {isLoaded ? (
              <div className="w-full h-full rounded-2xl overflow-hidden border border-gray-200 shadow-sm relative">
                <GoogleMap
                  mapContainerStyle={mapContainerStyle}
                  center={restaurantLocation}
                  zoom={12}
                  options={{ disableDefaultUI: true }}
                >
                  <Marker position={restaurantLocation} label="R" />
                  <Marker position={userLocation} label="U" />
                  <Polyline 
                    path={[restaurantLocation, userLocation]}
                    options={{ strokeColor: '#f43f5e', strokeOpacity: 0.8, strokeWeight: 4 }}
                  />
                </GoogleMap>
              </div>
            ) : (
              <div className="w-full h-full bg-gray-100 rounded-2xl flex items-center justify-center border border-gray-200">
                <p className="text-gray-500 font-medium">Loading Map...</p>
              </div>
            )}
          </div>
        </div>

        <div className="px-8 pb-8 border-t pt-6 flex justify-between items-center">
             <Link to="/orders" className="text-brand-500 font-semibold hover:text-brand-600">View all orders →</Link>
        </div>
      </div>
    </div>
  );
}
