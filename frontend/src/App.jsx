import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { ShoppingBag, Star, Clock, ArrowLeft, Plus, X, Minus } from 'lucide-react'

function App() {
  const [restaurants, setRestaurants] = useState([])
  const [selectedRestaurant, setSelectedRestaurant] = useState(null)
  const [cart, setCart] = useState([])
  const [isCartOpen, setIsCartOpen] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Fetch restaurants from backend
    axios.get('http://localhost:5000/api/restaurants')
      .then(res => {
        setRestaurants(res.data)
        setLoading(false)
      })
      .catch(err => {
        console.error('Error fetching restaurants:', err)
        setLoading(false)
      })
  }, [])

  const handleRestaurantClick = (id) => {
    setLoading(true)
    axios.get(`http://localhost:5000/api/restaurants/${id}`)
      .then(res => {
        setSelectedRestaurant(res.data)
        setLoading(false)
      })
      .catch(err => {
        console.error('Error fetching restaurant details:', err)
        setLoading(false)
      })
  }

  const addToCart = (dish) => {
    setCart(prev => {
      const existing = prev.find(item => item._id === dish._id)
      if (existing) {
        return prev.map(item => item._id === dish._id ? { ...item, qty: item.qty + 1 } : item)
      }
      return [...prev, { ...dish, qty: 1 }]
    })
  }

  const updateQty = (id, delta) => {
    setCart(prev => prev.map(item => {
      if (item._id === id) {
        const newQty = item.qty + delta
        return newQty > 0 ? { ...item, qty: newQty } : null
      }
      return item
    }).filter(Boolean))
  }

  const cartTotal = cart.reduce((sum, item) => sum + (item.price * item.qty), 0)
  const cartItemsCount = cart.reduce((sum, item) => sum + item.qty, 0)

  return (
    <>
      {/* Navbar */}
      <nav className="navbar">
        <div className="container navbar-content">
          <div className="logo" onClick={() => setSelectedRestaurant(null)}>
            <div style={{ background: 'var(--primary)', color: 'white', borderRadius: '8px', padding: '4px 8px' }}>G</div>
            Gourmet
          </div>
          <button className="cart-btn" onClick={() => setIsCartOpen(true)}>
            <ShoppingBag size={20} />
            Cart
            {cartItemsCount > 0 && <span className="cart-badge">{cartItemsCount}</span>}
          </button>
        </div>
      </nav>

      {/* Main Content */}
      <main className="container">
        {loading ? (
          <div style={{ textAlign: 'center', padding: '100px 0', color: 'var(--text-muted)' }}>Loading...</div>
        ) : selectedRestaurant ? (
          // Menu View
          <div className="menu-section">
            <button className="back-btn" onClick={() => setSelectedRestaurant(null)}>
              <ArrowLeft size={18} /> Back to Restaurants
            </button>
            <div style={{ marginBottom: '32px' }}>
              <img src={selectedRestaurant.image} alt={selectedRestaurant.name} style={{ width: '100%', height: '300px', objectFit: 'cover', borderRadius: '16px', marginBottom: '24px' }} />
              <h1>{selectedRestaurant.name}</h1>
              <p style={{ color: 'var(--text-muted)', marginTop: '8px' }}>{selectedRestaurant.description}</p>
            </div>
            
            <h2>Menu</h2>
            <div className="grid">
              {selectedRestaurant.dishes.map(dish => (
                <div className="dish-card" key={dish._id}>
                  <div className="dish-info">
                    <h3 className="dish-title">{dish.name}</h3>
                    <p className="dish-desc">{dish.description}</p>
                    <div className="dish-price">${dish.price.toFixed(2)}</div>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px' }}>
                    <img src={dish.image} alt={dish.name} className="dish-img" />
                    <button className="add-btn" onClick={() => addToCart(dish)}>
                      <Plus size={20} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          // Restaurant List View
          <>
            <section className="hero">
              <h1>Delicious food, delivered to you</h1>
              <p>Explore the best restaurants in your area and enjoy a premium dining experience at home.</p>
            </section>
            
            <div className="grid">
              {restaurants.map(rest => (
                <div className="restaurant-card" key={rest._id} onClick={() => handleRestaurantClick(rest._id)}>
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
              ))}
            </div>
          </>
        )}
      </main>

      {/* Cart Sidebar */}
      {isCartOpen && (
        <div className="cart-overlay" onClick={() => setIsCartOpen(false)}>
          <div className="cart-sidebar" onClick={e => e.stopPropagation()}>
            <div className="cart-header">
              <h2>Your Order</h2>
              <button className="close-btn" onClick={() => setIsCartOpen(false)}>
                <X size={24} />
              </button>
            </div>
            
            <div className="cart-items">
              {cart.length === 0 ? (
                <div className="cart-empty">Your cart is empty</div>
              ) : (
                cart.map(item => (
                  <div className="cart-item" key={item._id}>
                    <div className="cart-item-info">
                      <div className="cart-item-title">{item.name}</div>
                      <div className="cart-item-price">${item.price.toFixed(2)}</div>
                    </div>
                    <div className="cart-item-actions">
                      <button className="qty-btn" onClick={() => updateQty(item._id, -1)}>
                        <Minus size={14} />
                      </button>
                      <span>{item.qty}</span>
                      <button className="qty-btn" onClick={() => updateQty(item._id, 1)}>
                        <Plus size={14} />
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
            
            <div className="cart-footer">
              <div className="cart-total">
                <span>Total</span>
                <span>${cartTotal.toFixed(2)}</span>
              </div>
              <button className="checkout-btn" disabled={cart.length === 0}>
                Checkout
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

export default App
