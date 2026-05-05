import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Store, ShoppingBag, Trash2 } from 'lucide-react';

export default function AdminDashboard() {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [restaurants, setRestaurants] = useState([]);
  const [orders, setOrders] = useState([]);
  const [newRest, setNewRest] = useState({ name: '', description: '', image: '', deliveryTime: '' });
  const [activeTab, setActiveTab] = useState('orders');

  useEffect(() => {
    if (!user || user.role !== 'admin') {
      navigate('/');
      return;
    }
    fetchRestaurants();
    fetchAllOrders();
    
    const interval = setInterval(fetchAllOrders, 10000);
    return () => clearInterval(interval);
  }, [user, navigate]);

  const fetchRestaurants = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/restaurants');
      setRestaurants(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchAllOrders = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get('http://localhost:5000/api/orders/all', {
        headers: { 'x-auth-token': token }
      });
      setOrders(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleUpdateOrderStatus = async (orderId, newStatus) => {
    try {
      const token = localStorage.getItem('token');
      await axios.put(`http://localhost:5000/api/orders/${orderId}/status`, { status: newStatus }, {
        headers: { 'x-auth-token': token }
      });
      fetchAllOrders();
    } catch (err) {
      alert('Error updating status');
    }
  };

  const handleAddRestaurant = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      await axios.post('http://localhost:5000/api/restaurants', newRest, {
        headers: { 'x-auth-token': token }
      });
      setNewRest({ name: '', description: '', image: '', deliveryTime: '' });
      fetchRestaurants();
    } catch (err) {
      alert('Error adding restaurant');
    }
  };

  const handleDeleteRestaurant = async (id) => {
    if (!window.confirm('Are you sure you want to delete this restaurant?')) return;
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`http://localhost:5000/api/restaurants/${id}`, {
        headers: { 'x-auth-token': token }
      });
      fetchRestaurants();
    } catch (err) {
      alert('Error deleting restaurant');
    }
  };

  if (!user || user.role !== 'admin') return null;

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 animate-fade-in">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-extrabold text-gray-900">Admin Dashboard</h1>
        <div className="flex bg-gray-100 rounded-lg p-1">
          <button 
            onClick={() => setActiveTab('orders')}
            className={`px-6 py-2 rounded-md text-sm font-medium transition ${activeTab === 'orders' ? 'bg-white shadow text-brand-600' : 'text-gray-600 hover:text-gray-900'}`}
          >
            <ShoppingBag className="inline-block w-4 h-4 mr-2" /> Live Orders
          </button>
          <button 
            onClick={() => setActiveTab('restaurants')}
            className={`px-6 py-2 rounded-md text-sm font-medium transition ${activeTab === 'restaurants' ? 'bg-white shadow text-brand-600' : 'text-gray-600 hover:text-gray-900'}`}
          >
            <Store className="inline-block w-4 h-4 mr-2" /> Restaurants
          </button>
        </div>
      </div>

      {activeTab === 'orders' && (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Order ID / Time</th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Customer</th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Restaurant</th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Action</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {orders.map(order => (
                <tr key={order._id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">#{order._id.substring(order._id.length - 6).toUpperCase()}</div>
                    <div className="text-sm text-gray-500">{new Date(order.createdAt).toLocaleTimeString()}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{order.user?.name || 'Unknown'}</div>
                    <div className="text-sm text-gray-500">{order.user?.email || ''}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {order.restaurant?.name || 'Unknown'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-gray-900">
                    ${order.totalAmount?.toFixed(2)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full 
                      ${order.status === 'delivered' ? 'bg-green-100 text-green-800' : 
                        order.status === 'cancelled' ? 'bg-red-100 text-red-800' : 
                        'bg-yellow-100 text-yellow-800'}`}>
                      {order.status.replace('_', ' ').toUpperCase()}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <select 
                      className="border rounded px-2 py-1 outline-none focus:border-brand-500"
                      value={order.status}
                      onChange={(e) => handleUpdateOrderStatus(order._id, e.target.value)}
                      disabled={order.status === 'delivered' || order.status === 'cancelled'}
                    >
                      <option value="pending">Pending</option>
                      <option value="accepted">Accepted</option>
                      <option value="cooking">Cooking</option>
                      <option value="out_for_delivery">Out for Delivery</option>
                      <option value="delivered">Delivered</option>
                      <option value="cancelled">Cancelled</option>
                    </select>
                  </td>
                </tr>
              ))}
              {orders.length === 0 && (
                <tr>
                  <td colSpan="6" className="px-6 py-8 text-center text-gray-500">No orders found.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {activeTab === 'restaurants' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-1">
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
              <h3 className="text-xl font-bold mb-4">Add New Restaurant</h3>
              <form onSubmit={handleAddRestaurant} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                  <input required className="w-full px-4 py-2 border rounded-lg focus:ring-brand-500 outline-none" value={newRest.name} onChange={e => setNewRest({...newRest, name: e.target.value})} />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                  <textarea className="w-full px-4 py-2 border rounded-lg focus:ring-brand-500 outline-none" value={newRest.description} onChange={e => setNewRest({...newRest, description: e.target.value})} />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Image URL</label>
                  <input className="w-full px-4 py-2 border rounded-lg focus:ring-brand-500 outline-none" value={newRest.image} onChange={e => setNewRest({...newRest, image: e.target.value})} />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Delivery Time</label>
                  <input placeholder="30-45 min" className="w-full px-4 py-2 border rounded-lg focus:ring-brand-500 outline-none" value={newRest.deliveryTime} onChange={e => setNewRest({...newRest, deliveryTime: e.target.value})} />
                </div>
                <button type="submit" className="w-full bg-brand-500 hover:bg-brand-600 text-white font-medium py-3 rounded-xl transition">
                  Add Restaurant
                </button>
              </form>
            </div>
          </div>
          
          <div className="lg:col-span-2">
             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
               {restaurants.map(rest => (
                 <div key={rest._id} className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex items-center justify-between">
                   <div className="flex items-center gap-4">
                     <img src={rest.image} className="w-16 h-16 rounded-lg object-cover" alt={rest.name} />
                     <div>
                       <h4 className="font-bold text-gray-900">{rest.name}</h4>
                       <span className="text-sm text-gray-500">{rest.deliveryTime}</span>
                     </div>
                   </div>
                   <button onClick={() => handleDeleteRestaurant(rest._id)} className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition">
                     <Trash2 size={20} />
                   </button>
                 </div>
               ))}
             </div>
          </div>
        </div>
      )}
    </div>
  );
}
