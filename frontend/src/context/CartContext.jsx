import React, { createContext, useState, useEffect } from "react";

// --- ESTILOS DEL CARTEL (TOAST) ---
const notificationStyles = {
  position: "fixed",
  bottom: "20px",
  right: "20px",
  backgroundColor: "#00a884",
  color: "#fff",
  padding: "15px 25px",
  borderRadius: "8px",
  boxShadow: "0 4px 15px rgba(0,0,0,0.3)",
  zIndex: 1000,
  display: "flex",
  alignItems: "center",
  gap: "10px",
  fontSize: "1rem",
  fontWeight: "bold",
  animation: "fadeIn 0.3s ease-out",
  maxWidth: "300px"
};

export const CartContext = createContext();

export const CartProvider = ({ children }) => {
  // Estado del carrito (leemos localStorage)
  const [cart, setCart] = useState(() => {
    try {
      const savedCart = localStorage.getItem("cart");
      return savedCart ? JSON.parse(savedCart) : [];
    } catch (error) {
      return [];
    }
  });

  const [notification, setNotification] = useState(null);

  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cart));
  }, [cart]);

  const showNotification = (message) => {
    setNotification(message);
    setTimeout(() => setNotification(null), 3000);
  };

  // --- FUNCIÓN HELPER PARA LIMPIAR PRECIOS ---
  // Esta función busca el precio donde sea y lo convierte a número
  const normalizePrice = (product) => {
    const rawPrice = 
      product.price_eur || 
      product.price || 
      product.precio || 
      0;
    
    // Convertimos a número flotante (por si viene como string "19.99")
    const finalPrice = parseFloat(rawPrice);
    
    return isNaN(finalPrice) ? 0 : finalPrice;
  };

  // --- AÑADIR AL CARRITO ---
  const addToCart = (product) => {
    setCart((prevCart) => {
      const existingProduct = prevCart.find((item) => item._id === product._id);
      
      // Calculamos el precio correcto UNA VEZ al añadir
      const cleanPrice = normalizePrice(product);
      const cleanTitle = product.title || product.titulo || "Vinilo Desconocido";
      const cleanImage = product.cover_image || product.image || product.imagen;

      if (existingProduct) {
        showNotification(`¡Añadida otra copia de "${cleanTitle}"!`);
        return prevCart.map((item) =>
          item._id === product._id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      } else {
        const newProduct = {
          _id: product._id,
          title: cleanTitle,
          price: cleanPrice, // Aquí guardamos el precio ya limpio
          image: cleanImage,
          artist: product.artist_name || product.artista || "Artista Desconocido",
          quantity: 1
        };
        
        showNotification(`✅ "${cleanTitle}" añadido al carrito.`);
        return [...prevCart, newProduct];
      }
    });
  };

  // --- ELIMINAR DEL CARRITO ---
  const removeFromCart = (id) => {
    setCart((prevCart) => prevCart.filter((item) => item._id !== id));
  };

  // --- LIMPIAR CARRITO ---
  const clearCart = () => {
    setCart([]);
  };

  // Cálculos totales
  const totalItems = cart.reduce((acc, item) => acc + item.quantity, 0);
  
  const totalPrice = cart.reduce((acc, item) => {
    // Aseguramos que usamos el precio guardado
    const itemPrice = parseFloat(item.price) || 0;
    return acc + (itemPrice * item.quantity);
  }, 0);

  return (
    <CartContext.Provider value={{ cart, addToCart, removeFromCart, clearCart, totalItems, totalPrice }}>
      {children}

      {notification && (
        <div style={notificationStyles}>
            <span>{notification}</span>
        </div>
      )}
      
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </CartContext.Provider>
  );
};