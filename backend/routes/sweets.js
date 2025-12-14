const express = require('express');
const Sweet = require('../models/Sweet');
const { auth, adminAuth } = require('../middleware/auth');
const router = express.Router();

// Get all sweets
router.get('/', async (req, res) => {
  try {
    const sweets = await Sweet.find();
    res.json(sweets);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Search sweets
router.get('/search', async (req, res) => {
  try {
    const { name, category, minPrice, maxPrice } = req.query;
    const query = {};
    
    if (name) query.name = { $regex: name, $options: 'i' };
    if (category) query.category = { $regex: category, $options: 'i' };
    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) query.price.$gte = parseFloat(minPrice);
      if (maxPrice) query.price.$lte = parseFloat(maxPrice);
    }

    const sweets = await Sweet.find(query);
    res.json(sweets);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Create sweet (Admin only)
router.post('/', auth, adminAuth, async (req, res) => {
  try {
    const sweet = new Sweet(req.body);
    await sweet.save();
    res.status(201).json(sweet);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Update sweet (Admin only)
router.put('/:id', auth, adminAuth, async (req, res) => {
  try {
    const sweet = await Sweet.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!sweet) {
      return res.status(404).json({ message: 'Sweet not found' });
    }
    res.json(sweet);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Delete sweet (Admin only)
router.delete('/:id', auth, adminAuth, async (req, res) => {
  try {
    const sweet = await Sweet.findByIdAndDelete(req.params.id);
    if (!sweet) {
      return res.status(404).json({ message: 'Sweet not found' });
    }
    res.json({ message: 'Sweet deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Purchase sweet
router.post('/:id/purchase', auth, async (req, res) => {
  try {
    const { quantity = 1 } = req.body;
    const sweet = await Sweet.findById(req.params.id);
    
    if (!sweet) {
      return res.status(404).json({ message: 'Sweet not found' });
    }
    
    if (sweet.quantity < quantity) {
      return res.status(400).json({ message: 'Insufficient quantity' });
    }
    
    sweet.quantity -= quantity;
    await sweet.save();
    
    res.json({ message: 'Purchase successful', sweet });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Restock sweet (Admin only)
router.post('/:id/restock', auth, adminAuth, async (req, res) => {
  try {
    const { quantity } = req.body;
    
    if (!quantity || quantity <= 0) {
      return res.status(400).json({ message: 'Restock amount must be positive' });
    }
    
    const sweet = await Sweet.findById(req.params.id);
    if (!sweet) {
      return res.status(404).json({ message: 'Sweet not found' });
    }
    
    sweet.quantity += quantity;
    await sweet.save();
    
    res.json({ message: 'Restock successful', sweet });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

module.exports = router;