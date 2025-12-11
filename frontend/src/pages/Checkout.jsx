import { useEffect, useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../api/axios"; // Tu instancia de axios configurada
import { AuthContext } from "../context/AuthContext";
import { CartContext } from "../context/CartContext"; // Necesitamos el contexto del carrito

export default function Checkout() {
  const { user } = useContext(AuthContext);
  const { cart, total, clearCart } = useContext(CartContext); // Asegúrate de exportar 'cart' y 'total' en tu CartContext
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [orderSuccess, setOrderSuccess] = useState(null);

  // Estado para el formulario de invitado
  const [guestData, setGuestData] = useState({
    name: "",
    email: "",
    street: "",
    number: "",
    floor: "",
    city: "",
    zip: ""
  });

  // Si el carrito está vacío y no hemos comprado, volver al catálogo
  useEffect(() => {
    if (cart.length === 0 && !orderSuccess) {
      // Opcional: Redirigir si entra directo sin items
      // navigate("/catalog");
    }
  }, [cart, navigate, orderSuccess]);

  const handleInputChange = (e) => {
    setGuestData({ ...guestData, [e.target.name]: e.target.value });
  };

  const handleBuy = async (e) => {
    e.preventDefault();
    setLoading(true);

    // 1. Preparar los items para el backend (limpiar datos innecesarios)
    const orderItems = cart.map(item => ({
      vinyl_id: item._id || item.id, // Asegurar compatibilidad de ID
      title: item.title,
      price: item.price || item.price_eur,
      quantity: item.qty || item.quantity
    }));

    // 2. Construir el payload
    const orderData = {
      items: orderItems,
      total: total,
      user_id: user ? (user.id || user._id) : null, // Si hay usuario, mandamos ID
      guest_info: user ? null : {  // Si no, mandamos el formulario
        name: guestData.name,
        email: guestData.email,
        address: {
          street: guestData.street,
          number: guestData.number,
          floor: guestData.floor,
          city: guestData.city,
          zip: guestData.zip
        }
      }
    };

    try {
      // 3. Enviar al Backend
      const { data } = await api.post("/orders", orderData);

      // 4. Éxito
      setOrderSuccess(data._id);
      clearCart(); // Vaciar carrito del contexto
    } catch (error) {
      console.error(error);
      alert("Error al procesar el pedido. Inténtalo de nuevo.");
    } finally {
      setLoading(false);
    }
  };

  // VISTA: Compra realizada con éxito
  if (orderSuccess) {
    return (
      <div className="max-w-2xl mx-auto p-8 text-center bg-[#1e1e1e] rounded-xl mt-10 text-white">
        <div className="text-6xl mb-4">🎉</div>
        <h1 className="text-3xl font-bold text-green-400 mb-4">¡Pedido Realizado!</h1>
        <p className="mb-6">Tu código de pedido es: <span className="font-mono bg-black px-2 py-1 rounded text-purple-400">{orderSuccess}</span></p>
        <p className="text-gray-400 mb-8">Te hemos enviado un correo de confirmación (simulado).</p>

        {user ? (
          <Link to="/profile" className="bg-purple-600 hover:bg-purple-700 text-white font-bold py-2 px-6 rounded transition">
            Ver en mi Perfil
          </Link>
        ) : (
          <div className="space-y-4">
            <Link to="/" className="bg-purple-600 hover:bg-purple-700 text-white font-bold py-2 px-6 rounded transition block w-fit mx-auto">
              Volver al Inicio
            </Link>
            <p className="text-sm text-gray-500 mt-4">¿Quieres guardar tu historial para la próxima?</p>
            <Link to="/register" className="text-blue-400 underline">Regístrate ahora</Link>
          </div>
        )}
      </div>
    );
  }

  // VISTA: Carrito Vacío
  if (cart.length === 0) {
    return (
      <div className="text-center mt-20 text-white">
        <h2 className="text-3xl font-bold mb-4">Tu carrito está vacío</h2>
        <Link to="/" className="text-purple-400 underline">Volver al catálogo</Link>
      </div>
    );
  }

  // VISTA: Formulario de Checkout
  return (
    <div className="container mx-auto p-6 text-white">
      <h1 className="text-3xl font-bold mb-8 text-center">Finalizar Compra</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">

        {/* COLUMNA IZQUIERDA: Formulario de Datos */}
        <div className="bg-[#1e1e1e] p-6 rounded-xl shadow-lg h-fit">
          <h2 className="text-xl font-bold mb-6 border-b border-gray-700 pb-2">
            1. Datos de Envío
          </h2>

          {user ? (
            // SI ESTÁ LOGUEADO
            <div className="space-y-4">
              <div className="bg-[#2a2a2a] p-4 rounded border border-purple-500/50">
                <p className="text-sm text-gray-400">Comprando como:</p>
                <p className="font-bold text-lg">{user.name}</p>
                <p>{user.email}</p>
              </div>
              <div>
                <p className="text-sm text-gray-400 mb-1">Dirección guardada:</p>
                <p className="italic">
                  {user.address?.street
                    ? `${user.address.street}, ${user.address.city}`
                    : "No tienes dirección configurada. Se usará la dirección de facturación por defecto."}
                </p>
                <Link to="/profile" className="text-sm text-purple-400 underline mt-2 block">
                  Editar mi dirección
                </Link>
              </div>
            </div>
          ) : (
            // SI ES INVITADO (GUEST)
            <form id="guest-form" onSubmit={handleBuy} className="space-y-4">
              <div className="grid grid-cols-1 gap-4">
                <input
                  name="name" placeholder="Nombre y Apellidos" required
                  onChange={handleInputChange}
                  className="w-full bg-[#2a2a2a] border border-gray-600 rounded p-3 text-white focus:border-purple-500 outline-none"
                />
                <input
                  name="email" type="email" placeholder="Correo electrónico" required
                  onChange={handleInputChange}
                  className="w-full bg-[#2a2a2a] border border-gray-600 rounded p-3 text-white focus:border-purple-500 outline-none"
                />
              </div>

              <div className="grid grid-cols-3 gap-2">
                <input
                  name="street" placeholder="Calle" required onChange={handleInputChange}
                  className="col-span-2 w-full bg-[#2a2a2a] border border-gray-600 rounded p-3 text-white outline-none"
                />
                <input
                  name="number" placeholder="Nº" required onChange={handleInputChange}
                  className="w-full bg-[#2a2a2a] border border-gray-600 rounded p-3 text-white outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <input
                  name="floor" placeholder="Piso / Puerta" onChange={handleInputChange}
                  className="w-full bg-[#2a2a2a] border border-gray-600 rounded p-3 text-white outline-none"
                />
                <input
                  name="zip" placeholder="C. Postal" required onChange={handleInputChange}
                  className="w-full bg-[#2a2a2a] border border-gray-600 rounded p-3 text-white outline-none"
                />
              </div>
              <input
                name="city" placeholder="Ciudad / Provincia" required onChange={handleInputChange}
                className="w-full bg-[#2a2a2a] border border-gray-600 rounded p-3 text-white outline-none"
              />

              <div className="mt-4 p-3 bg-blue-900/20 border border-blue-900 rounded text-sm text-blue-200">
                <Link to="/login" className="font-bold underline">Inicia sesión</Link> o <Link to="/register" className="font-bold underline">Regístrate</Link> para guardar estos datos y acumular puntos.
              </div>
            </form>
          )}
        </div>

        {/* COLUMNA DERECHA: Resumen de Pedido */}
        <div>
          <div className="bg-[#1e1e1e] p-6 rounded-xl shadow-lg sticky top-24">
            <h2 className="text-xl font-bold mb-6 border-b border-gray-700 pb-2">
              2. Resumen del Pedido
            </h2>

            <div className="space-y-4 max-h-80 overflow-y-auto pr-2 mb-6 custom-scrollbar">
              {cart.map((item) => (
                <div key={item._id || item.id} className="flex justify-between items-center bg-[#2a2a2a] p-3 rounded">
                  <div className="flex items-center gap-3">
                    <img src={item.cover_image} alt="" className="w-10 h-10 rounded object-cover bg-black" />
                    <div>
                      <p className="font-bold text-sm line-clamp-1">{item.title}</p>
                      <p className="text-xs text-gray-400">Cant: {item.qty}</p>
                    </div>
                  </div>
                  <span className="font-bold">{((item.price || item.price_eur) * item.qty).toFixed(2)} €</span>
                </div>
              ))}
            </div>

            <div className="border-t border-gray-600 pt-4 space-y-2">
              <div className="flex justify-between text-gray-400">
                <span>Subtotal</span>
                <span>{total.toFixed(2)} €</span>
              </div>
              <div className="flex justify-between text-gray-400">
                <span>Envío</span>
                <span>Gratis</span>
              </div>
              <div className="flex justify-between text-2xl font-bold text-white mt-4">
                <span>Total</span>
                <span className="text-purple-400">{total.toFixed(2)} €</span>
              </div>
            </div>

            <button
              onClick={user ? handleBuy : undefined} // Si es user, dispara la función. Si es guest, usa el submit del form
              form={user ? undefined : "guest-form"} // Vincula al formulario de guest si no hay usuario
              type="submit"
              disabled={loading}
              className={`w-full mt-6 py-4 rounded-lg font-bold text-lg transition shadow-lg ${loading
                ? "bg-gray-600 cursor-not-allowed"
                : "bg-green-600 hover:bg-green-500 text-white"
                }`}
            >
              {loading ? "Procesando..." : `Pagar ${total.toFixed(2)} €`}
            </button>

            <p className="text-xs text-center text-gray-500 mt-4">
              Pagos seguros encriptados SSL. Aceptamos tarjetas y PayPal.
            </p>
          </div>
        </div>

      </div>
    </div>
  );
}