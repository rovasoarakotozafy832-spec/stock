console.log("ALL ENV KEYS:", Object.keys(process.env));
console.log("RAW MONGO_URL:", JSON.stringify(process.env.MONGO_URL));
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');


const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// PORT Railway
const PORT = process.env.PORT || 5000;

// =======================
// CONNEXION MONGODB
// =======================
console.log("MONGO_URL =", process.env.MONGO_URL);
console.log("JWT_SECRET =", process.env.JWT_SECRET);
if (!process.env.MONGO_URL) {
  console.error("❌ MONGO_URL manquant !");
} else {
  mongoose.connect(process.env.MONGO_URL)
    .then(() => console.log('✅ Connecté à MongoDB'))
    .catch(err => console.log('❌ Erreur MongoDB:', err));
}

// =======================
// MODÈLE USER
// =======================
const UserSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true },
  password: String
});

const User = mongoose.model('User', UserSchema);

// =======================
// ROUTES AUTH
// =======================

// INSCRIPTION
app.post('/api/auth/register', async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'Email déjà utilisé' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = new User({
      name,
      email,
      password: hashedPassword
    });

    await user.save();

    const token = jwt.sign(
      { id: user._id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.json({
      token,
      user: { id: user._id, name, email }
    });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// CONNEXION
app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'Email ou mot de passe incorrect' });
    }

    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) {
      return res.status(400).json({ message: 'Email ou mot de passe incorrect' });
    }

    const token = jwt.sign(
      { id: user._id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.json({
      token,
      user: { id: user._id, name: user.name, email }
    });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// =======================
// ROUTES TEST
// =======================
app.get('/', (req, res) => {
  res.json({ message: 'API Gestion de Stock fonctionne !' });
});

// ROUTES PRODUITS
app.use('/api/products', require('./backend/routes/products'));

// =======================
// START SERVER (TOUJOURS DERNIER)
// =======================
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});