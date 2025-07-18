const express = require('express');
const router = express.Router();
const {
  getBugs,
  getBug,
  createBug,
  updateBug,
  deleteBug,
} = require('../controllers/bugController');
const { protect } = require('../middleware/authMiddleware');

router.route('/')
  .get(protect, getBugs)
  .post(protect, createBug);

router.route('/:id')
  .get(protect, getBug)
  .put(protect, updateBug)
  .delete(protect, deleteBug);

module.exports = router;