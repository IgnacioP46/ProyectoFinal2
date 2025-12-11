import React from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from './components/Navbar';
// Si tienes Footer, impórtalo también
// import Footer from './components/Footer'; 
import { CartProvider } from './context/CartContext';
// El AuthProvider ya suele estar en main.jsx, pero si lo tienes aquí, asegúrate de no duplicarlo.

function App() {
  return (
    <CartProvider>
      <div className="min-h-screen bg-neutral-900 text-white font-sans">
        <Navbar />
        <div className="container mx-auto px-4 py-8">
          {/* Outlet es donde se pintan Home, Cart, Login, etc. según la URL */}
          <Outlet />
        </div>
        {/* <Footer /> */}
      </div>
    </CartProvider>
  );
}

export default App;