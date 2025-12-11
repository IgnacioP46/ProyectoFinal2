import { useEffect, useState, useRef } from "react";
import { Link } from "react-router-dom";
// CAMBIO IMPORTANTE: Usamos 'api' en vez de 'http'
import api from "../api/axios";
import VinylCard from "../components/VinylCard.jsx";

const adapt = (v) => ({
  _id: v._id ?? v.id,
  title: v.title ?? v.name ?? "",
  artist_name: v.artist_name ?? v.artist ?? v.band ?? "",
  cover_image: v.cover_image ?? v.image ?? "",
  genre: v.genre ?? "",
  price: typeof v.price === "number" ? v.price : Number(v.price ?? v.price_eur ?? 0) || 0,
});

export default function Home() {
  const [vinyls, setVinyls] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const rowRef = useRef(null);

  useEffect(() => {
    (async () => {
      try {
        // CAMBIO: Ahora llama a la ruta raíz relativa a /api, o sea /api/vinyls
        const { data } = await api.get("/vinyls");

        const list = (Array.isArray(data) ? data : []).map(adapt);
        list.sort((a, b) => (a.title || "").localeCompare(b.title || "", "es", { sensitivity: "base" }));
        setVinyls(list);
      } catch (err) {
        console.error(err);
        setError("No se pudo cargar el catálogo de vinilos. Revisa que el servidor backend esté encendido.");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const scrollByAmount = (dir = 1) => {
    const el = rowRef.current;
    if (!el) return;
    const amount = Math.round(el.clientWidth * 0.9);
    el.scrollBy({ left: dir * amount, behavior: "smooth" });
  };

  if (loading) return <div className="p-10 text-center text-white">Cargando vinilos...</div>;
  if (error) return <div className="p-10 text-center text-red-500">{error}</div>;

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6 text-white">
        <h1 className="text-3xl font-bold">Vinilos destacados</h1>
        <Link to="/catalog" className="text-purple-400 border border-purple-400 px-3 py-1 rounded hover:bg-purple-900">Buscar en catálogo</Link>
      </div>

      <div className="relative group">
        <button
          className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-black/50 text-white p-2 rounded-full hover:bg-black/80"
          onClick={() => scrollByAmount(-1)}>‹</button>

        <div
          ref={rowRef}
          className="flex gap-6 overflow-x-auto pb-8 scroll-smooth no-scrollbar"
          style={{ scrollbarWidth: "none" }} // Ocultar barra scroll en Firefox
        >
          {vinyls.length > 0 ? (
            vinyls.map((vinyl) => (
              <div key={vinyl._id} className="flex-shrink-0">
                <VinylCard vinyl={vinyl} />
              </div>
            ))
          ) : (
            <p className="text-gray-500">No hay vinilos en la base de datos.</p>
          )}
        </div>

        <button
          className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-black/50 text-white p-2 rounded-full hover:bg-black/80"
          onClick={() => scrollByAmount(1)}>›</button>
      </div>
    </div>
  );
}