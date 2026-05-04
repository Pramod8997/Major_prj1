import React, { useContext, useState } from 'react';
import { BrowserRouter, Routes, Route, Link, useNavigate } from 'react-router-dom';
import { AuthProvider, AuthContext } from './context/AuthContext';
import { CartProvider, CartContext } from './context/CartContext';
import { ShoppingBag, User, LogOut, ClipboardList, Shield } from 'lucide-react';

import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import RestaurantDetails from './pages/RestaurantDetails';
import Checkout from './pages/Checkout';
import OrderHistory from './pages/OrderHistory';
import AdminDashboard from './pages/AdminDashboard';
import './index.css';

function Navbar() {
  const { user, logout } = useContext(AuthContext);
  const { cartItemsCount } = useContext(CartContext);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="navbar">
      <div className="container navbar-content">
        <Link to="/" className="logo" style={{ textDecoration: 'none' }}>
          <div style={{ background: 'var(--primary)', color: 'white', borderRadius: '8px', padding: '4px 8px' }}>G</div>
          Gourmet
        </Link>
        <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
          {user ? (
            <div style={{ position: 'relative' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                <span style={{ fontWeight: '500' }}>Hi, {user.name}</span>
                <button className="cart-btn" onClick={() => setIsMenuOpen(!isMenuOpen)} style={{ padding: '8px' }}>
                  <User size={20} />
                </button>
                <Link to="/checkout" style={{ textDecoration: 'none' }}>
                  <button className="cart-btn">
                    <ShoppingBag size={20} />
                    {cartItemsCount > 0 && <span className="cart-badge">{cartItemsCount}</span>}
                  </button>
                </Link>
              </div>
              {isMenuOpen && (
                <div style={{ position: 'absolute', top: '100%', right: '0', background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: '8px', padding: '8px 0', marginTop: '8px', width: '200px', boxShadow: 'var(--shadow-md)', zIndex: 100 }}>
                  {user.role === 'admin' && (
                    <Link to="/admin" onClick={() => setIsMenuOpen(false)} style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '12px 16px', textDecoration: 'none', color: 'inherit' }}>
                      <Shield size={16} /> Admin Dashboard
                    </Link>
                  )}
                  <Link to="/orders" onClick={() => setIsMenuOpen(false)} style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '12px 16px', textDecoration: 'none', color: 'inherit' }}>
                    <ClipboardList size={16} /> My Orders
                  </Link>
                  <div onClick={handleLogout} style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '12px 16px', cursor: 'pointer', color: 'var(--primary)' }}>
                    <LogOut size={16} /> Logout
                  </div>
                </div>
              )}
            </div>
          ) : (
            <>
              <Link to="/login" style={{ textDecoration: 'none' }}><button className="cart-btn" style={{ border: 'none' }}>Login</button></Link>
              <Link to="/register" style={{ textDecoration: 'none' }}><button className="checkout-btn" style={{ padding: '8px 16px', width: 'auto' }}>Sign Up</button></Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <CartProvider>
          <Navbar />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/restaurant/:id" element={<RestaurantDetails />} />
            <Route path="/checkout" element={<Checkout />} />
            <Route path="/orders" element={<OrderHistory />} />
            <Route path="/admin" element={<AdminDashboard />} />
          </Routes>
        </CartProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}
