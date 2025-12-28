import { Link } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { CartContext } from "../context/CartContext";
import { ShoppingCart, User, LogOut, Disc } from "lucide-react"; // He añadido el icono Disc

export default function Navbar() {
  const { user, logout } = useContext(AuthContext);
  const { cart } = useContext(CartContext);

  return (
    <nav className="navbar">
      <Link to="/" className="logo">🎵 Discos Rizados</Link>

      <div className="nav-links">
        {/* 👇 AQUÍ AÑADIMOS EL ENLACE AL CATÁLOGO QUE FALTABA */}
        <Link to="/catalogo" className="nav-item">
          Catálogo
        </Link>

        {user?.role === 'admin' && (
          <Link to="/admin" className="admin-link">Panel Admin</Link>
        )}

        <Link to="/cart" className="cart-icon">
          <ShoppingCart />
          {cart.length > 0 && <span className="badge">{cart.length}</span>}
        </Link>

        {user ? (
          <div className="user-menu">
            <Link to="/profile" className="profile-link"><User /> {user.name}</Link>
            <button onClick={logout} className="logout-btn"><LogOut /></button>
          </div>
        ) : (
          <Link to="/login" className="btn-login">Entrar</Link>
        )}
      </div>
    </nav>
  );
}