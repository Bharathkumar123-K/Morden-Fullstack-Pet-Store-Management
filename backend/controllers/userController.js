const asyncHandler = require('express-async-handler');
const User = require('../models/User');

// @GET /api/users - Admin
const getUsers = asyncHandler(async (req, res) => {
  const { role, page = 1, limit = 10, search } = req.query;
  const query = {};
  if (role) query.role = role;
  if (search) query.$or = [{ name: { $regex: search, $options: 'i' } }, { email: { $regex: search, $options: 'i' } }];
  const total = await User.countDocuments(query);
  const users = await User.find(query).select('-password').limit(limit * 1).skip((page - 1) * limit).sort('-createdAt');
  res.json({ success: true, users, total, pages: Math.ceil(total / limit) });
});

// @GET /api/users/:id
const getUserById = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id).select('-password');
  if (!user) { res.status(404); throw new Error('User not found'); }
  res.json({ success: true, user });
});

// @PUT /api/users/profile
const updateProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);
  const { name, phone, address, avatar } = req.body;
  if (name) user.name = name;
  if (phone) user.phone = phone;
  if (address) user.address = address;
  if (avatar) user.avatar = avatar;
  if (req.body.password) user.password = req.body.password;
  const updated = await user.save();
  res.json({ success: true, user: { _id: updated._id, name: updated.name, email: updated.email, role: updated.role, phone: updated.phone, address: updated.address, avatar: updated.avatar } });
});

// @PUT /api/users/:id - Admin
const updateUser = asyncHandler(async (req, res) => {
  const user = await User.findByIdAndUpdate(req.params.id, req.body, { new: true }).select('-password');
  if (!user) { res.status(404); throw new Error('User not found'); }
  res.json({ success: true, user });
});

// @DELETE /api/users/:id - Admin
const deleteUser = asyncHandler(async (req, res) => {
  const user = await User.findByIdAndUpdate(req.params.id, { isActive: false }, { new: true });
  if (!user) { res.status(404); throw new Error('User not found'); }
  res.json({ success: true, message: 'User deactivated' });
});

// @PUT /api/users/wishlist/:petId
const toggleWishlist = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);
  const idx = user.wishlist.indexOf(req.params.petId);
  if (idx > -1) user.wishlist.splice(idx, 1);
  else user.wishlist.push(req.params.petId);
  await user.save();
  res.json({ success: true, wishlist: user.wishlist });
});

// @GET /api/users/wishlist
const getWishlist = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id).populate('wishlist');
  res.json({ success: true, wishlist: user.wishlist });
});

// @POST /api/users - Admin
const createUser = asyncHandler(async (req, res) => {
  const { name, email, password, role, phone, isActive } = req.body;

  if (!name || !email || !password) {
    res.status(400);
    throw new Error('Name, email, and password are required');
  }

  if (await User.findOne({ email })) {
    res.status(400);
    throw new Error('Email already registered');
  }

  const user = await User.create({
    name,
    email,
    password,
    role: role || 'customer',
    phone,
    isActive: isActive !== undefined ? isActive : true
  });

  res.status(201).json({
    success: true,
    user: {
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      phone: user.phone,
      isActive: user.isActive,
      createdAt: user.createdAt
    }
  });
});

module.exports = { getUsers, getUserById, updateProfile, updateUser, deleteUser, toggleWishlist, getWishlist, createUser };
