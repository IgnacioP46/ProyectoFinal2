import express from 'express'
import cors from 'cors'
import vinylRouter from './routes/vinyl.js' // 👈 extensión .js

const app = express()
app.use(cors())
app.use(express.json())

app.get('/api/health', (_req, res) => res.json({ ok: true }))

// Si tu archivo es 'vinyl.js' monta la ruta así:
app.use('/api/vinyls', vinylRouter)

export default app
