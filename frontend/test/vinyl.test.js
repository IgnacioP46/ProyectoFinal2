import request from 'supertest';
import app from '../app.js'; // Asegúrate de exportar app en app.js
import mongoose from 'mongoose';

beforeAll(async () => {
    await mongoose.connect(process.env.MONGODB_URI);
});

afterAll(async () => {
    await mongoose.connection.close();
});

describe('GET /api/vinyls', () => {
    it('debería devolver un array de vinilos', async () => {
        const res = await request(app).get('/api/vinyls');
        expect(res.statusCode).toBe(200);
        expect(Array.isArray(res.body)).toBe(true);
        expect(res.body.length).toBeGreaterThan(0);
    });

    it('debería buscar por nombre de artista', async () => {
        const res = await request(app).get('/api/vinyls?q=Carolina');
        expect(res.statusCode).toBe(200);
        // Asumiendo que existe Carolina Durante en tu CSV
        expect(res.body[0].artist_name).toContain('Carolina');
    });
});