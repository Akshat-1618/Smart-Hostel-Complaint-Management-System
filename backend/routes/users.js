const express = require('express');
const router = express.Router();
const User = require('../models/User');
const { protect, authorize } = require('../middleware/auth');

// GET /api/users — admin sees all, warden sees staff list
router.get('/', protect, authorize('admin', 'warden'), async (req, res) => {
  try {
    let query = {};
    if (req.user.role === 'warden') {
      query.role = 'staff';
    }
    const users = await User.find(query).select('-password').sort({ createdAt: -1 });
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch users', error: error.message });
  }
});

// PUT /api/users/:id/role — admin only
router.put('/:id/role', protect, authorize('admin'), async (req, res) => {
  try {
    const { role } = req.body;
    const validRoles = ['student', 'admin', 'warden', 'staff'];

    if (!validRoles.includes(role)) {
      return res.status(400).json({ message: 'Invalid role' });
    }

    const user = await User.findByIdAndUpdate(
      req.params.id,
      { role },
      { new: true }
    ).select('-password');

    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: 'Role update failed', error: error.message });
  }
});

// DELETE /api/users/:id — admin only
router.delete('/:id', protect, authorize('admin'), async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json({ message: 'User deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Delete failed', error: error.message });
  }
});

// GET /api/users/me — get current user profile
router.get('/me', protect, async (req, res) => {
  res.json(req.user);
});

module.exports = router;