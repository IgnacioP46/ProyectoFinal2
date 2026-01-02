import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { CartContext } from '../context/CartContext';
// He añadido el icono 'User' a la importación
import { ShoppingBag, Disc, Home, Search, User } from 'lucide-react'; 

export default function Navbar() {
  const { totalItems } = useContext(CartContext);

  const styles = {
    nav: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: '15px 5%',
      backgroundColor: '#202c33',
      color: 'white',
      position: 'sticky',
      top: 0,
      zIndex: 1000,
      boxShadow: '0 2px 10px rgba(0,0,0,0.3)',
    },
    logo: {
      fontSize: '1.5rem',
      fontWeight: 'bold',
      textDecoration: 'none',
      color: '#00a884',
      display: 'flex',
      alignItems: 'center',
      gap: '10px',
    },
    links: {
      display: 'flex',
      gap: '25px',
      alignItems: 'center',
    },
    link: {
      textDecoration: 'none',
      color: '#e9edef',
      fontWeight: '500',
      display: 'flex',
      alignItems: 'center',
      gap: '5px',
      transition: 'color 0.3s',
      cursor: 'pointer'
    },
    cartContainer: {
      position: 'relative',
      display: 'flex',
      alignItems: 'center',
    },
    badge: {
      position: 'absolute',
      top: '-8px',
      right: '-10px',
      backgroundColor: '#ef4444',
      color: 'white',
      borderRadius: '50%',
      width: '20px',
      height: '20px',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      fontSize: '0.75rem',
      fontWeight: 'bold',
      boxShadow: '0 2px 5px rgba(0,0,0,0.2)',
    }
  };

  return (
    <nav style={styles.nav}>
      {/* LOGO */}
      <Link to="/" style={styles.logo}>
        <Disc size={28} /> MurmulloRecords
      </Link>

      {/* ENLACES */}
      <div style={styles.links}>
        <Link to="/" style={styles.link}>
          <Home size={20} /> <span className="hide-mobile">Inicio</span>
        </Link>
        
        <Link to="/catalogo" style={styles.link}>
          <Search size={20} /> <span className="hide-mobile">Catálogo</span>
        </Link>

        {/* --- NUEVO BOTÓN DE LOGIN --- */}
        <Link to="/login" style={styles.link}>
          <User size={20} /> <span className="hide-mobile">Ingresar</span>
        </Link>

        {/* ICONO DEL CARRITO */}
        <Link to="/cart" style={{...styles.link, ...styles.cartContainer}}>
          <ShoppingBag size={24} />
          {totalItems > 0 && (
            <span style={styles.badge}>
              {totalItems}
            </span>
          )}
        </Link>
      </div>

      <style>{`
        @media (max-width: 768px) {
          .hide-mobile { display: none; }
        }
      `}</style>
    </nav>
  );
}