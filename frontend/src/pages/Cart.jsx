import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

export default function Cart(){
  const navigate = useNavigate();
  const [items, setItems] = useState([]);

  useEffect(()=>{
    const c = JSON.parse(localStorage.getItem("cart") || "[]");
    setItems(c);
  },[]);

  const persist = (next) => {
    setItems(next);
    localStorage.setItem("cart", JSON.stringify(next));
  };

  const inc = (i) => {
    const next = [...items];
    const max = next[i].stock ?? 99;
    next[i].qty = Math.min(max, next[i].qty + 1);
    persist(next);
  };
  const dec = (i) => {
    const next = [...items];
    next[i].qty = Math.max(1, next[i].qty - 1);
    persist(next);
  };
  const removeAt = (i) => {
    const next = items.filter((_,idx)=> idx!==i);
    persist(next);
  };
  const clear = () => persist([]);

  const total = useMemo(()=> items.reduce((s,it)=> s + (it.qty * (it.priceEur||0)), 0), [items]);

  if (!items.length){
    return (
      <main style={{padding:24}}>
        <h1>Carrito</h1>
        <p>Tu carrito está vacío.</p>
        <Link className="btn" to="/catalog">Ir al catálogo</Link>
      </main>
    );
  }

  return (
    <main style={{padding:24}}>
      <h1>Carrito</h1>
      <div style={{display:"grid", gap:16}}>
        {items.map((it, i)=>(
          <article key={it.vinylId} style={{display:"grid", gridTemplateColumns:"96px 1fr auto", gap:12, alignItems:"center", background:"#14213d", padding:12, borderRadius:12}}>
            <img src={it.coverImage || "https://picsum.photos/seed/cart/200/200"} alt={it.title}
                 style={{width:96, height:96, objectFit:"cover", borderRadius:8}}/>
            <div>
              <h3 style={{margin:"0 0 6px"}}>{it.title}</h3>
              <p style={{margin:0, opacity:.8}}>{it.artistName}</p>
              <p style={{margin:"6px 0 0"}}><strong>{Number(it.priceEur).toFixed(2)} €</strong></p>
              <div style={{display:"flex", gap:8, alignItems:"center", marginTop:8}}>
                <button className="btn" onClick={()=>dec(i)}>-</button>
                <span style={{minWidth:28, textAlign:"center"}}>{it.qty}</span>
                <button className="btn" onClick={()=>inc(i)}>+</button>
                <button className="btn" onClick={()=>removeAt(i)} style={{background:"#6d2630"}}>Quitar</button>
              </div>
            </div>
            <div style={{textAlign:"right"}}><strong>{(it.qty*it.priceEur).toFixed(2)} €</strong></div>
          </article>
        ))}
      </div>

      <div style={{display:"flex", justifyContent:"space-between", alignItems:"center", marginTop:16}}>
        <button className="btn" onClick={clear} style={{background:"#6d2630"}}>Vaciar carrito</button>
        <div style={{display:"flex", alignItems:"center", gap:16}}>
          <h2 style={{margin:0}}>Total: {total.toFixed(2)} €</h2>
          <button className="btn" onClick={()=>navigate("/checkout")}>Ir a checkout</button>
        </div>
      </div>
    </main>
  );
}
