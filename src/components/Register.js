import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from '../api/axios';
import QRCode from 'qrcode';
import '../styles.css';

const Register = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [grado, setGrado] = useState('');
  const [grupo, setGrupo] = useState('');
  const [qrCodeUrl, setQrCodeUrl] = useState('');

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('/register', { email, username, password, grado, grupo });
      if (res.data.message === 'Usuario registrado') {
        const qrCode = await QRCode.toDataURL(res.data.otpauthUrl);
        setQrCodeUrl(qrCode);
        alert('Usuario registrado. Escanea el código QR con Google Authenticator.');
      }
    } catch (error) {
      console.error('Error en registro:', error);
      alert('Error al registrar. Intenta nuevamente.');
    }
  };

  return (
    <div className="container">
      <h2>Registrar</h2>
      {!qrCodeUrl ? (
        <form onSubmit={handleRegister}>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email"
            required
          />
          <input
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Usuario"
            required
          />
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Contraseña"
            required
          />
          <select
            value={grado}
            onChange={(e) => setGrado(e.target.value)}
            required
          >
            <option value="" disabled>Selecciona tu grado</option>
            <option value="TSU Tecnologías de la Información Área Desarrollo de Software">
              TSU Tecnologías de la Información Área Desarrollo de Software
            </option>
            <option value="Ingeniería en Desarrollo y Gestión de Software">
              Ingeniería en Desarrollo y Gestión de Software
            </option>
          </select>
          <input
            value={grupo}
            onChange={(e) => setGrupo(e.target.value)}
            placeholder="Grupo"
            required
          />
          <button type="submit">Registrar</button>
          <p>
            ¿Ya tienes cuenta? <Link to="/" style={{ color: '#b20ee9' }}>Inicia sesión aquí</Link>
          </p>
        </form>
      ) : (
        <div>
          <p>Escanea este código QR con Google Authenticator:</p>
          <img src={qrCodeUrl} alt="Código QR para Google Authenticator" />
          <p>Una vez escaneado, puedes iniciar sesión con tu código OTP.</p>
          <button onClick={() => navigate('/')}>Iniciar Sesión</button>
        </div>
      )}
    </div>
  );
};

export default Register;