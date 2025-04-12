import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from '../api/axios';
import '../styles.css';

const Home = () => {
  const navigate = useNavigate();
  const [info, setInfo] = useState({ 
    nodeVersion: '', 
    student: { 
      name: '', 
      grade: '', 
      group: '' 
    } 
  });

  useEffect(() => {
    const fetchInfo = async () => {
      try {
        const res = await axios.get('/getInfo');
        setInfo(res.data);
      } catch (error) {
        console.error('Error al obtener info:', error);
        alert('Error al cargar la información. Intenta nuevamente.');
        if (error.response?.status === 401) {
          handleLogout();
        }
      }
    };
    fetchInfo();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/');
  };

  return (
    <div className="home-container">
      <h2>¡Bienvenido!</h2>
      
      <div className="info-card">
        <h3>Datos del Alumno</h3>
        <p><strong>Nombre:</strong> {info.student.name || 'Cargando...'}</p>
        <p><strong>Grado:</strong> {info.student.grade || 'Cargando...'}</p>
        <p><strong>Grupo:</strong> {info.student.group || 'Cargando...'}</p>
        <p><strong>Docente:</strong> Emmanuel Martínez Hernández</p>
      </div>

      <div className="info-card">
        <h3>Información del Servidor</h3>
        <p><strong>Versión de Node.js:</strong> {info.nodeVersion || 'Cargando...'}</p>
      </div>

      <div className="description-card">
        <h3>Descripción del Proyecto</h3>
        <p>
          Esta aplicación permite registrar y autenticar usuarios mediante autenticación 
          de dos factores (2FA) con Google Authenticator, utilizando códigos OTP. 
          Muestra logs de actividad en dos servidores: uno con Rate Limit para limitar 
          solicitudes y otro sin restricciones, permitiendo comparar su comportamiento.
        </p>
      </div>

      <div className="button-group">
        <button onClick={() => navigate('/logs')}>Ver Logs</button>
        <button onClick={handleLogout}>Cerrar Sesión</button>
      </div>
    </div>
  );
};

export default Home;