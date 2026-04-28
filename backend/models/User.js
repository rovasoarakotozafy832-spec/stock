const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

// Connexion à MongoDB
mongoose.connect('mongodb://localhost:27017/gestionstock')
  .then(() => console.log('✅ Connecté à MongoDB'))
  .catch(err => console.log('❌ MongoDB erreur:', err));

// MODÈLE SIMPLIFIÉ
const UserSchema = new mongoose.Schema({
  name: String,
  email: String,
  password: String
});
const User = mongoose.model('User', UserSchema);

// ROUTE D'INSCRIPTION
app.post('/api/auth/register', async (req, res) => {
  console.log('📩 Requête reçue:', req.body);
  try {
    const user = new User(req.body);
    await user.save();
    res.json({ message: 'Utilisateur créé', user });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/', (req, res) => {
  res.json({ message: 'API fonctionne' });
});

app.listen(5000, () => {
  console.log('🚀 Serveur sur http://localhost:5000');
});