import { useRef } from "react";
import { Link } from "react-router-dom";

export default function GenreCarousel({ title, items = [], genreKey }) {
  const scroller = useRef(null);
  const scrollBy = (dir) => {
    const el = scroller.current;
    if (!el) return;
    const amount = Math.round(el.clientWidth * 0.9);
    el.scrollBy({ left: dir * amount, behavior: "smooth" });
  };

  return (
    <section style={{margin: "24px 0"}}>
      <header style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:12}}>
        <h2 style={{margin:0}}>{title}</h2>
        <Link to={`/catalog?genre=${encodeURIComponent(genreKey)}`} style={{opacity:.8}}>Ver todo →</Link>
      </header>

      <div style={{position:"relative"}}>
        <button aria-label="Anterior" className="carousel-btn left" onClick={()=>scrollBy(-1)}>‹</button>
        <div
          ref={scroller}
          className="carousel-scroll"
          style={{
            display:"grid",
            gridAutoFlow:"column",
            gridAutoColumns:"minmax(220px, 1fr)",
            gap:16,
            overflowX:"auto",
            scrollSnapType:"x mandatory",
            paddingBottom:6
          }}
        >
          {items.map((v)=>(
            <article key={v._id} style={{background:"#14213d", borderRadius:12, padding:12, scrollSnapAlign:"start"}}>
              <img src={v.coverImage || "https://picsum.photos/seed/vinyltile/600/600"} alt={v.title}
                   style={{width:"100%", aspectRatio:"1/1", objectFit:"cover", borderRadius:8}}/>
              <h3 style={{margin:"8px 0 4px"}}>{v.title}</h3>
              <p style={{opacity:.8, margin:"0 0 6px"}}>{v.artist?.name || "Artista"}</p>
              <p style={{margin:0}}><strong>{Number(v.priceEur).toFixed(2)} €</strong></p>
            </article>
          ))}
        </div>
        <button aria-label="Siguiente" className="carousel-btn right" onClick={()=>scrollBy(1)}>›</button>
      </div>
    </section>
  );
}
