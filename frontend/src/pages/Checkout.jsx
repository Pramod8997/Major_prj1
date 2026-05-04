import React, { useContext, useState } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { CartContext } from '../context/CartContext';
import { useNavigate, Link } from 'react-router-dom';

export default function Checkout() {
  const { user } = useContext(AuthContext);
  const { cart, cartTotal, restaurantId, clearCart } = useContext(CartContext);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  if (!user) {
    return (
      <div className="container" style={{ textAlign: 'center', marginTop: '100px' }}>
        <h2>Please login to checkout</h2>
        <Link to="/login"><button className="checkout-btn" style={{ width: 'auto', marginTop: '16px' }}>Go to Login</button></Link>
      </div>
    );
  }

  if (cart.length === 0) {
    return (
      <div className="container" style={{ textAlign: 'center', marginTop: '100px' }}>
        <h2>Your cart is empty</h2>
        <Link to="/"><button className="checkout-btn" style={{ width: 'auto', marginTop: '16px' }}>Browse Restaurants</button></Link>
      </div>
    );
  }

  const handlePlaceOrder = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const orderData = {
        restaurant: restaurantId,
        items: cart.map(item => ({ dishId: item._id, name: item.name, price: item.price, qty: item.qty })),
        totalAmount: cartTotal
      };
      
      await axios.post('http://localhost:5000/api/orders', orderData, {
        headers: { 'x-auth-token': token }
      });
      
      clearCart();
      alert('Order placed successfully!');
      navigate('/orders');
    } catch (err) {
      alert('Failed to place order. Please try again.');
      setLoading(false);
    }
  };

  return (
    <div className="container" style={{ maxWidth: '600px', marginTop: '60px' }}>
      <h2>Checkout</h2>
      <div style={{ background: 'var(--surface)', padding: '24px', borderRadius: '16px', border: '1px solid var(--border)', marginTop: '24px' }}>
        <h3>Order Summary</h3>
        <ul style={{ listStyle: 'none', padding: 0, margin: '16px 0' }}>
          {cart.map(item => (
            <li key={item._id} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
              <span>{item.qty}x {item.name}</span>
              <span>${(item.price * item.qty).toFixed(2)}</span>
            </li>
          ))}
        </ul>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 'bold', fontSize: '18px', borderTop: '1px solid var(--border)', paddingTop: '16px' }}>
          <span>Total</span>
          <span>${cartTotal.toFixed(2)}</span>
        </div>
        
        <button 
          className="checkout-btn" 
          style={{ marginTop: '24px' }} 
          onClick={handlePlaceOrder}
          disabled={loading}
        >
          {loading ? 'Processing...' : 'Place Order (Cash on Delivery)'}
        </button>
      </div>
    </div>
  );
}
