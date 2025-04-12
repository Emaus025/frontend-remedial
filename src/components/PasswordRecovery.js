import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from '../api/axios';

const PasswordRecovery = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState('');
  const [verificationCode, setVerificationCode] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleEmailSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('/request-reset', { email });
      setMessage('Verification code sent to your email');
      setStep(2);
    } catch (err) {
      setError(err.response?.data?.error || 'Error sending verification code');
    }
  };

  const handleCodeVerification = async (e) => {
    e.preventDefault();
    try {
      await axios.post('/verify-code', { email, code: verificationCode });
      setMessage('Code verified successfully');
      setStep(3);
    } catch (err) {
      setError(err.response?.data?.error || 'Invalid verification code');
    }
  };

  const handlePasswordReset = async (e) => {
    e.preventDefault();
    try {
      await axios.post('/reset-password', {
        email,
        code: verificationCode,
        newPassword
      });
      setMessage('Password reset successfully');
      setTimeout(() => navigate('/'), 2000);
    } catch (err) {
      setError(err.response?.data?.error || 'Error resetting password');
    }
  };

  return (
    <div className="container">
      <h2>Password Recovery</h2>
      {message && <div className="success-message">{message}</div>}
      {error && <div className="error-message">{error}</div>}

      {step === 1 && (
        <form onSubmit={handleEmailSubmit}>
          <input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <button type="submit">Send Verification Code</button>
        </form>
      )}

      {step === 2 && (
        <form onSubmit={handleCodeVerification}>
          <input
            type="text"
            placeholder="Enter verification code"
            value={verificationCode}
            onChange={(e) => setVerificationCode(e.target.value)}
            required
          />
          <button type="submit">Verify Code</button>
        </form>
      )}

      {step === 3 && (
        <form onSubmit={handlePasswordReset}>
          <input
            type="password"
            placeholder="Enter new password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            required
          />
          <button type="submit">Reset Password</button>
        </form>
      )}

      <button onClick={() => navigate('/')} className="secondary-button">
        Back to Login
      </button>
    </div>
  );
};

export default PasswordRecovery;