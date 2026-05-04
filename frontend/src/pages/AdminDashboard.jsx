import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

export default function AdminDashboard() {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [restaurants, setRestaurants] = useState([]);
  const [newRest, setNewRest] = useState({ name: '', description: '', image: '', deliveryTime: '' });

  useEffect(() => {
    if (!user || user.role !== 'admin') {
      navigate('/');
      return;
    }
    fetchRestaurants();
  }, [user, navigate]);

  const fetchRestaurants = () => {
    axios.get('http://localhost:5000/api/restaurants')
      .then(res => setRestaurants(res.data))
      .catch(err => console.error(err));
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
    <div className="container" style={{ marginTop: '40px' }}>
      <h2>Admin Dashboard</h2>
      
      <div style={{ background: 'var(--surface)', padding: '24px', borderRadius: '16px', border: '1px solid var(--border)', marginTop: '24px' }}>
        <h3>Add New Restaurant</h3>
        <form onSubmit={handleAddRestaurant} style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginTop: '16px', maxWidth: '400px' }}>
          <input required placeholder="Name" value={newRest.name} onChange={e => setNewRest({...newRest, name: e.target.value})} style={{ padding: '8px' }} />
          <input placeholder="Description" value={newRest.description} onChange={e => setNewRest({...newRest, description: e.target.value})} style={{ padding: '8px' }} />
          <input placeholder="Image URL" value={newRest.image} onChange={e => setNewRest({...newRest, image: e.target.value})} style={{ padding: '8px' }} />
          <input placeholder="Delivery Time (e.g. 30-45 min)" value={newRest.deliveryTime} onChange={e => setNewRest({...newRest, deliveryTime: e.target.value})} style={{ padding: '8px' }} />
          <button type="submit" className="checkout-btn">Add Restaurant</button>
        </form>
      </div>

      <h3 style={{ marginTop: '40px' }}>Manage Restaurants</h3>
      <div className="grid">
        {restaurants.map(rest => (
          <div key={rest._id} className="restaurant-card" style={{ padding: '16px' }}>
            <h4>{rest.name}</h4>
            <button 
              onClick={() => handleDeleteRestaurant(rest._id)}
              style={{ background: 'var(--primary)', color: 'white', border: 'none', padding: '8px 16px', borderRadius: '8px', marginTop: '16px', cursor: 'pointer' }}
            >
              Delete
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
