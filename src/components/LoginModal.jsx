import React, { useState } from 'react';

export default function LoginModal({ onClose }) {
  const [id, setId] = useState('');
  const [mdp, setMdp] = useState('');
  const [error, setError] = useState('');

  const handleLogin = () => {
    if (
      id === import.meta.env.VITE_ID &&
      mdp === import.meta.env.VITE_MDP
    ) {
      localStorage.setItem('isAuth', 'true');
      onClose();
      window.location.reload();
    } else {
      setError('Identifiants incorrects');
    }
  };

  return (
    <div className="login-modal-overlay">
      <div className="login-modal">
        <h2 style={{ marginBottom: '1.5rem', textAlign: 'center' }}>Connexion</h2>
        <div className="form-container">
          <input
            type="text"
            placeholder="ID"
            value={id}
            onChange={e => setId(e.target.value)}
            className="login-input"
          />
          <input
            type="password"
            placeholder="Mot de passe"
            value={mdp}
            onChange={e => setMdp(e.target.value)}
            className="login-input"
          />
          {error && <div className="error-message">{error}</div>}
          <div className="button-container">
            <button className="login-button" onClick={handleLogin}>Se connecter</button>
            <button className="login-button" onClick={onClose}>Fermer</button>
          </div>
        </div>
      </div>
      <style>{`
        .login-modal-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.5);
          display: flex;
          justify-content: center;
          align-items: center;
          z-index: 1000;
        }
        
        .login-modal {
          background: #21293a;
          color: #fff;
          padding: 2rem;
          border-radius: 16px;
          width: 90%;
          max-width: 400px;
          box-shadow: 0 8px 32px rgba(0, 0, 0, 0.25);
        }
        
        .form-container {
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }
        
        .login-input {
          width: 100%;
          padding: 0.8rem;
          border: none;
          border-radius: 8px;
          background: #2a3547;
          color: #fff;
          font-size: 1rem;
          box-sizing: border-box;
        }
        
        .login-input:focus {
          outline: 2px solid #e13b57;
        }
        
        .error-message {
          color: #ff4d4d;
          text-align: center;
          font-size: 0.9rem;
        }
        
        .button-container {
          display: flex;
          justify-content: space-between;
          gap: 1rem;
          margin-top: 1rem;
        }
        
        .login-button {
          flex: 1;
          padding: 0.8rem;
          border: none;
          border-radius: 8px;
          background: #e13b57;
          color: #fff;
          font-size: 1rem;
          cursor: pointer;
          transition: background-color 0.2s;
        }
        
        .login-button:hover {
          background: #c4314d;
        }
      `}</style>
    </div>
  );
}