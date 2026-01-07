# 🎵 Discos Rizos

**Discos Rizos** es una aplicación web e-commerce completa para la venta de vinilos musicales exclusivos. Desarrollada con el stack MERN (MongoDB, Express, React, Node.js) y Vite.

![Discos Rizos Banner](https://discosderizos.netlify.app/)

## 🚀 Características

- **Catálogo Musical:** Exploración de vinilos con filtrado por género y búsqueda por artista.
- **Carrito de Compras:** Gestión de productos, cálculo de totales y persistencia de datos.
- **Autenticación:** Registro e inicio de sesión de usuarios (JWT).
- **Perfil de Usuario:** Historial de pedidos y detalles de envío.
- **Diseño Responsive:** Interfaz moderna y adaptada a móviles (estilo Dark Mode).

## 🛠️ Tecnologías Utilizadas

### Frontend

- **React 19** (Vite)
- **React Router Dom** (Navegación)
- **Context API** (Gestión de estado global para Auth y Carrito)
- **Axios** (Peticiones HTTP)
- **Lucide React** (Iconos)

### Backend

- **Node.js & Express** (Servidor API REST)
- **MongoDB & Mongoose** (Base de datos NoSQL)
- **JWT (JsonWebToken)** (Seguridad y sesiones)
- **BcryptJS** (Encriptación de contraseñas)

## ⚙️ Instalación y Configuración

Sigue estos pasos para ejecutar el proyecto en tu máquina local:

1. **Clonar el repositorio**

   ```bash
   git clone [https://github.com/tu-usuario/discos-rizos.git](https://github.com/tu-usuario/discos-rizos.git)
   cd discos-rizos

   ```

2. **Instalar dependencias**

   ```bash
   npm install

   ```

3. **Configurar variables de entorno**

   ```bash
   cp .env.example .env
   # Edita el archivo .env con tus variables de entorno

   ```

4. **Iniciar el servidor**

   ```bash
   npm run dev

   ```

5. **Iniciar la base de datos**

   ```bash
   npm run db:seed

   ```

6. **Acceder a la aplicación**
   ```bash
   http://localhost:5173
   ```
7. **Test**
   ```bash
   npm run test
   ```

## Estructura del proyecto

El proyecto está organizado de la siguiente manera:

- `src/`
  - `components/`: Componentes reutilizables
  - `pages/`: Páginas principales
  - `context/`: Contextos globales
  - `api/`: Peticiones HTTP
  - `test/`: Pruebas unitarias
  - `utils/`: Utilidades
  - `public/`: Archivos estáticos
  - `vite-env.d.ts`: Tipos para Vite
  - `index.html`: Plantilla HTML
  - `App.jsx`: Componente principal
  - `main.jsx`: Punto de entrada
  - `App.css`: Estilos globales
  - `package.json`: Dependencias y scripts
  - `README.md`: Documentación del proyecto
  - `tsconfig.json`: Configuración de TypeScript
  - `vite.config.js`: Configuración de Vite

### ⚠️ Importante antes de ejecutar el test

He notado en tu `package.json` que no tienes instaladas las librerías de testing (`jest` y `supertest`). Para que el test funcione, debes ejecutar este comando en tu terminal:

```bash
npm install --save-dev jest supertest @types/jest @types/supertest
```
