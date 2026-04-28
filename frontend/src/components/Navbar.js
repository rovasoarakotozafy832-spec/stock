import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../contexts/AuthContext';

function Navbar() {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  if (!user) return null;

  return (
    <nav style={{
      background: 'white',
      padding: '0 2rem',
      height: '70px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      boxShadow: '0 2px 10px rgba(0,0,0,0.05)',
      position: 'sticky',
      top: 0,
      zIndex: 100
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        <span style={{ fontSize: '28px' }}>📦</span>
        <Link to="/dashboard" style={{
          fontSize: '20px',
          fontWeight: 'bold',
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          textDecoration: 'none'
        }}>
          StockMaster
        </Link>
      </div>
      
      <div style={{ display: 'flex', gap: '32px' }}>
        <Link to="/dashboard" style={{
          color: '#666',
          textDecoration: 'none',
          fontWeight: '500',
          transition: 'color 0.3s'
        }}>
          Dashboard
        </Link>
        <Link to="/products" style={{
          color: '#666',
          textDecoration: 'none',
          fontWeight: '500',
          transition: 'color 0.3s'
        }}>
          Produits
        </Link>
      </div>
      
      <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
          padding: '6px 16px',
          background: '#f5f7fa',
          borderRadius: '30px'
        }}>
          <span>👤</span>
          <span style={{ fontWeight: '500' }}>{user.name}</span>
        </div>
        <button
          onClick={handleLogout}
          style={{
            background: 'transparent',
            border: '1px solid #e0e0e0',
            padding: '8px 20px',
            borderRadius: '30px',
            cursor: 'pointer',
            color: '#666',
            fontWeight: '500',
            transition: 'all 0.3s'
          }}
        >
          Déconnexion
        </button>
      </div>
    </nav>
  );
}

export default Navbar;