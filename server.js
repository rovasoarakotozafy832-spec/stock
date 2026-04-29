console.log("ALL ENV KEYS:", Object.keys(process.env));
console.log("RAW MONGO_URL:", JSON.stringify(process.env.MONGO_URL));

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const path = require('path');

const app = express();

// =======================
// MIDDLEWARE
// =======================
app.use(cors());
app.use(express.json());

// =======================
// PORT
// =======================
const PORT = process.env.PORT || 5000;

// =======================
// CONNEXION MONGODB
// =======================
console.log("MONGO_URL =", process.env.MONGO_URL);
console.log("JWT_SECRET =", process.env.JWT_SECRET);

mongoose.connect(process.env.MONGO_URL)
  .then(() => console.log('✅ Connecté à MongoDB'))
  .catch(err => console.log('❌ Erreur MongoDB:', err));

// =======================
// SEED ADMIN AUTOMATIQUE
// =======================
mongoose.connection.once('open', async () => {
  const existing = await User.findOne({ email: "admin@gmail.com" });

  if (!existing) {
    const hashedPassword = await bcrypt.hash("admin123", 10);

    await User.create({
      name: "Admin",
      email: "admin@gmail.com",
      password: hashedPassword
    });

    console.log("✅ Admin créé automatiquement");
  } else {
    console.log("ℹ️ Admin déjà existant");
  }
});

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

    const emailClean = email.trim().toLowerCase();

    const existingUser = await User.findOne({ email: emailClean });
    if (existingUser) {
      return res.status(400).json({ message: 'Email déjà utilisé' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = new User({
      name,
      email: emailClean,
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
      user: { id: user._id, name, email: emailClean }
    });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// CONNEXION
app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    const emailClean = email.trim().toLowerCase();

    const user = await User.findOne({ email: emailClean });

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
      user: { id: user._id, name: user.name, email: user.email }
    });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// =======================
// ROUTES API
// =======================

// TEST API
app.get('/api', (req, res) => {
  res.json({ message: 'API Gestion de Stock fonctionne !' });
});

// PRODUITS
app.use('/api/products', require('./backend/routes/products'));

// =======================
// FRONTEND REACT
// =======================

// servir React build
app.use(express.static(path.join(__dirname, 'build')));

// fallback React (safe)
app.use((req, res) => {
  res.sendFile(path.join(__dirname, 'build', 'index.html'));
});

// =======================
// START SERVER
// =======================
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});