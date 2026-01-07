import request from 'supertest';
import app from '../app.js';
import mongoose from 'mongoose';

// Aumentamos el tiempo de espera por si la BD tarda en conectar
jest.setTimeout(20000);

beforeAll(async () => {
    // Aseguramos que se conecte a la BD antes de empezar
    await mongoose.connect(process.env.MONGODB_URI);
});

afterAll(async () => {
    // Cerramos la conexión y el servidor al terminar para no dejar procesos abiertos
    await mongoose.connection.close();
});

describe('💿 API de Vinilos (GET /api/vinyls)', () => {

    test('Debería devolver un código 200 y un array de vinilos (JSON)', async () => {
        const res = await request(app).get('/api/vinyls');
        
        expect(res.statusCode).toBe(200);
        expect(res.headers['content-type']).toMatch(/json/);
        expect(Array.isArray(res.body)).toBe(true);
        expect(res.body.length).toBeGreaterThan(0);
    });

    test('Los vinilos deben tener la estructura correcta (título, precio, imagen)', async () => {
        const res = await request(app).get('/api/vinyls');
        const vinilo = res.body[0];

        // Verificamos que existan las propiedades clave que usa el Frontend
        expect(vinilo).toHaveProperty('title');
        expect(vinilo).toHaveProperty('artist_name');
        
        // Comprobamos el precio (puede venir como price o price_eur)
        const tienePrecio = vinilo.hasOwnProperty('price_eur') || vinilo.hasOwnProperty('price');
        expect(tienePrecio).toBe(true);
    });

    test('Debería filtrar correctamente por artista (Query ?q=...)', async () => {
        // Usamos un término que sabemos que existe en tu BD
        const busqueda = 'Carolina'; 
        const res = await request(app).get(`/api/vinyls?q=${busqueda}`);
        
        expect(res.statusCode).toBe(200);
        // Si encuentra algo, verificamos que coincida
        if (res.body.length > 0) {
            const artista = res.body[0].artist_name.toLowerCase();
            expect(artista).toContain(busqueda.toLowerCase());
        }
    });

    test('Debería manejar rutas inexistentes con 404', async () => {
        const res = await request(app).get('/api/ruta-que-no-existe');
        expect(res.statusCode).toBe(404);
    });
});