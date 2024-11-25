const express = require('express');
const router = express.Router();
const adminController = require('../controller/adminController');

const adminAuth = require('../middleware/adminAuth');

// Admin login routes
router.get('/login', adminAuth.isLogin, adminController.loadLogin);
router.post('/login', adminController.login);

// Admin dashboard with search functionality
router.get('/dashboard', adminAuth.checkSession, adminController.loadDashboard); // Search handled in loadDashboard

// User management routes
router.post('/edit-user', adminAuth.checkSession, adminController.editUser);
router.get('/delete-user/:id', adminAuth.checkSession, adminController.deleteUser);
router.post('/add-user', adminAuth.checkSession, adminController.addUser);

// Admin logout route
router.get('/logout', adminAuth.checkSession, adminController.logout);
router.get('/search', adminAuth.checkSession, adminController.searchAdminUsers);
module.exports = router;
