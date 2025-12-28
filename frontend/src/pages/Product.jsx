import React, { useEffect, useState, useContext } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { ArrowLeft, ShoppingCart, Check, Music, Disc } from "lucide-react";
import api from "../api/axios";
import { CartContext } from "../context/CartContext";

export default function Product() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useContext(CartContext);

  const [vinyl, setVinyl] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [added, setAdded] = useState(false);

  useEffect(() => {
    const fetchVinyl = async () => {
      try {
        const { data } = await api.get(`/vinyls/${id}`);
        setVinyl(data);
      } catch (err) {
        console.error(err);
        setError("No se ha podido cargar el vinilo.");
      } finally {
        setLoading(false);
      }
    };
    fetchVinyl();
  }, [id]);

  const handleBuy = () => {
    addToCart(vinyl);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000); // Resetear botón a los 2s
  };

  if (loading) return <div className="flex justify-center items-center h-[50vh] text-xl animate-pulse">Cargando disco... 📀</div>;
  if (error || !vinyl) return <div className="text-center p-10 text-red-500">{error || "Vinilo no encontrado"}</div>;

  return (
    <div className="max-w-6xl mx-auto p-6 md:p-10 min-h-screen">

      {/* Botón Volver */}
      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 text-gray-500 hover:text-purple-600 mb-8 transition"
      >
        <ArrowLeft size={20} /> Volver al catálogo
      </button>

      <div className="flex flex-col md:flex-row gap-10 lg:gap-16">

        {/* COLUMNA IZQUIERDA: IMAGEN */}
        <div className="w-full md:w-1/2 flex justify-center">
          <div className="relative w-full max-w-[500px] aspect-square bg-gray-100 rounded-xl shadow-2xl overflow-hidden border border-gray-200 group">
            {vinyl.cover_image ? (
              <img
                src={vinyl.cover_image}
                alt={vinyl.title}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
            ) : (
              <div className="w-full h-full flex flex-col items-center justify-center text-gray-300">
                <Disc size={100} />
                <p>Sin Portada</p>
              </div>
            )}

            {/* Etiqueta de Género Flotante */}
            {vinyl.genre && (
              <span className="absolute top-4 right-4 bg-black/70 backdrop-blur-md text-white px-4 py-1 rounded-full text-sm font-bold uppercase tracking-wide">
                {vinyl.genre}
              </span>
            )}
          </div>
        </div>

        {/* COLUMNA DERECHA: INFO Y COMPRA */}
        <div className="w-full md:w-1/2 flex flex-col justify-center">

          <h1 className="text-4xl md:text-5xl font-black text-gray-900 dark:text-white leading-tight mb-2">
            {vinyl.title}
          </h1>

          <h2 className="text-2xl text-purple-600 dark:text-purple-400 font-medium mb-6 flex items-center gap-2">
            <Music size={24} /> {vinyl.artist_name}
          </h2>

          {/* Precio y Stock */}
          <div className="flex items-center gap-6 mb-8 border-b border-gray-200 dark:border-gray-700 pb-8">
            <span className="text-4xl font-bold text-gray-900 dark:text-gray-100">
              {Number(vinyl.price || vinyl.price_eur).toFixed(2)}€
            </span>

            <div className={`px-3 py-1 rounded text-sm font-bold border ${vinyl.stock > 0 ? 'border-green-500 text-green-600 bg-green-50' : 'border-red-500 text-red-600 bg-red-50'}`}>
              {vinyl.stock > 0 ? 'En Stock' : 'Agotado'}
            </div>
          </div>

          {/* Detalles Técnicos */}
          <div className="grid grid-cols-2 gap-4 mb-8 text-sm text-gray-600 dark:text-gray-400">
            <div className="flex flex-col">
              <span className="font-bold text-gray-900 dark:text-white">Año</span>
              <span>{vinyl.year || "Desconocido"}</span>
            </div>
            <div className="flex flex-col">
              <span className="font-bold text-gray-900 dark:text-white">Estado</span>
              <span>{vinyl.condition || "Nuevo (Mint)"}</span>
            </div>
            <div className="flex flex-col">
              <span className="font-bold text-gray-900 dark:text-white">Sello</span>
              <span>{vinyl.label || "Murmullo Ed."}</span>
            </div>
            <div className="flex flex-col">
              <span className="font-bold text-gray-900 dark:text-white">Formato</span>
              <span>LP, Vinilo 180g</span>
            </div>
          </div>

          {/* Descripción (Si existe) */}
          <p className="text-gray-600 dark:text-gray-300 leading-relaxed mb-8">
            {vinyl.description || "Un disco imprescindible para cualquier colección. Edición revisada y con sonido de alta fidelidad."}
          </p>

          {/* BOTÓN DE COMPRA */}
          <div className="flex gap-4">
            <button
              onClick={handleBuy}
              disabled={vinyl.stock <= 0 || added}
              className={`flex-1 py-4 px-8 rounded-full font-bold text-lg flex items-center justify-center gap-2 transition-all transform hover:scale-[1.02] shadow-xl ${added
                  ? "bg-green-600 text-white"
                  : "bg-black dark:bg-white text-white dark:text-black hover:bg-gray-800 dark:hover:bg-gray-200"
                } ${vinyl.stock <= 0 ? "opacity-50 cursor-not-allowed" : ""}`}
            >
              {added ? (
                <> <Check /> ¡Añadido! </>
              ) : (
                <> <ShoppingCart /> Añadir al carrito </>
              )}
            </button>
          </div>

          <p className="mt-4 text-xs text-center text-gray-400">
            Envío gratis en pedidos superiores a 60€ · Devolución garantizada
          </p>

        </div>
      </div>
    </div>
  );
}