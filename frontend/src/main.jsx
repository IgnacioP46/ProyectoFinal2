import React from 'react';
import ReactDOM from 'react-dom/client';
import { RouterProvider } from 'react-router-dom';
import router from './router'; // Tu archivo de rutas
import { AuthProvider } from './context/AuthContext';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <AuthProvider>
      {/* Aquí está el Router principal. NO pongas otro BrowserRouter dentro de App */}
      <RouterProvider router={router} />
    </AuthProvider>
  </React.StrictMode>
);