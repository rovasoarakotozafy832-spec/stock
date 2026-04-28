import React from 'react';
import { BrowserRouter, Routes, Route, Navigate, Link } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Products from './pages/Products';

function App() {
  const token = localStorage.getItem('token');
  const isLoggedIn = !!token;

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.href = '/login';
  };

  return (
    <BrowserRouter>
      {isLoggedIn && (
        <nav style={{ 
          background: '#333', 
          padding: '15px 20px', 
          display: 'flex', 
          gap: '20px', 
          alignItems: 'center',
          color: 'white'
        }}>
          <Link to="/dashboard" style={{ color: 'white', textDecoration: 'none' }}>📊 Dashboard</Link>
          <Link to="/products" style={{ color: 'white', textDecoration: 'none' }}>📦 Produits</Link>
          <button 
            onClick={handleLogout}
            style={{ 
              marginLeft: 'auto', 
              background: '#dc3545', 
              color: 'white', 
              border: 'none', 
              padding: '8px 16px', 
              borderRadius: '5px', 
              cursor: 'pointer' 
            }}
          >
            Déconnexion
          </button>
        </nav>
      )}
      
      <Routes>
        <Route path="/login" element={!isLoggedIn ? <Login /> : <Navigate to="/dashboard" />} />
        <Route path="/register" element={!isLoggedIn ? <Register /> : <Navigate to="/dashboard" />} />
        <Route path="/dashboard" element={isLoggedIn ? <Dashboard /> : <Navigate to="/login" />} />
        <Route path="/products" element={isLoggedIn ? <Products /> : <Navigate to="/login" />} />
        <Route path="/" element={<Navigate to={isLoggedIn ? "/dashboard" : "/login"} />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;