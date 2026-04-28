import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      const response = await axios.post('http://localhost:5000/api/auth/login', {
        email,
        password
      });
      
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));
      
      navigate('/dashboard');
    } catch (err) {
      setError('Email ou mot de passe incorrect');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      display: 'flex',
      minHeight: '100vh',
      background: '#f5f7fa'
    }}>
      {/* Partie gauche - branding */}
      <div style={{
        flex: 1,
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        padding: '2rem',
        color: 'white'
      }}>
        <div style={{ textAlign: 'center', maxWidth: '400px' }}>
          <div style={{ fontSize: '80px', marginBottom: '20px' }}>📦</div>
          <h1 style={{ fontSize: '42px', marginBottom: '15px' }}>StockMaster</h1>
          <p style={{ fontSize: '18px', opacity: 0.9, lineHeight: '1.6' }}>
            Gérez votre stock facilement et professionnellement. 
            Suivez vos produits, vos ventes et vos approvisionnements en temps réel.
          </p>
        </div>
      </div>

      {/* Partie droite - formulaire */}
      <div style={{
        flex: 1,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        padding: '2rem'
      }}>
        <div style={{
          background: 'white',
          padding: '48px',
          borderRadius: '30px',
          width: '100%',
          maxWidth: '450px',
          boxShadow: '0 20px 60px rgba(0,0,0,0.1)'
        }}>
          <h2 style={{ fontSize: '32px', color: '#1a1a2e', marginBottom: '10px' }}>Bienvenue</h2>
          <p style={{ color: '#666', marginBottom: '30px' }}>Connectez-vous à votre compte</p>
          
          {error && (
            <div style={{
              background: '#fee',
              color: '#e74c3c',
              padding: '12px',
              borderRadius: '12px',
              marginBottom: '20px',
              fontSize: '14px'
            }}>
              {error}
            </div>
          )}
          
          <form onSubmit={handleSubmit}>
            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', marginBottom: '8px', color: '#333', fontWeight: '500' }}>Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="exemple@email.com"
                style={{
                  width: '100%',
                  padding: '14px',
                  border: '2px solid #e0e0e0',
                  borderRadius: '12px',
                  fontSize: '16px',
                  transition: 'all 0.3s'
                }}
                onFocus={(e) => e.target.style.borderColor = '#667eea'}
                onBlur={(e) => e.target.style.borderColor = '#e0e0e0'}
                required
              />
            </div>
            
            <div style={{ marginBottom: '25px' }}>
              <label style={{ display: 'block', marginBottom: '8px', color: '#333', fontWeight: '500' }}>Mot de passe</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                style={{
                  width: '100%',
                  padding: '14px',
                  border: '2px solid #e0e0e0',
                  borderRadius: '12px',
                  fontSize: '16px',
                  transition: 'all 0.3s'
                }}
                onFocus={(e) => e.target.style.borderColor = '#667eea'}
                required
              />
            </div>
            
            <button
              type="submit"
              disabled={loading}
              style={{
                width: '100%',
                padding: '14px',
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                color: 'white',
                border: 'none',
                borderRadius: '12px',
                fontSize: '16px',
                fontWeight: '600',
                cursor: loading ? 'not-allowed' : 'pointer',
                opacity: loading ? 0.7 : 1,
                transition: 'all 0.3s ease'
              }}
            >
              {loading ? 'Connexion...' : 'Se connecter'}
            </button>
          </form>
          
          <p style={{ textAlign: 'center', marginTop: '25px', color: '#666' }}>
            Pas encore de compte ?{' '}
            <a href="/register" style={{ color: '#667eea', textDecoration: 'none', fontWeight: '600' }}>
              Créer un compte
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Login;