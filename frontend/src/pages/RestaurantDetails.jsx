import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Plus } from 'lucide-react';
import { CartContext } from '../context/CartContext';

export default function RestaurantDetails() {
  const { id } = useParams();
  const [restaurant, setRestaurant] = useState(null);
  const [loading, setLoading] = useState(true);
  const { addToCart } = useContext(CartContext);

  useEffect(() => {
    axios.get(`http://localhost:5000/api/restaurants/${id}`)
      .then(res => {
        setRestaurant(res.data);
        setLoading(false);
      })
      .catch(err => {
        console.error('Error fetching restaurant details:', err);
        setLoading(false);
      });
  }, [id]);

  if (loading) return <div style={{ textAlign: 'center', padding: '100px 0', color: 'var(--text-muted)' }}>Loading...</div>;
  if (!restaurant) return <div style={{ textAlign: 'center', padding: '100px 0' }}>Restaurant not found</div>;

  return (
    <div className="container menu-section">
      <Link to="/" style={{ textDecoration: 'none' }}>
        <button className="back-btn">
          <ArrowLeft size={18} /> Back to Restaurants
        </button>
      </Link>
      <div style={{ marginBottom: '32px' }}>
        <img src={restaurant.image} alt={restaurant.name} style={{ width: '100%', height: '300px', objectFit: 'cover', borderRadius: '16px', marginBottom: '24px' }} />
        <h1>{restaurant.name}</h1>
        <p style={{ color: 'var(--text-muted)', marginTop: '8px' }}>{restaurant.description}</p>
      </div>
      
      <h2>Menu</h2>
      <div className="grid">
        {restaurant.dishes.map(dish => (
          <div className="dish-card" key={dish._id}>
            <div className="dish-info">
              <h3 className="dish-title">{dish.name}</h3>
              <p className="dish-desc">{dish.description}</p>
              <div className="dish-price">${dish.price.toFixed(2)}</div>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px' }}>
              {dish.image && <img src={dish.image} alt={dish.name} className="dish-img" />}
              <button className="add-btn" onClick={() => addToCart(dish, restaurant._id)}>
                <Plus size={20} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
