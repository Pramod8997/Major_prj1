import React, { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { Link } from 'react-router-dom';

export default function OrderHistory() {
  const { user } = useContext(AuthContext);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      const token = localStorage.getItem('token');
      axios.get('http://localhost:5000/api/orders/history', {
        headers: { 'x-auth-token': token }
      })
        .then(res => {
          setOrders(res.data);
          setLoading(false);
        })
        .catch(err => {
          console.error(err);
          setLoading(false);
        });
    }
  }, [user]);

  if (!user) return <div style={{ textAlign: 'center', marginTop: '100px' }}>Please <Link to="/login">login</Link> to view orders.</div>;
  if (loading) return <div style={{ textAlign: 'center', marginTop: '100px' }}>Loading...</div>;

  return (
    <div className="container" style={{ marginTop: '40px' }}>
      <h2>Your Orders</h2>
      {orders.length === 0 ? (
        <p style={{ marginTop: '24px', color: 'var(--text-muted)' }}>You haven't placed any orders yet.</p>
      ) : (
        <div style={{ marginTop: '24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {orders.map(order => (
            <div key={order._id} style={{ background: 'var(--surface)', padding: '24px', borderRadius: '16px', border: '1px solid var(--border)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px' }}>
                <span style={{ fontWeight: 'bold' }}>{order.restaurant?.name || 'Unknown Restaurant'}</span>
                <span style={{ color: 'var(--primary)', fontWeight: 'bold', textTransform: 'uppercase' }}>{order.status}</span>
              </div>
              <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 16px 0' }}>
                {order.items.map((item, idx) => (
                  <li key={idx} style={{ color: 'var(--text-muted)' }}>{item.qty}x {item.name}</li>
                ))}
              </ul>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '14px', borderTop: '1px solid var(--border)', paddingTop: '16px' }}>
                <span>{new Date(order.createdAt).toLocaleString()}</span>
                <span style={{ fontWeight: 'bold' }}>Total: ${order.totalAmount.toFixed(2)}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
