import { Router } from 'express'
import { Vinyl } from '../models/Vinyl.models.js' // 👈 extensión .js

const router = Router()

router.get('/', async (_req, res) => {
  try {
    const items = await Vinyl.find().lean()
    res.json(items)
  } catch (e) {
    console.error('GET /api/vinyls error:', e)
    res.status(500).json({ error: 'Internal Server Error' })
  }
})

export default router
