const express = require('express');
const router = express.Router();
const Complaint = require('../models/Complaint');
const { protect, authorize } = require('../middleware/auth');

// GET /api/complaints — filtered by role
router.get('/', protect, async (req, res) => {
  try {
    let query = {};

    if (req.user.role === 'student') {
      query.student = req.user._id;
    } else if (req.user.role === 'staff') {
      query.assignedTo = req.user._id;
    }
    // warden and admin see all

    const complaints = await Complaint.find(query)
      .populate('student', 'name email roomNumber')
      .populate('assignedTo', 'name email')
      .sort({ createdAt: -1 });

    res.json(complaints);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch complaints', error: error.message });
  }
});

// POST /api/complaints — students only
router.post('/', protect, authorize('student'), async (req, res) => {
  try {
    const { title, description, category, priority } = req.body;

    if (!title || !description || !category) {
      return res.status(400).json({ message: 'Title, description, and category are required' });
    }

    const complaint = await Complaint.create({
      title,
      description,
      category,
      priority: priority || 'Medium',
      student: req.user._id,
      roomNumber: req.user.roomNumber,
    });

    const populated = await Complaint.findById(complaint._id)
      .populate('student', 'name email roomNumber');

    res.status(201).json(populated);
  } catch (error) {
    res.status(500).json({ message: 'Failed to create complaint', error: error.message });
  }
});

// PUT /api/complaints/:id/assign — wardens only
router.put('/:id/assign', protect, authorize('warden', 'admin'), async (req, res) => {
  try {
    const { staffId } = req.body;
    const complaint = await Complaint.findById(req.params.id);

    if (!complaint) return res.status(404).json({ message: 'Complaint not found' });

    complaint.assignedTo = staffId;
    complaint.status = 'In Progress';
    await complaint.save();

    const updated = await Complaint.findById(complaint._id)
      .populate('student', 'name email roomNumber')
      .populate('assignedTo', 'name email');

    res.json(updated);
  } catch (error) {
    res.status(500).json({ message: 'Assignment failed', error: error.message });
  }
});

// PUT /api/complaints/:id/status — staff only
router.put('/:id/status', protect, authorize('staff', 'admin'), async (req, res) => {
  try {
    const { status, remarks } = req.body;
    const complaint = await Complaint.findById(req.params.id);

    if (!complaint) return res.status(404).json({ message: 'Complaint not found' });

    // Staff can only update their own assigned complaints
    if (
      req.user.role === 'staff' &&
      complaint.assignedTo?.toString() !== req.user._id.toString()
    ) {
      return res.status(403).json({ message: 'Not authorized to update this complaint' });
    }

    complaint.status = status;
    if (remarks) complaint.remarks = remarks;
    await complaint.save();

    const updated = await Complaint.findById(complaint._id)
      .populate('student', 'name email roomNumber')
      .populate('assignedTo', 'name email');

    res.json(updated);
  } catch (error) {
    res.status(500).json({ message: 'Status update failed', error: error.message });
  }
});

// DELETE /api/complaints/:id — admin only
router.delete('/:id', protect, authorize('admin'), async (req, res) => {
  try {
    const complaint = await Complaint.findByIdAndDelete(req.params.id);
    if (!complaint) return res.status(404).json({ message: 'Complaint not found' });
    res.json({ message: 'Complaint deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Delete failed', error: error.message });
  }
});

module.exports = router;