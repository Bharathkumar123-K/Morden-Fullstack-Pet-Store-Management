const asyncHandler = require('express-async-handler');
const PetCategory = require('../models/PetCategory');

const getCategories = asyncHandler(async (req, res) => {
  const filter = req.query.all === 'true' ? {} : { isActive: true };
  const categories = await PetCategory.find(filter);
  res.json({ success: true, categories });
});

const createCategory = asyncHandler(async (req, res) => {
  const category = await PetCategory.create(req.body);
  res.status(201).json({ success: true, category });
});

const updateCategory = asyncHandler(async (req, res) => {
  const category = await PetCategory.findByIdAndUpdate(req.params.id, req.body, { new: true });
  res.json({ success: true, category });
});

const deleteCategory = asyncHandler(async (req, res) => {
  await PetCategory.findByIdAndUpdate(req.params.id, { isActive: false });
  res.json({ success: true });
});

module.exports = { getCategories, createCategory, updateCategory, deleteCategory };
