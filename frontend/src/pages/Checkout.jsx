import { useEffect, useMemo, useState, useContext } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import api from "../api/axios";
import { AuthContext } from "../context/AuthContext";

export default function Checkout(){
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();
  const [items, setItems] = useState([]);
  const [placing, setPlacing] = useState(false);
  const [order, setOrder] = useState(null);

  useEffect(()=>{
    const c = JSON.parse(localStorage.getItem("cart") || "[]");
    setItems(c);
  },[]);

  useEffect(()=>{
    if (!user){
      // redirige a login y vuelve a checkout
      navigate("/login", { state: { redirectTo: "/checkout", from: location.pathname } });
    }
  }, [user, navigate, location.pathname]);

  const total = useMemo(()=> items.reduce((s,it)=> s + (it.qty * (it.priceEur||0)), 0), [items]);

  const placeOrder = async () => {
    if (!items.length) return;
    setPlacing(true);
    try{
      const payload = { items: items.map(it => ({ vinylId: it.vinylId, qty: it.qty })) };
      const { data } = await api.post("/orders", payload);
      setOrder(data);
      localStorage.removeItem("cart");
      setItems([]);
    } finally {
      setPlacing(false);
    }
  };

  if (!user){
    return <main style={{padding:24}}>Redirigiendo al login…</main>;
  }

  if (order){
    return (
      <main style={{padding:24}}>
        <h1>Pedido realizado ✅</h1>
        <p>Gracias por tu compra. Nº de pedido: <code>{order._id}</code></p>
        <Link className="btn" to="/catalog">Seguir comprando</Link>
      </main>
    );
  }

  if (!items.length){
    return (
      <main style={{padding:24}}>
        <h1>Checkout</h1>
        <p>No hay productos en el carrito.</p>
        <Link className="btn" to="/catalog">Ir al catálogo</Link>
      </main>
    );
  }

  return (
    <main style={{padding:24}}>
      <h1>Checkout</h1>
      <div style={{display:"grid", gap:12}}>
        {items.map(it=>(
          <div key={it.vinylId} style={{display:"flex", justifyContent:"space-between", background:"#14213d", padding:12, borderRadius:12}}>
            <span>{it.title} × {it.qty}</span>
            <span><strong>{(it.qty*it.priceEur).toFixed(2)} €</strong></span>
          </div>
        ))}
      </div>
      <h2 style={{textAlign:"right", marginTop:16}}>Total: {total.toFixed(2)} €</h2>
      <button className="btn" onClick={placeOrder} disabled={placing} style={{marginTop:12}}>
        {placing ? "Procesando…" : "Confirmar pedido"}
      </button>
    </main>
  );
}
