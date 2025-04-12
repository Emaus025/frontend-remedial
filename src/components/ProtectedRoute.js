import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';

const ProtectedRoute = () => {
  const token = localStorage.getItem('token');

  // Si no hay token, redirige a la página de inicio de sesión
  if (!token) {
    return <Navigate to="/" replace />;
  }

  // Si hay token, permite el acceso a la ruta protegida
  return <Outlet />;
};

export default ProtectedRoute;