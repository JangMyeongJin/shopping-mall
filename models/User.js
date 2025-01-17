const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
require("dotenv").config();
const JWT_SECRET_KEY = process.env.JWT_SECRET_KEY;

const userSchema = new mongoose.Schema({
    name: {type: String, required: true},
    email: {type: String, required: true, unique: true},
    password: {type: String, required: true},
    level: {type: String, default: "customer"}
},{
    timestamps: true
});

userSchema.methods.toJSON = function() {
    const obj = this._doc;
    delete obj.__v;
    delete obj.createdAt;
    delete obj.updatedAt;
    return obj;
};

userSchema.methods.generateToken = function() {
    const token = jwt.sign({
        _id: this._id
    }, JWT_SECRET_KEY, {
        expiresIn: "1d"
    });
    return token;
};


const User = mongoose.model("User", userSchema);

module.exports = User;