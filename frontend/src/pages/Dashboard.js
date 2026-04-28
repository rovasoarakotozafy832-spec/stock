import React, { useState, useEffect } from 'react';
import axios from 'axios';

function Dashboard() {
  const [stats, setStats] = useState({
    totalProducts: 0,
    totalValue: 0,
    lowStock: 0,
    recentProducts: []
  });
  const [user, setUser] = useState({ name: '' });

  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (userData) setUser(JSON.parse(userData));
    fetchData();
  }, []);

  const fetchData = async () => {
    const token = localStorage.getItem('token');
    try {
      const res = await axios.get('http://localhost:5000/api/products', {
        headers: { Authorization: `Bearer ${token}` }
      });
      const products = res.data;
      
      setStats({
        totalProducts: products.length,
        totalValue: products.reduce((sum, p) => sum + (p.price * p.quantity), 0),
        lowStock: products.filter(p => p.quantity < 5).length,
        recentProducts: products.slice(-5).reverse()
      });
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div style={{ padding: '2rem', background: '#f5f7fa', minHeight: '100vh' }}>
      <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
        {/* En-tête */}
        <div style={{ marginBottom: '2rem' }}>
          <h1 style={{ fontSize: '32px', color: '#1a1a2e', marginBottom: '8px' }}>
            Bonjour, {user.name} 👋
          </h1>
          <p style={{ color: '#666' }}>Voici ce qui se passe dans votre stock aujourd'hui</p>
        </div>

        {/* Cartes statistiques */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
          gap: '24px',
          marginBottom: '40px'
        }}>
          <div style={{
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            padding: '24px',
            borderRadius: '20px',
            color: 'white'
          }}>
            <div style={{ fontSize: '40px', marginBottom: '10px' }}>📦</div>
            <div style={{ fontSize: '36px', fontWeight: 'bold' }}>{stats.totalProducts}</div>
            <div style={{ opacity: 0.9 }}>Produits en stock</div>
          </div>

          <div style={{
            background: 'white',
            padding: '24px',
            borderRadius: '20px',
            boxShadow: '0 4px 20px rgba(0,0,0,0.08)'
          }}>
            <div style={{ fontSize: '40px', marginBottom: '10px' }}>💰</div>
            <div style={{ fontSize: '36px', fontWeight: 'bold', color: '#2ecc71' }}>
              {stats.totalValue.toLocaleString()} Ar
            </div>
            <div style={{ color: '#666' }}>Valeur totale du stock</div>
          </div>

          <div style={{
            background: 'white',
            padding: '24px',
            borderRadius: '20px',
            boxShadow: '0 4px 20px rgba(0,0,0,0.08)'
          }}>
            <div style={{ fontSize: '40px', marginBottom: '10px' }}>⚠️</div>
            <div style={{ fontSize: '36px', fontWeight: 'bold', color: stats.lowStock > 0 ? '#e74c3c' : '#2ecc71' }}>
              {stats.lowStock}
            </div>
            <div style={{ color: '#666' }}>Produits en stock faible</div>
          </div>
        </div>

        {/* Produits récents */}
        <div style={{
          background: 'white',
          borderRadius: '20px',
          padding: '24px',
          boxShadow: '0 4px 20px rgba(0,0,0,0.08)'
        }}>
          <h2 style={{ marginBottom: '20px', color: '#1a1a2e' }}>🔄 Derniers produits ajoutés</h2>
          
          {stats.recentProducts.length === 0 ? (
            <p style={{ color: '#999', textAlign: 'center', padding: '40px' }}>
              Aucun produit pour le moment
            </p>
          ) : (
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ borderBottom: '2px solid #f0f0f0' }}>
                    <th style={{ padding: '12px', textAlign: 'left', color: '#666' }}>Produit</th>
                    <th style={{ padding: '12px', textAlign: 'left', color: '#666' }}>Prix (Ar)</th>
                    <th style={{ padding: '12px', textAlign: 'left', color: '#666' }}>Stock</th>
                  </tr>
                </thead>
                <tbody>
                  {stats.recentProducts.map((product) => (
                    <tr key={product._id} style={{ borderBottom: '1px solid #f0f0f0' }}>
                      <td style={{ padding: '12px', fontWeight: '500' }}>{product.name}</td>
                      <td style={{ padding: '12px', color: '#667eea', fontWeight: '600' }}>{product.price.toLocaleString()} Ar</td>
                      <td style={{ padding: '12px' }}>
                        <span style={{
                          background: product.quantity < 5 ? '#fee' : '#e8f8f5',
                          color: product.quantity < 5 ? '#e74c3c' : '#27ae60',
                          padding: '4px 12px',
                          borderRadius: '20px',
                          fontSize: '12px',
                          fontWeight: '600'
                        }}>
                          {product.quantity}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Dashboard;