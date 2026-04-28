import React, { useState, useEffect } from 'react';
import axios from 'axios';

function Products() {
  const [products, setProducts] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({ name: '', description: '', price: '', quantity: '' });

  useEffect(() => {
    fetchProducts();
    // Ajouter des produits exemples si la liste est vide
    addSampleProducts();
  }, []);

  const fetchProducts = async () => {
    const token = localStorage.getItem('token');
    const res = await axios.get('http://localhost:5000/api/products', {
      headers: { Authorization: `Bearer ${token}` }
    });
    setProducts(res.data);
  };

  const addSampleProducts = async () => {
    const token = localStorage.getItem('token');
    
    // Vérifier s'il y a déjà des produits
    const res = await axios.get('http://localhost:5000/api/products', {
      headers: { Authorization: `Bearer ${token}` }
    });
    
    if (res.data.length === 0) {
      // Produits exemples en Ariary
      const sampleProducts = [
        { name: "🍎 Pomme Golden", description: "Pomme importée, sucrée et croquante", price: 2500, quantity: 50 },
        { name: "🍌 Banane Cavendish", description: "Banane mûre à point, riche en potassium", price: 1800, quantity: 30 },
        { name: "🍊 Orange Navel", description: "Orange juteuse, pleine de vitamine C", price: 2200, quantity: 40 },
        { name: "🍇 Raisin Blanc", description: "Raisin sans pépins, idéal pour les collations", price: 4500, quantity: 20 },
        { name: "🍓 Fraise Gariguette", description: "Fraise parfumée et très sucrée", price: 6800, quantity: 15 },
        { name: "🍉 Pastèque", description: "Pastèque rafraîchissante, poids 2-3 kg", price: 3500, quantity: 10 },
        { name: "🍍 Ananas Victoria", description: "Ananas doux et parfumé, prêt à déguster", price: 5200, quantity: 25 },
        { name: "🥑 Avocado", description: "Avocado mûre, parfaite pour les salades", price: 4200, quantity: 12 },
        { name: "🥝 Kiwi", description: "Kiwi riche en vitamine C", price: 3800, quantity: 35 },
        { name: "🍋 Citron", description: "Citron frais, idéal pour les jus", price: 1500, quantity: 60 }
      ];
      
      for (const product of sampleProducts) {
        await axios.post('http://localhost:5000/api/products', product, {
          headers: { Authorization: `Bearer ${token}` }
        });
      }
      
      fetchProducts();
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    
    if (editing) {
      await axios.put(`http://localhost:5000/api/products/${editing._id}`, form, {
        headers: { Authorization: `Bearer ${token}` }
      });
    } else {
      await axios.post('http://localhost:5000/api/products', form, {
        headers: { Authorization: `Bearer ${token}` }
      });
    }
    
    setShowModal(false);
    setEditing(null);
    setForm({ name: '', description: '', price: '', quantity: '' });
    fetchProducts();
  };

  const handleDelete = async (id) => {
    if (window.confirm('Supprimer ce produit ?')) {
      const token = localStorage.getItem('token');
      await axios.delete(`http://localhost:5000/api/products/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchProducts();
    }
  };

  return (
    <div style={{ padding: '2rem', background: '#f5f7fa', minHeight: '100vh' }}>
      <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
        {/* En-tête */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
          <div>
            <h1 style={{ fontSize: '32px', color: '#1a1a2e', marginBottom: '8px' }}>📦 Catalogue produits</h1>
            <p style={{ color: '#666' }}>{products.length} produit(s) référencé(s)</p>
          </div>
          <button
            onClick={() => setShowModal(true)}
            style={{
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              color: 'white',
              border: 'none',
              padding: '12px 28px',
              borderRadius: '12px',
              fontSize: '16px',
              fontWeight: '600',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              transition: 'all 0.3s ease'
            }}
          >
            + Nouveau produit
          </button>
        </div>

        {/* Grille de produits */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
          gap: '24px'
        }}>
          {products.map((product) => (
            <div
              key={product._id}
              style={{
                background: 'white',
                borderRadius: '20px',
                overflow: 'hidden',
                transition: 'all 0.3s ease',
                cursor: 'pointer',
                boxShadow: '0 4px 20px rgba(0,0,0,0.08)'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-5px)';
                e.currentTarget.style.boxShadow = '0 10px 40px rgba(0,0,0,0.12)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 4px 20px rgba(0,0,0,0.08)';
              }}
            >
              <div style={{ padding: '20px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '15px' }}>
                  <div>
                    <h3 style={{ fontSize: '18px', color: '#1a1a2e', marginBottom: '8px' }}>{product.name}</h3>
                    <p style={{ color: '#666', fontSize: '14px', lineHeight: '1.5' }}>
                      {product.description || 'Aucune description'}
                    </p>
                  </div>
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <button
                      onClick={() => { setEditing(product); setForm(product); setShowModal(true); }}
                      style={{
                        background: '#667eea',
                        color: 'white',
                        border: 'none',
                        padding: '6px 12px',
                        borderRadius: '8px',
                        cursor: 'pointer',
                        fontSize: '12px'
                      }}
                    >
                      ✏️
                    </button>
                    <button
                      onClick={() => handleDelete(product._id)}
                      style={{
                        background: '#e74c3c',
                        color: 'white',
                        border: 'none',
                        padding: '6px 12px',
                        borderRadius: '8px',
                        cursor: 'pointer',
                        fontSize: '12px'
                      }}
                    >
                      🗑️
                    </button>
                  </div>
                </div>
                <div style={{ display: 'flex', gap: '12px', marginTop: '15px' }}>
                  <div style={{
                    background: '#f0f3ff',
                    padding: '8px 12px',
                    borderRadius: '12px',
                    flex: 1,
                    textAlign: 'center'
                  }}>
                    <div style={{ fontSize: '12px', color: '#666' }}>Prix (Ar)</div>
                    <div style={{ fontSize: '18px', fontWeight: 'bold', color: '#667eea' }}>{product.price.toLocaleString()} Ar</div>
                  </div>
                  <div style={{
                    background: product.quantity < 5 ? '#fee' : '#e8f8f5',
                    padding: '8px 12px',
                    borderRadius: '12px',
                    flex: 1,
                    textAlign: 'center'
                  }}>
                    <div style={{ fontSize: '12px', color: '#666' }}>Stock</div>
                    <div style={{
                      fontSize: '18px',
                      fontWeight: 'bold',
                      color: product.quantity < 5 ? '#e74c3c' : '#27ae60'
                    }}>
                      {product.quantity}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {products.length === 0 && (
          <div style={{
            textAlign: 'center',
            padding: '60px',
            background: 'white',
            borderRadius: '20px',
            marginTop: '40px'
          }}>
            <div style={{ fontSize: '60px', marginBottom: '20px' }}>📦</div>
            <h3 style={{ color: '#333', marginBottom: '10px' }}>Aucun produit</h3>
            <p style={{ color: '#666' }}>Commencez par ajouter votre premier produit</p>
          </div>
        )}

        {/* Modal */}
        {showModal && (
          <div style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'rgba(0,0,0,0.5)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000,
            backdropFilter: 'blur(4px)'
          }} onClick={() => setShowModal(false)}>
            <div style={{
              background: 'white',
              padding: '32px',
              borderRadius: '24px',
              width: '90%',
              maxWidth: '500px',
              maxHeight: '90vh',
              overflow: 'auto'
            }} onClick={(e) => e.stopPropagation()}>
              <h2 style={{ fontSize: '24px', color: '#1a1a2e', marginBottom: '20px' }}>
                {editing ? 'Modifier le produit' : 'Ajouter un produit'}
              </h2>
              
              <form onSubmit={handleSubmit}>
                <div style={{ marginBottom: '16px' }}>
                  <label style={{ display: 'block', marginBottom: '8px', color: '#333', fontWeight: '500' }}>Nom *</label>
                  <input
                    type="text"
                    value={form.name}
                    onChange={(e) => setForm({...form, name: e.target.value})}
                    style={{
                      width: '100%',
                      padding: '12px',
                      border: '2px solid #e0e0e0',
                      borderRadius: '12px',
                      fontSize: '14px'
                    }}
                    required
                  />
                </div>
                
                <div style={{ marginBottom: '16px' }}>
                  <label style={{ display: 'block', marginBottom: '8px', color: '#333', fontWeight: '500' }}>Description</label>
                  <textarea
                    value={form.description}
                    onChange={(e) => setForm({...form, description: e.target.value})}
                    rows="3"
                    style={{
                      width: '100%',
                      padding: '12px',
                      border: '2px solid #e0e0e0',
                      borderRadius: '12px',
                      fontSize: '14px',
                      resize: 'vertical'
                    }}
                  />
                </div>
                
                <div style={{ marginBottom: '16px' }}>
                  <label style={{ display: 'block', marginBottom: '8px', color: '#333', fontWeight: '500' }}>Prix (Ar) *</label>
                  <input
                    type="number"
                    step="100"
                    value={form.price}
                    onChange={(e) => setForm({...form, price: e.target.value})}
                    style={{
                      width: '100%',
                      padding: '12px',
                      border: '2px solid #e0e0e0',
                      borderRadius: '12px',
                      fontSize: '14px'
                    }}
                    required
                  />
                </div>
                
                <div style={{ marginBottom: '24px' }}>
                  <label style={{ display: 'block', marginBottom: '8px', color: '#333', fontWeight: '500' }}>Quantité *</label>
                  <input
                    type="number"
                    value={form.quantity}
                    onChange={(e) => setForm({...form, quantity: e.target.value})}
                    style={{
                      width: '100%',
                      padding: '12px',
                      border: '2px solid #e0e0e0',
                      borderRadius: '12px',
                      fontSize: '14px'
                    }}
                    required
                  />
                </div>
                
                <div style={{ display: 'flex', gap: '12px' }}>
                  <button
                    type="submit"
                    style={{
                      flex: 1,
                      padding: '12px',
                      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                      color: 'white',
                      border: 'none',
                      borderRadius: '12px',
                      fontSize: '16px',
                      fontWeight: '600',
                      cursor: 'pointer'
                    }}
                  >
                    {editing ? 'Modifier' : 'Ajouter'}
                  </button>
                  <button
                    type="button"
                    onClick={() => { setShowModal(false); setEditing(null); setForm({ name: '', description: '', price: '', quantity: '' }); }}
                    style={{
                      flex: 1,
                      padding: '12px',
                      background: '#f5f5f5',
                      color: '#333',
                      border: 'none',
                      borderRadius: '12px',
                      fontSize: '16px',
                      cursor: 'pointer'
                    }}
                  >
                    Annuler
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Products;