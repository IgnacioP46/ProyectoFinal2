import { useEffect, useState } from "react"
import { http } from "../api/http"

export default function Catalogo() {
  const [vinyls, setVinyls] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    let cancel = false
    ;(async () => {
      try {
        const { data } = await http.get("/vinyls")
        if (!cancel) setVinyls(data)
      } catch (e) {
        if (!cancel) setError("No se pudo cargar el catálogo.")
      } finally {
        if (!cancel) setLoading(false)
      }
    })()
    return () => { cancel = true }
  }, [])

  if (loading) return <p>Cargando catálogo…</p>
  if (error) return <p style={{ color: "red" }}>{error}</p>

  return (
    <div>
      <h2>Catálogo</h2>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))", gap: "1rem" }}>
        {vinyls.map((v) => (
          <article key={v._id} style={{ border: "1px solid #ddd", padding: "1rem", borderRadius: 8 }}>
            <h3 style={{ margin: 0 }}>{v.title}</h3>
            <p style={{ margin: ".25rem 0" }}>{v.artist}</p>
            {v.genre && <p style={{ opacity: .7, margin: 0 }}><em>{v.genre}</em></p>}
          </article>
        ))}
      </div>
    </div>
  )
}
