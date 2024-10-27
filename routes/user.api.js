const express = require("express");
const router = express.Router();
const userController = require("../controllers/user.controller");
const authController = require("../controllers/auth.controller");

// 회원가입
router.post("/", userController.createUser);

// 로그인
router.post("/login", userController.loginUser);

// token 유효성 검사
router.get("/session", authController.authhenticate, userController.getUser);

module.exports = router;

