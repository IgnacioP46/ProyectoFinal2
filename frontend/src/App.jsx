import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { CartProvider } from './context/CartContext';
import { AuthProvider } from './context/AuthContext';

// Componentes
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Chatbot from './components/Chatbot';

// Páginas
import Home from './pages/Home';
import Catalogo from './pages/Catalogo';
import Login from './pages/Login';
import Register from './pages/Register';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import Product from './pages/Product';
import AdminDashboard from './pages/AdminDashboard';
import UserProfile from './pages/UserProfile';

function App() {
  return (
    <AuthProvider>
      <CartProvider>
        {/* Usamos flex flex-col y min-h-screen para empujar el footer abajo */}
        <div className="min-h-screen flex flex-col bg-white dark:bg-neutral-900 text-neutral-900 dark:text-white transition-colors duration-300">

          <Navbar />

          {/* flex-grow hace que este div ocupe todo el espacio disponible */}
          <div className="flex-grow">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/catalogo" element={<Catalogo />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/cart" element={<Cart />} />
              <Route path="/vinyls/:id" element={<Product />} />
              <Route path="/checkout" element={<Checkout />} />
              <Route path="/admin" element={<AdminDashboard />} />
              <Route path="/profile" element={<UserProfile />} />
              <Route path="*" element={<div className="text-center mt-20"><h1>404 - Página no encontrada</h1></div>} />
            </Routes>
          </div>
          
          <Chatbot />
          <Footer />

        </div>
      </CartProvider>
    </AuthProvider>
  );
}

export default App;