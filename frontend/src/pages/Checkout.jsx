import React, { useContext, useState, useEffect } from 'react';
import { CartContext } from '../context/CartContext';
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';

const Checkout = () => {
  const { cart, total, clearCart } = useContext(CartContext);
  const { user } = useContext(AuthContext); // Sacamos el usuario
  const navigate = useNavigate();

  // Inicializamos el formulario. 
  // Si existe "user.address", usamos esos datos. Si no, string vacío.
  const [formData, setFormData] = useState({
    street: user?.address?.street || '',
    city: user?.address?.city || '',
    zipCode: user?.address?.zipCode || '',
  });

  // Este useEffect asegura que si el usuario tarda en cargar, se rellene cuando esté listo
  useEffect(() => {
    if (user && user.address) {
      setFormData({
        street: user.address.street || '',
        city: user.address.city || '',
        zipCode: user.address.zipCode || ''
      });
    }
  }, [user]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post('/orders', {
        items: cart,
        total_price: total,
        shipping_address: formData
      });
      clearCart();
      alert('Pedido realizado con éxito');
      navigate('/profile');
    } catch (error) {
      console.error(error);
      alert('Error al procesar el pedido');
    }
  };

  if (cart.length === 0) return <h2 className="text-center mt-10 text-white">El carrito está vacío</h2>;

  return (
    <div className="min-h-screen bg-[#0b141a] text-white flex justify-center py-10">
      <form onSubmit={handleSubmit} className="bg-[#202c33] p-8 rounded-lg w-full max-w-md border border-[#2a3942]">
        <h2 className="text-2xl font-bold mb-6 text-center text-[#00a884]">Finalizar Compra</h2>
        
        <div className="mb-4">
          <label className="block text-gray-400 mb-2">Dirección</label>
          <input 
            name="street" 
            type="text" 
            value={formData.street} 
            onChange={handleChange}
            required 
            className="w-full p-2 rounded bg-[#2a3942] text-white border-none focus:ring-2 focus:ring-[#00a884]"
          />
        </div>

        <div className="mb-4">
          <label className="block text-gray-400 mb-2">Ciudad</label>
          <input 
            name="city" 
            type="text" 
            value={formData.city} 
            onChange={handleChange}
            required 
            className="w-full p-2 rounded bg-[#2a3942] text-white border-none focus:ring-2 focus:ring-[#00a884]"
          />
        </div>

        <div className="mb-6">
          <label className="block text-gray-400 mb-2">Código Postal</label>
          <input 
            name="zipCode" 
            type="text" 
            value={formData.zipCode} 
            onChange={handleChange}
            required 
            className="w-full p-2 rounded bg-[#2a3942] text-white border-none focus:ring-2 focus:ring-[#00a884]"
          />
        </div>

        <div className="text-xl font-bold mb-6 text-center">Total: {total.toFixed(2)} €</div>

        <button type="submit" className="w-full bg-[#00a884] hover:bg-[#008f6f] text-white font-bold py-2 px-4 rounded transition-colors">
          Confirmar y Pagar
        </button>
      </form>
    </div>
  );
};

export default Checkout;