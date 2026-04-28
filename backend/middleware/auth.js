const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
  // Récupère le token de différentes façons
  let token = req.header('x-auth-token');
  if (!token) {
    // Essaie avec Authorization: Bearer <token>
    const authHeader = req.header('Authorization');
    if (authHeader && authHeader.startsWith('Bearer ')) {
      token = authHeader.substring(7);
    }
  }
  
  console.log('🔍 Token reçu:', token ? 'OUI' : 'NON');
  
  if (!token) {
    return res.status(401).json({ message: 'Accès refusé. Pas de token.' });
  }
  
  try {
    const decoded = jwt.verify(token, 'secret123');
    req.user = decoded;
    next();
  } catch (error) {
    console.log('❌ Token invalide:', error.message);
    res.status(401).json({ message: 'Token invalide.' });
  }
};