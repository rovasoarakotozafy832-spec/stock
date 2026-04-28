const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const app = express();
app.use(cors());
app.use(express.json());

// Connexion MongoDB
mongoose.connect('mongodb://localhost:27017/gestionstock')
  .then(() => console.log('✅ Connecté à MongoDB'))
  .catch(err => console.log('❌ Erreur MongoDB:', err));

// Modèle Utilisateur
const UserSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true },
  password: String
});
const User = mongoose.model('User', UserSchema);

// Inscription (avec cryptage + token)
app.post('/api/auth/register', async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'Email déjà utilisé' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({ name, email, password: hashedPassword });
    await user.save();

    const token = jwt.sign(
      { id: user._id, email: user.email },
      'secret123',
      { expiresIn: '7d' }
    );

    res.json({ token, user: { id: user._id, name, email } });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Connexion (avec vérification + token)
app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: 'Email ou mot de passe incorrect' });

    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) return res.status(400).json({ message: 'Email ou mot de passe incorrect' });

    const token = jwt.sign(
      { id: user._id, email: user.email },
      'secret123',
      { expiresIn: '7d' }
    );

    res.json({ token, user: { id: user._id, name: user.name, email } });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/', (req, res) => {
  res.json({ message: 'API Gestion de Stock fonctionne !' });
});

app.listen(5000, () => {
  console.log('🚀 Serveur sur http://localhost:5000');
});
app.use('/api/products', require('./routes/products'));