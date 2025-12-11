import { useContext, useState } from "react";
import { CartContext } from "../context/CartContext";
import { AuthContext } from "../context/AuthContext";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

export default function Cart() {
  const { cart, total, removeFromCart, clearCart } = useContext(CartContext);
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  // Estado formulario invitado
  const [guestData, setGuestData] = useState({
    name: "", email: "", street: "", number: "", floor: "", city: "", zip: ""
  });

  const handleBuy = async () => {
    const orderPayload = {
      items: cart,
      total: total,
      user_id: user ? user.id : null,
      guest_data: user ? null : {
        name: guestData.name,
        email: guestData.email,
        address: { ...guestData }
      }
    };

    try {
      await axios.post("http://localhost:3000/api/orders", orderPayload);
      alert("¡Compra realizada con éxito!");
      clearCart();
      user ? navigate("/profile") : navigate("/");
    } catch (e) { alert("Error en la compra"); }
  };

  if (cart.length === 0) {
    return (
      <div className="empty-cart">
        <img src="https://cdn-icons-png.flaticon.com/512/2038/2038854.png" alt="Carrito Triste" className="sad-cart-img" />
        <h2>Carrito Vacío</h2>
        <Link to="/" className="btn-catalog">Ir al Catálogo</Link>
      </div>
    );
  }

  return (
    <div className="cart-page">
      <div className="cart-items">
        {cart.map(item => (
          <div key={item._id} className="item-row">
            <img src={item.cover_image} alt="" width="50" />
            <div>
              <h4>{item.title}</h4>
              <p>{item.price} € x {item.qty}</p>
            </div>
            <button onClick={() => removeFromCart(item._id)} className="delete-btn">🗑️</button>
          </div>
        ))}
        <div className="total">Total: {total.toFixed(2)} €</div>
      </div>

      <div className="checkout-form">
        <h3>Datos de Envío</h3>

        {user ? (
          <div>
            <p>Enviar a: <strong>{user.name}</strong></p>
            <p>Dirección: {user.address?.street || "Sin dirección definida"}</p>
            <Link to="/profile" className="edit-link">Editar dirección</Link>
            <button onClick={handleBuy} className="buy-btn">COMPRAR AHORA</button>
          </div>
        ) : (
          <form onSubmit={(e) => { e.preventDefault(); handleBuy(); }}>
            <input placeholder="Nombre y Apellidos" required onChange={e => setGuestData({ ...guestData, name: e.target.value })} />
            <input placeholder="Email" type="email" required onChange={e => setGuestData({ ...guestData, email: e.target.value })} />

            <div className="address-grid">
              <input placeholder="Calle" required onChange={e => setGuestData({ ...guestData, street: e.target.value })} />
              <input placeholder="Nº" required onChange={e => setGuestData({ ...guestData, number: e.target.value })} />
              <input placeholder="Piso/Esc" onChange={e => setGuestData({ ...guestData, floor: e.target.value })} />
              <input placeholder="Ciudad" required onChange={e => setGuestData({ ...guestData, city: e.target.value })} />
              <input placeholder="CP" required onChange={e => setGuestData({ ...guestData, zip: e.target.value })} />
            </div>

            <button type="submit" className="buy-btn">COMPRAR</button>

            <div className="register-promo">
              <p>¿Quieres guardar tus datos?</p>
              <Link to="/register" className="btn-register-promo">Regístrate antes</Link>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}