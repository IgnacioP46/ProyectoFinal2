// Categorías base para los carruseles del Home
export const GENRES = ["Rock", "Pop", "Urbano", "Electrónica", "Reggae/Ska", "Otros"];

// Listas rápidas por nombre (puedes seguir afinando)
const ROCK = new Set([
  "Carolina Durante","Biznaga","VVV","Camellos","Shego","La Élite","Alcalá Norte",
  "Los Planetas","Ultralágrima","Los Rodríguez","Oasis","Arctic Monkeys","Joe Crepúsculo",
  "Margarita Quebrada","Extremoduro","Los Punsetes","Casatriste","Rage Against the Machine",
  "Cala Vento","Monteperdido","Porretas","Mujeres","Kings of Leon","Vetusta Morla",
  "El Columpio Asesino","La Plata","Manel","Fito y Fitipaldis","Ilegales","The Killers",
  "Reincidentes","Novedades Carminha","Arde Bogotá","Cecilio G.","FrioLento","La Plazuela",
  "Hinds","The Strokes","AC/DC","Metallica","Ayax","Ayax y Prok"
]);

const POP = new Set([
  "Dua Lipa","María Escarmiento","Miley Cyrus","ROSALÍA","Lola Índigo","Amaia",
  "Zahara","La Casa Azul","Ed Sheeran","Rigoberta Bandini","Cupido","Xenia","Luna Ki"
]);

const URBANO = new Set([
  "C. Tangana","Kaydy Caín","Natos y Waor","Bad Bunny","Bad Gyal","Bizarrap",
  "Duki","Yung Beef","Soto Asa","Kanye West","Rihanna","El Coleta","Ben Yart"
]);

const ELECTRONICA = new Set([
  "Daft Punk","The Prodigy","Pet Shop Boys","Gabry Ponte","Cascada","Dub Fx","Barry B","Gordo"
]);

const REGGAE_SKA = new Set([
  "Bob Marley y The Wailers","Los Ganglios" // (estos son electro-punk humor, puedes moverlos a Rock si prefieres)
]);

// Nombres ambiguos/desconocidos que dejaremos en "Otros" si aparecen:
// "Chill Mafia Records","Junio","El Jardinero","Joachim Witt","LA TXAMA","VAN17INO6","El Gavira","El Chico del Té"

// Decide categoría a partir del nombre del artista. Fallback a "Otros".
export function coarseGenre(artistName = "") {
  if (ROCK.has(artistName)) return "Rock";
  if (POP.has(artistName)) return "Pop";
  if (URBANO.has(artistName)) return "Urbano";
  if (ELECTRONICA.has(artistName)) return "Electrónica";
  if (REGGAE_SKA.has(artistName)) return "Reggae/Ska";
  // heurísticas suaves
  const n = artistName.toLowerCase();
  if (/monkeys|strokes|oasis|metallica|ac\/?dc|kings of leon|killers/.test(n)) return "Rock";
  if (/dua lipa|miley|rosal|ed sheeran|zahara|amaia/.test(n)) return "Pop";
  if (/tangana|bunny|gyal|duki|kanye|waor|yung/.test(n)) return "Urbano";
  if (/daft|prodigy|pet shop|cascada|gabry|dub fx/.test(n)) return "Electrónica";
  if (/marley|ska/.test(n)) return "Reggae/Ska";
  return "Otros";
}
