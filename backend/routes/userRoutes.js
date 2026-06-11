const router = require('express').Router();
const { getUsers, getUserById, updateProfile, updateUser, deleteUser, toggleWishlist, getWishlist, createUser } = require('../controllers/userController');
const { protect, authorize } = require('../middleware/authMiddleware');

router.get('/', protect, authorize('admin'), getUsers);
router.post('/', protect, authorize('admin'), createUser);
router.get('/wishlist', protect, getWishlist);
router.put('/profile', protect, updateProfile);
router.put('/wishlist/:petId', protect, toggleWishlist);
router.get('/:id', protect, authorize('admin', 'staff'), getUserById);
router.put('/:id', protect, authorize('admin'), updateUser);
router.delete('/:id', protect, authorize('admin'), deleteUser);

module.exports = router;
