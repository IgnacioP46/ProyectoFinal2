import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { CartContext } from '../context/CartContext';
import { AuthContext } from '../context/AuthContext'; 
import { ShoppingBag, Disc, Home, Search, User, LogOut, LayoutDashboard } from 'lucide-react'; // <--- Añadido LayoutDashboard

export default function Navbar() {
  const { totalItems } = useContext(CartContext);
  const { user, logout } = useContext(AuthContext); 
  const navigate = useNavigate();

  const handleLogout = () => {
    logout(); 
    navigate('/'); 
  };

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
      gap: '20px',
      alignItems: 'center',
    },
    link: {
      textDecoration: 'none',
      color: '#e9edef',
      display: 'flex',
      alignItems: 'center',
      gap: '8px',
      transition: 'color 0.3s',
      cursor: 'pointer', 
      background: 'none', 
      border: 'none',
      fontSize: '1rem', 
    },
    // Estilo especial para el botón de Admin
    adminLink: {
      color: '#ef4444',
      fontWeight: 'bold'
    },
    cartContainer: {
      position: 'relative',
      display: 'flex',
      alignItems: 'center',
    },
    badge: {
      position: 'absolute',
      top: '-8px',
      right: '-8px',
      backgroundColor: '#00a884',
      color: 'white',
      borderRadius: '50%',
      padding: '2px 6px',
      fontSize: '0.75rem',
      fontWeight: 'bold',
    },
  };

  return (
    <nav style={styles.nav}>
      {/* LOGO */}
      <Link to="/" style={styles.logo}>
        <Disc size={28} /> Discos Rizos
      </Link>

      {/* ENLACES */}
      <div style={styles.links}>
        <Link to="/" style={styles.link}>
          <Home size={20} /> <span className="hide-mobile">Inicio</span>
        </Link>
        
        <Link to="/catalogo" style={styles.link}>
          <Search size={20} /> <span className="hide-mobile">Catálogo</span>
        </Link>

        {/* LÓGICA CONDICIONAL: USUARIO LOGUEADO */}
        {user ? (
          <>
            {/* --- BOTÓN DE ADMINISTRADOR (SOLO SI ES ADMIN) --- */}
            {user.role === 'admin' && (
                <Link to="/admin" style={{...styles.link, ...styles.adminLink}}>
                    <LayoutDashboard size={20} />
                    <span className="hide-mobile">Panel Admin</span>
                </Link>
            )}

            {/* Enlace al Perfil */}
            <Link to="/profile" style={styles.link}>
               <User size={20} color="#00a884" />
               <span className="hide-mobile">{user.name}</span>
            </Link>
            
            {/* Botón Salir */}
            <button onClick={handleLogout} style={styles.link}>
               <LogOut size={20} /> 
               <span className="hide-mobile">Salir</span>
            </button>
          </>
        ) : (
          // SI NO ESTÁS LOGUEADO
          <Link to="/login" style={styles.link}>
            <User size={20} /> <span className="hide-mobile">Ingresar</span>
          </Link>
        )}

        {/* ICONO DEL CARRITO */}
        <Link to="/cart" style={{...styles.link, ...styles.cartContainer}}>
          <ShoppingBag size={24} />
          {totalItems > 0 && <span style={styles.badge}>{totalItems}</span>}
        </Link>
      </div>

      <style>{`
        @media (max-width: 768px) {
          .hide-mobile {
            display: none;
          }
        }
      `}</style>
    </nav>
  );
}