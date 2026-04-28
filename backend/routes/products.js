const router = require('express').Router();
const Product = require('../models/Product');
const auth = require('../middleware/auth');

// Lister tous les produits
router.get('/', auth, async (req, res) => {
  try {
    const products = await Product.find({ userId: req.user.id });
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Créer un produit
router.post('/', auth, async (req, res) => {
  try {
    const { name, description, price, quantity } = req.body;
    const product = new Product({
      name, description, price, quantity,
      userId: req.user.id
    });
    await product.save();
    res.status(201).json(product);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Modifier un produit
router.put('/:id', auth, async (req, res) => {
  try {
    const product = await Product.findOneAndUpdate(
      { _id: req.params.id, userId: req.user.id },
      req.body,
      { new: true }
    );
    if (!product) return res.status(404).json({ message: 'Produit non trouvé' });
    res.json(product);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Supprimer un produit
router.delete('/:id', auth, async (req, res) => {
  try {
    const product = await Product.findOneAndDelete({
      _id: req.params.id,
      userId: req.user.id
    });
    if (!product) return res.status(404).json({ message: 'Produit non trouvé' });
    res.json({ message: 'Produit supprimé' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;