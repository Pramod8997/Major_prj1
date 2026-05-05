import React, { useContext, useState } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { CartContext } from '../context/CartContext';
import { useNavigate, Link } from 'react-router-dom';
import { CreditCard, CheckCircle, MapPin, Truck } from 'lucide-react';

export default function Checkout() {
  const { user } = useContext(AuthContext);
  const { cart, cartTotal, restaurantId, clearCart } = useContext(CartContext);
  const [loading, setLoading] = useState(false);
  const [paymentStep, setPaymentStep] = useState(false);
  const [address, setAddress] = useState({ street: '', city: '', zip: '' });
  const navigate = useNavigate();

  const deliveryFee = 5.00;
  const tax = cartTotal * 0.10;
  const finalTotal = cartTotal + deliveryFee + tax;

  if (!user) {
    return (
      <div className="max-w-md mx-auto text-center mt-24 bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
        <h2 className="text-2xl font-bold mb-4">Please login to checkout</h2>
        <Link to="/login" className="inline-block bg-brand-500 text-white px-6 py-3 rounded-full font-medium hover:bg-brand-600 transition">Go to Login</Link>
      </div>
    );
  }

  if (cart.length === 0) {
    return (
      <div className="max-w-md mx-auto text-center mt-24 bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
        <h2 className="text-2xl font-bold mb-4">Your cart is empty</h2>
        <Link to="/" className="inline-block bg-brand-500 text-white px-6 py-3 rounded-full font-medium hover:bg-brand-600 transition">Browse Restaurants</Link>
      </div>
    );
  }

  const handleSimulatePayment = (e) => {
    e.preventDefault();
    if (!address.street || !address.city || !address.zip) {
      alert("Please enter your delivery address.");
      return;
    }
    setPaymentStep(true);
  };

  const handlePlaceOrder = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const orderData = {
        restaurant: restaurantId,
        items: cart.map(item => ({ dishId: item._id, name: item.name, price: item.price, qty: item.qty })),
        totalAmount: finalTotal,
        deliveryFee,
        tax,
        deliveryAddress: address,
        status: 'pending'
      };
      
      const res = await axios.post('http://localhost:5000/api/orders', orderData, {
        headers: { 'x-auth-token': token }
      });
      
      clearCart();
      setTimeout(() => {
        navigate(`/track/${res.data._id}`);
      }, 1500); // simulate payment delay
    } catch (err) {
      alert('Failed to place order. Please try again.');
      setLoading(false);
      setPaymentStep(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 animate-fade-in">
      <h1 className="text-3xl font-extrabold text-gray-900 mb-8">Secure Checkout</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          {/* Address Section */}
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
            <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
              <MapPin className="text-brand-500" /> Delivery Details
            </h2>
            <form className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Street Address</label>
                <input type="text" className="w-full px-4 py-2 border rounded-lg focus:ring-brand-500 focus:border-brand-500 outline-none" required value={address.street} onChange={e => setAddress({...address, street: e.target.value})} placeholder="123 Main St" disabled={paymentStep} />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">City</label>
                  <input type="text" className="w-full px-4 py-2 border rounded-lg focus:ring-brand-500 focus:border-brand-500 outline-none" required value={address.city} onChange={e => setAddress({...address, city: e.target.value})} placeholder="New York" disabled={paymentStep} />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">ZIP Code</label>
                  <input type="text" className="w-full px-4 py-2 border rounded-lg focus:ring-brand-500 focus:border-brand-500 outline-none" required value={address.zip} onChange={e => setAddress({...address, zip: e.target.value})} placeholder="10001" disabled={paymentStep} />
                </div>
              </div>
            </form>
          </div>

          {/* Payment Section */}
          {paymentStep ? (
             <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 relative overflow-hidden">
               {loading ? (
                 <div className="flex flex-col items-center justify-center py-12">
                    <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-brand-500 mb-4"></div>
                    <p className="text-lg font-medium text-gray-700">Processing Payment...</p>
                 </div>
               ) : (
                 <form onSubmit={handlePlaceOrder} className="space-y-4 animate-fade-in">
                   <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                    <CreditCard className="text-brand-500" /> Payment Information
                   </h2>
                   <div className="bg-blue-50 text-blue-800 p-4 rounded-lg text-sm mb-4">
                     This is a simulated payment gateway. No real card is charged.
                   </div>
                   <div>
                     <label className="block text-sm font-medium text-gray-700 mb-1">Card Number</label>
                     <input type="text" className="w-full px-4 py-2 border rounded-lg focus:ring-brand-500 focus:border-brand-500 outline-none" placeholder="0000 0000 0000 0000" required maxLength="16" />
                   </div>
                   <div className="grid grid-cols-2 gap-4">
                     <div>
                       <label className="block text-sm font-medium text-gray-700 mb-1">Expiry Date</label>
                       <input type="text" className="w-full px-4 py-2 border rounded-lg focus:ring-brand-500 focus:border-brand-500 outline-none" placeholder="MM/YY" required maxLength="5" />
                     </div>
                     <div>
                       <label className="block text-sm font-medium text-gray-700 mb-1">CVC</label>
                       <input type="text" className="w-full px-4 py-2 border rounded-lg focus:ring-brand-500 focus:border-brand-500 outline-none" placeholder="123" required maxLength="3" />
                     </div>
                   </div>
                   <button type="submit" className="w-full bg-brand-500 hover:bg-brand-600 text-white py-4 rounded-xl font-bold text-lg transition-colors mt-6 shadow-md">
                     Pay ${finalTotal.toFixed(2)}
                   </button>
                 </form>
               )}
             </div>
          ) : (
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <CreditCard className="text-gray-400" />
                <span className="font-medium text-gray-600">Payment pending address confirmation</span>
              </div>
            </div>
          )}
        </div>

        {/* Order Summary */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 h-fit sticky top-24">
          <h3 className="text-xl font-bold mb-6">Order Summary</h3>
          <div className="space-y-4 mb-6">
            {cart.map(item => (
              <div key={item._id} className="flex justify-between items-start">
                <div className="flex gap-2">
                  <span className="font-semibold text-brand-500">{item.qty}x</span>
                  <span className="text-gray-800">{item.name}</span>
                </div>
                <span className="text-gray-600 font-medium">${(item.price * item.qty).toFixed(2)}</span>
              </div>
            ))}
          </div>
          <div className="border-t pt-4 space-y-3 mb-6">
            <div className="flex justify-between text-gray-600">
              <span>Subtotal</span>
              <span>${cartTotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-gray-600">
              <span>Delivery Fee</span>
              <span>${deliveryFee.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-gray-600">
              <span>Tax (10%)</span>
              <span>${tax.toFixed(2)}</span>
            </div>
          </div>
          <div className="border-t pt-4 mb-8">
            <div className="flex justify-between items-center">
              <span className="text-xl font-bold">Total</span>
              <span className="text-2xl font-extrabold text-brand-600">${finalTotal.toFixed(2)}</span>
            </div>
          </div>
          {!paymentStep && (
            <button 
              onClick={handleSimulatePayment}
              className="w-full bg-gray-900 hover:bg-black text-white py-4 rounded-xl font-bold text-lg transition-colors shadow-md flex items-center justify-center gap-2"
            >
              Continue to Payment
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
