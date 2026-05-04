import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Star, Clock } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Home() {
  const [restaurants, setRestaurants] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get('http://localhost:5000/api/restaurants')
      .then(res => {
        setRestaurants(res.data);
        setLoading(false);
      })
      .catch(err => {
        console.error('Error fetching restaurants:', err);
        setLoading(false);
      });
  }, []);

  if (loading) return <div style={{ textAlign: 'center', padding: '100px 0', color: 'var(--text-muted)' }}>Loading...</div>;

  return (
    <div className="container">
      <section className="hero">
        <h1>Delicious food, delivered to you</h1>
        <p>Explore the best restaurants in your area and enjoy a premium dining experience at home.</p>
      </section>
      
      <div className="grid">
        {restaurants.map(rest => (
          <Link to={`/restaurant/${rest._id}`} key={rest._id} style={{ textDecoration: 'none', color: 'inherit' }}>
            <div className="restaurant-card">
              <img src={rest.image} alt={rest.name} className="restaurant-img" />
              <div className="restaurant-info">
                <div className="restaurant-header">
                  <h3 className="restaurant-title">{rest.name}</h3>
                  <div className="rating">
                    <Star className="star-icon" />
                    {rest.rating}
                  </div>
                </div>
                <p className="restaurant-desc">{rest.description}</p>
                <div className="restaurant-meta">
                  <div className="meta-item">
                    <Clock size={16} />
                    {rest.deliveryTime}
                  </div>
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
