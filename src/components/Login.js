import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import axios from '../api/axios';
import '../styles.css';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [otp, setOtp] = useState('');
  const [step, setStep] = useState('login');

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('/login', { email, password });
      if (res.data.message === 'Ingresa el código OTP de Google Authenticator') {
        setStep('otp');
      }
    } catch (error) {
      console.error('Error en login:', error);
      alert('Error al iniciar sesión. Intenta nuevamente.');
    }
  };

  const handleOtp = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('/verify-otp', { email, otp });
      localStorage.setItem('token', res.data.token);
      window.location.href = '/home';
    } catch (error) {
      console.error('Error en OTP:', error);
      alert('Error al verificar OTP. Intentanuevamente.');
    }
  };

  return (
    <div className="container">
      <h2>Iniciar Sesión</h2>
      {step === 'login' ? (
        <form onSubmit={handleLogin}>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email"
            required
          />
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Contraseña"
            required
          />
          <button type="submit">Iniciar Sesión</button>
          <p>
            ¿No tienes cuenta? <Link to="/register" style={{ color: '#b20ee9' }}>Regístrate aquí</Link>
          </p>
          <div className="form-links">
            <Link to="/password-recovery">Olvidaste tu contraseña?</Link>
          </div>
        </form>
      ) : (
        <form onSubmit={handleOtp}>
          <input
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            placeholder="Código OTP de Google Authenticator"
            required
          />
          <button type="submit">Verificar OTP</button>
        </form>
      )}
    </div>
  );
};

export default Login;