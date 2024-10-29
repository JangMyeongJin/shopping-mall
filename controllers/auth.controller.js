const jwt = require("jsonwebtoken");
require("dotenv").config();  // .env 파일 읽기위한 설정
const JWT_SECRET_KEY = process.env.JWT_SECRET_KEY;
const User = require("../models/User");

const authController = {};

authController.authhenticate = async (req, res, next) => {
    try {
        const tokenString = req.headers.authorization;
        if(!tokenString) {
            throw new Error("Token is undefined");
        }

        const token = tokenString.replace("Bearer ", "");
        jwt.verify(token, JWT_SECRET_KEY, (error, payload) => {
            if(error) {
                throw new Error("invaild token");
            }
            req.userId = payload._id;
        });

        next();

    }catch (err) {
        res.status(400).json({
            status: "fail",
            message: err.message
        });

    }
}

authController.checkAdminPermission = async (req, res, next) => {
    try {
        const {userId} = req;
        const user = await User.findById(userId);

        if(user.level !== "admin") {
            throw new Error("User is not admin");
        }
        next();
    }catch(err) {
        res.status(400).json({
            status: "fail",
            message: err.message
        });
    }
}

module.exports = authController;