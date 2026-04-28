import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';

function Register() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    try {
      const response = await axios.post('http://localhost:5000/api/auth/register', {
        name,
        email,
        password
      });
      
      // Sauvegarde du token et des infos utilisateur
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));
      
      // Redirection vers le tableau de bord
      navigate('/dashboard');
      
    } catch (err) {
      setError('Erreur lors de l\'inscription. Email peut-être déjà utilisé.');
    }
  };

  return (
    <div style={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
    }}>
      <div style={{
        background: 'white',
        padding: '40px',
        borderRadius: '20px',
        width: '400px',
        boxShadow: '0 20px 60px rgba(0,0,0,0.3)'
      }}>
        <h1 style={{ textAlign: 'center', color: '#667eea', marginBottom: '10px' }}>
          📦 Gestion de Stock
        </h1>
        <h2 style={{ textAlign: 'center', color: '#333', marginBottom: '30px' }}>
          Inscription
        </h2>
        
        {error && (
          <div style={{
            background: '#fee',
            color: '#c33',
            padding: '12px',
            borderRadius: '10px',
            marginBottom: '20px',
            textAlign: 'center'
          }}>
            {error}
          </div>
        )}
        
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Nom complet"
            value={name}
            onChange={(e) => setName(e.target.value)}
            style={{
              width: '100%',
              padding: '14px',
              marginBottom: '16px',
              border: '2px solid #e0e0e0',
              borderRadius: '12px',
              fontSize: '16px'
            }}
            required
          />
          
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            style={{
              width: '100%',
              padding: '14px',
              marginBottom: '16px',
              border: '2px solid #e0e0e0',
              borderRadius: '12px',
              fontSize: '16px'
            }}
            required
          />
          
          <input
            type="password"
            placeholder="Mot de passe"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={{
              width: '100%',
              padding: '14px',
              marginBottom: '20px',
              border: '2px solid #e0e0e0',
              borderRadius: '12px',
              fontSize: '16px'
            }}
            required
          />
          
          <button
            type="submit"
            style={{
              width: '100%',
              padding: '14px',
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              color: 'white',
              border: 'none',
              borderRadius: '12px',
              fontSize: '16px',
              fontWeight: 'bold',
              cursor: 'pointer'
            }}
          >
            S'inscrire
          </button>
        </form>
        
        <p style={{ textAlign: 'center', marginTop: '20px', color: '#666' }}>
          Déjà un compte ? <Link to="/login" style={{ color: '#667eea' }}>Se connecter</Link>
        </p>
      </div>
    </div>
  );
}

export default Register;