const express = require('express');
const router = express.Router();
const userController = require('../controllers/user.controller');

router.post('/signup', userController.signup);
router.put('/:id', userController.upsertUser);
router.get('/by-email', userController.getUserByEmail);
router.get('/:id', userController.getUserById);

module.exports = router;