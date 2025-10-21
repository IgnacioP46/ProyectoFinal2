import { useEffect, useState } from "react"
import { http } from "../api/http"

export default function Home() {
  const [vinyls, setVinyls] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    let cancel = false
    ;(async () => {
      try {
        const { data } = await http.get('/api/vinyls')
        if (!cancel) setVinyls(data)
      } catch (e) {
        if (!cancel) setError("No se pudo cargar el catálogo de vinilos.")
      } finally {
        if (!cancel) setLoading(false)
      }
    })()
    return () => { cancel = true }
  }, [])

  if (loading) return <p>Cargando vinilos…</p>
  if (error) return <p style={{ color: "red" }}>{error}</p>

  return (
    <div>
      <h1>Vinilos destacados</h1>
      <ul>
        {vinyls.map((v) => (
          <li key={v._id}>
            <strong>{v.title}</strong> — {v.artist}
          </li>
        ))}
      </ul>
    </div>
  )
}
