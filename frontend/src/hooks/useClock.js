// frontend/src/hooks/useClock.js
import { useEffect, useState } from 'react'

export function useClock(tz = 'Europe/Madrid') {
  const [now, setNow] = useState(new Date())
  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 1000)
    return () => clearInterval(id)
  }, [])
  const dateStr = new Intl.DateTimeFormat('es-ES', { timeZone: tz, day: '2-digit', month: '2-digit', year: 'numeric' }).format(now)
  const timeStr = new Intl.DateTimeFormat('es-ES', { timeZone: tz, hour: '2-digit', minute: '2-digit', second: '2-digit' }).format(now)
  return { now, dateStr, timeStr }
}
