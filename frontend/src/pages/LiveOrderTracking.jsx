import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import { CheckCircle, Clock, MapPin, Package, ChefHat, Truck } from 'lucide-react';

export default function LiveOrderTracking() {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchOrder = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get('http://localhost:5000/api/orders/history', {
        headers: { 'x-auth-token': token }
      });
      const currentOrder = res.data.find(o => o._id === id);
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
  }, [id]);

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
    <div className="max-w-3xl mx-auto px-4 py-8 animate-fade-in">
      <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="bg-brand-500 text-white p-8 text-center relative overflow-hidden">
           <div className="relative z-10">
             <h1 className="text-3xl font-bold mb-2">Order Tracking</h1>
             <p className="text-brand-100">Order #{order._id.substring(order._id.length - 8).toUpperCase()}</p>
           </div>
        </div>
        
        <div className="p-8">
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

          <div className="bg-gray-100 rounded-2xl h-48 flex items-center justify-center mb-8 relative overflow-hidden group border border-gray-200">
            <div className="absolute inset-0 opacity-40 bg-[url('https://maps.googleapis.com/maps/api/staticmap?center=New+York,NY&zoom=13&size=800x400&maptype=roadmap&sensor=false')] bg-cover bg-center"></div>
            <div className="relative z-10 bg-white/90 backdrop-blur-sm px-6 py-3 rounded-full text-sm font-bold text-gray-700 shadow-sm flex items-center gap-2 group-hover:scale-105 transition cursor-pointer border border-gray-100">
              <MapPin className="text-brand-500" size={16} /> Map loading text fallback...
            </div>
          </div>

          <div className="border-t pt-6 flex justify-between items-center">
             <Link to="/orders" className="text-brand-500 font-semibold hover:text-brand-600">View all orders →</Link>
          </div>
        </div>
      </div>
    </div>
  );
}
