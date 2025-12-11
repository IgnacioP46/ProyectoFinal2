// frontend/src/pages/Product.jsx
import { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import api from "../api/axios";

export default function Product() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [v, setV] = useState(null);
  const [qty, setQty] = useState(1);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        const { data } = await api.get(`/vinyls/${id}`);
        if (alive) setV(data);
      } finally {
        if (alive) setLoading(false);
      }
    })();
    return () => { alive = false; };
  }, [id]);

  const getCart = () => JSON.parse(localStorage.getItem("cart") || "[]");
  const setCart = (c) => localStorage.setItem("cart", JSON.stringify(c));

  const addToCart = () => {
    if (!v) return;
    const cart = getCart();
    const idx = cart.findIndex(it => it.vinylId === v._id);
    const max = Math.max(0, v.stock || 0);
    if (idx >= 0) {
      const newQty = Math.min(max, cart[idx].qty + qty);
      cart[idx].qty = newQty;
    } else {
      cart.push({
        vinylId: v._id,
        title: v.title,
        priceEur: v.priceEur,
        qty: Math.min(max, qty),
        coverImage: v.coverImage,
        artistName: v.artist?.name || "",
        stock: v.stock || 0,
      });
    }
    setCart(cart);
    navigate("/cart");
  };

  if (loading) return <main style={{ padding: 24 }}>Cargando…</main>;
  if (!v) return <main style={{ padding: 24 }}>No encontrado.</main>;

  const maxQty = Math.max(0, v.stock || 0);
  const canAdd = maxQty > 0;

  return (
    <main style={{ padding: 24, display: "grid", gap: 24, gridTemplateColumns: "repeat(auto-fit,minmax(320px,1fr))" }}>
      <div>
        <img src={v.coverImage || "https://picsum.photos/seed/vinyldetail/800/800"} alt={v.title}
          style={{ width: "100%", borderRadius: 12, objectFit: "cover" }} />
      </div>
      <div>
        <h1 style={{ marginTop: 0 }}>{v.title}</h1>
        <p style={{ opacity: .8, marginTop: 4 }}>{v.artist?.name}</p>
        <p style={{ margin: "8px 0" }}>Año: {v.year || "—"}</p>
        <p>Peso: {v.weightG || 180}g · {v.speedRpm || 33} RPM · {v.colorVariant || "Black"}</p>
        <p>Estado: {v.condition || "New"}</p>
        <h2 style={{ margin: "16px 0" }}>{Number(v.priceEur).toFixed(2)} €</h2>

        <div style={{ display: "flex", gap: 12, alignItems: "center", margin: "12px 0" }}>
          <button className="btn" onClick={() => setQty(q => Math.max(1, q - 1))} disabled={!canAdd}>-</button>
          <input type="number" min={1} max={maxQty} value={qty}
            onChange={e => setQty(Math.max(1, Math.min(maxQty, Number(e.target.value) || 1)))}
            style={{ width: 72, textAlign: "center", padding: "8px", borderRadius: 8, border: "1px solid #2a3a55" }}
            disabled={!canAdd} />
          <button className="btn" onClick={() => setQty(q => Math.min(maxQty, q + 1))} disabled={!canAdd}>+</button>
          <span style={{ opacity: .7 }}>{maxQty} en stock</span>
        </div>

        <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
          <button className="btn" onClick={addToCart} disabled={!canAdd}>Añadir al carrito</button>
          <Link className="btn" to="/catalog" style={{ background: "#26406d" }}>Seguir comprando</Link>
        </div>
      </div>
    </main>
  );
}
