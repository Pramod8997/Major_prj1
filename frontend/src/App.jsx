import React, { useContext } from 'react';
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import { AuthProvider, AuthContext } from './context/AuthContext';
import { CartProvider, CartContext } from './context/CartContext';
import { ShoppingBag } from 'lucide-react';

import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import RestaurantDetails from './pages/RestaurantDetails';
import Checkout from './pages/Checkout';
import OrderHistory from './pages/OrderHistory';
import AdminDashboard from './pages/AdminDashboard';
import LiveOrderTracking from './pages/LiveOrderTracking';
import ActiveOrderMenu from './components/ActiveOrderMenu';
import Sidebar from './components/Sidebar';
import { Toaster } from 'react-hot-toast';
import './index.css';

function Navbar() {
  const { user } = useContext(AuthContext);
  const { cartItemsCount } = useContext(CartContext);

  return (
    <nav className="h-16 border-b border-gray-100 sticky top-0 z-10 bg-white/80 backdrop-blur-md flex items-center shrink-0">
      <div className="w-full px-6 flex justify-between items-center">
        {!user ? (
          <Link to="/" className="logo" style={{ textDecoration: 'none' }}>
            <div style={{ background: 'var(--primary)', color: 'white', borderRadius: '8px', padding: '4px 8px' }}>G</div>
            Gourmet
          </Link>
        ) : (
          <div className="font-bold text-gray-800 text-lg">Gourmet</div>
        )}
        <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
          {user ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
              <ActiveOrderMenu />
              <Link to="/checkout" style={{ textDecoration: 'none' }}>
                <button className="cart-btn bg-white hover:bg-gray-50 border border-gray-200">
                  <ShoppingBag size={20} className="text-gray-700" />
                  {cartItemsCount > 0 && <span className="cart-badge">{cartItemsCount}</span>}
                </button>
              </Link>
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

function MainLayout() {
  const { user } = useContext(AuthContext);
  return (
    <div className="flex h-screen w-full overflow-hidden bg-gray-50/50">
      {user && <Sidebar />}
      <div className="flex-1 flex flex-col h-screen overflow-hidden min-w-0">
        <Navbar />
        <main className="flex-1 overflow-y-auto w-full relative p-4 lg:p-8">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/restaurant/:id" element={<RestaurantDetails />} />
            <Route path="/checkout" element={<Checkout />} />
            <Route path="/orders" element={<OrderHistory />} />
            <Route path="/track/:id" element={<LiveOrderTracking />} />
            <Route path="/admin" element={<AdminDashboard />} />
          </Routes>
        </main>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <CartProvider>
          <Toaster position="top-center" toastOptions={{ duration: 4000, style: { borderRadius: '16px', background: '#333', color: '#fff' } }} />
          <MainLayout />
        </CartProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}
