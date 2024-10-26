const express = require('express');
const router = express.Router();
const userController = require('../controllers/user.controller');

// 회원가입
router.post('/', userController.createUser);

// 로그인
router.post('/login', userController.loginUser);

module.exports = router;

