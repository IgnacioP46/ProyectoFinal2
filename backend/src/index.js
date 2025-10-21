import 'dotenv/config'
import mongoose from 'mongoose'
import app from './app.js'

const { MONGODB_URI, PORT = 3000 } = process.env

async function start() {
  try {
    if (!MONGODB_URI) throw new Error('Falta MONGODB_URI en .env')

    await mongoose.connect(MONGODB_URI, {
      serverSelectionTimeoutMS: 10000,
      maxPoolSize: 10,
    })
    console.log('✅ MongoDB conectado')

    app.listen(PORT, () => {
      console.log(`🚀 API escuchando en http://127.0.0.1:${PORT}`)
    })
  } catch (err) {
    console.error('❌ Error al conectar MongoDB:', err?.message || err)
    process.exit(1)
  }
}

start()
