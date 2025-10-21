export default function Footer(){
  return (
    <footer style={{marginTop:24, padding:"24px 16px", background:"#0b1526"}}>
      <div style={{display:"flex", flexWrap:"wrap", gap:16, alignItems:"center", justifyContent:"space-between"}}>
        <small>© {new Date().getFullYear()} Murmullo Records</small>
        <div style={{display:"flex", gap:16, alignItems:"center"}}>
          <a href="tel:+34914463700">📞 914 46 37 00</a>
          <a href="mailto:contacto@murmullo-records.com">✉ contacto@murmullo-records.com</a>
          <a href="https://instagram.com/murmullo.records" target="_blank" rel="noreferrer" aria-label="Instagram">
            {/* icono Instagram (SVG simple) */}
            <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
              <path d="M7 2h10a5 5 0 0 1 5 5v10a5 5 0 0 1-5 5H7a5 5 0 0 1-5-5V7a5 5 0 0 1 5-5zm0 2a3 3 0 0 0-3 3v10a3 3 0 0 0 3 3h10a3 3 0 0 0 3-3V7a3 3 0 0 0-3-3H7zm5 3.5A5.5 5.5 0 1 1 6.5 13 5.5 5.5 0 0 1 12 7.5zm0 2A3.5 3.5 0 1 0 15.5 13 3.5 3.5 0 0 0 12 9.5ZM18 6.8a1 1 0 1 1-1 1 1 1 0 0 1 1-1Z"/>
            </svg>
          </a>
          <a href="https://x.com/murmullo_records" target="_blank" rel="noreferrer" aria-label="X">
            {/* icono X */}
            <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
              <path d="M3 3h4.2l5.2 7 5.9-7H21l-7.5 9.1L21 21h-4.2l-5.6-7.6L5 21H3l7.8-9.5L3 3z"/>
            </svg>
          </a>
        </div>
      </div>
    </footer>
  );
}
