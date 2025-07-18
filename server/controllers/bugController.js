const asyncHandler = require('express-async-handler');
const Bug = require('../models/bugModel');
const User = require('../models/userModel');

// @desc    Get all bugs
// @route   GET /api/bugs
// @access  Private
const getBugs = asyncHandler(async (req, res) => {
  const bugs = await Bug.find({})
    .populate('reportedBy', 'name')
    .populate('assignedTo', 'name')
    .sort({ createdAt: -1 });
  res.status(200).json(bugs);
});

// @desc    Get single bug
// @route   GET /api/bugs/:id
// @access  Private
const getBug = asyncHandler(async (req, res) => {
  const bug = await Bug.findById(req.params.id)
    .populate('reportedBy', 'name')
    .populate('assignedTo', 'name');

  if (!bug) {
    res.status(404);
    throw new Error('Bug not found');
  }

  res.status(200).json(bug);
});

// @desc    Create new bug
// @route   POST /api/bugs
// @access  Private
const createBug = asyncHandler(async (req, res) => {
  if (!req.body.title || !req.body.description) {
    res.status(400);
    throw new Error('Please add title and description fields');
  }

  const bug = await Bug.create({
    title: req.body.title,
    description: req.body.description,
    status: req.body.status || 'open',
    priority: req.body.priority || 'medium',
    reportedBy: req.user.id,
    assignedTo: req.body.assignedTo,
    project: req.body.project,
    steps: req.body.steps || '',
  });

  res.status(201).json(bug);
});

// @desc    Update bug
// @route   PUT /api/bugs/:id
// @access  Private
const updateBug = asyncHandler(async (req, res) => {
  const bug = await Bug.findById(req.params.id);

  if (!bug) {
    res.status(404);
    throw new Error('Bug not found');
  }

  // Check user permissions (admin or reporter of the bug)
  if (req.user.role !== 'admin' && bug.reportedBy.toString() !== req.user.id) {
    res.status(403);
    throw new Error('Not authorized to update this bug');
  }

  const updatedBug = await Bug.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  }).populate('reportedBy', 'name').populate('assignedTo', 'name');

  res.status(200).json(updatedBug);
});

// @desc    Delete bug
// @route   DELETE /api/bugs/:id
// @access  Private
const deleteBug = asyncHandler(async (req, res) => {
  const bug = await Bug.findById(req.params.id);

  if (!bug) {
    res.status(404);
    throw new Error('Bug not found');
  }

  // Check user permissions (admin or reporter of the bug)
  if (req.user.role !== 'admin' && bug.reportedBy.toString() !== req.user.id) {
    res.status(403);
    throw new Error('Not authorized to delete this bug');
  }

  await bug.deleteOne();

  res.status(200).json({ id: req.params.id });
});

module.exports = {
  getBugs,
  getBug,
  createBug,
  updateBug,
  deleteBug,
};