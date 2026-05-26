import React from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import CartDrawer from '../components/CartDrawer';

const UserLayout = () => {
  const [isCartOpen, setIsCartOpen] = React.useState(false);

  return (
    <div className="min-h-screen bg-white">
      <Navbar onCartClick={() => setIsCartOpen(true)} />
      <main>
        <Outlet />
      </main>
      <Footer />
      <CartDrawer isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
    </div>
  );
};

export default UserLayout;