import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { CartProvider } from './contexts/CartContext';
import UserLayout from './layouts/UserLayout';
import Home from './pages/Home';
import Menu from './pages/Menu';
import About from './pages/About';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import Events from './pages/Events';
import OrderTracking from './pages/OrderTracking';

function App() {
  return (
    <Router>
      <CartProvider>
        <Routes>
          <Route path="/" element={<UserLayout />}>
            <Route index element={<Home />} />
            <Route path="menu" element={<Menu />} />
            <Route path="about" element={<About />} />
            <Route path="cart" element={<Cart />} />
            <Route path="checkout" element={<Checkout />} />
            <Route path="events" element={<Events />} />
            <Route path="order-tracking" element={<OrderTracking />} />
          </Route>
        </Routes>
        <Toaster position="top-right" />
      </CartProvider>
    </Router>
  );
}

export default App;