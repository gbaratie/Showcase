import React, { useState, useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import { FaUser, FaSignOutAlt } from 'react-icons/fa';
import LoginModal from './LoginModal';

export default function Navbar() {
  const [showLogin, setShowLogin] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const auth = localStorage.getItem('isAuth');
    setIsAuthenticated(auth === 'true');
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('isAuth');
    setIsAuthenticated(false);
    window.location.reload();
  };

  return (
    <header className="header">
      <div className="navbar-container">
        <h1 className="logo">Nadine F</h1>
        <nav className="nav-links">
          <NavLink to="/" end className={({ isActive }) => 
            `nav-link ${isActive ? 'active' : ''}`
          }>
            Accueil
          </NavLink>
          {isAuthenticated && (
            <NavLink to="/modifier" className={({ isActive }) => 
              `nav-link ${isActive ? 'active' : ''}`
            }>
              Modifier
            </NavLink>
          )}
          {isAuthenticated ? (
            <FaSignOutAlt className="user-icon" onClick={handleLogout} title="Se déconnecter" />
          ) : (
            <FaUser className="user-icon" onClick={() => setShowLogin(true)} title="Se connecter" />
          )}
        </nav>
      </div>
      {showLogin && <LoginModal onClose={() => setShowLogin(false)} />}
      <style>{`
        .header {
          background: #21293a;
          padding: 1rem 0;
          margin-bottom: 2rem;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
        }
        
        .navbar-container {
          width: 100%;
          padding: 0;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }
        
        .logo {
          color: #fff;
          font-size: 2.2rem;
          font-weight: 700;
          letter-spacing: 2px;
          margin: 0;
          padding-left: 2rem;
        }
        
        .nav-links {
          padding-right: 2rem;
          display: flex;
          align-items: center;
          gap: 2.5rem;
        }
        
        .nav-link {
          
          text-decoration: none;
          font-weight: 500;
          font-size: 1.1rem;
          transition: color 0.2s;
          padding-bottom: 0.2rem;
          
        }
        
        .nav-link:hover {
          color: #fff;
        }
        
        .nav-link.active {
          color: #fff;
          
        }
        
        .user-icon {
          cursor: pointer;
          color: #fff;
          font-size: 1.5rem;
          transition: color 0.2s;
        }
        
        .user-icon:hover {
          color: #e13b57;
        }
        
        @media (max-width: 768px) {
          .navbar-container {
            padding: 0 1rem;
          }
          
          .logo {
            font-size: 1.8rem;
          }
          
          .nav-links {
            gap: 1.5rem;
          }
          
          .nav-link {
            font-size: 1rem;
          }
        }
      `}</style>
    </header>
  );
}