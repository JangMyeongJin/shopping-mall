const User = require("../models/User");
const bcrypt = require("bcryptjs");

const saltRounds = 10;

const userController = {};

userController.createUser = async (req, res) => {
    try{
        const { name, email, password, level } = req.body;

        const user = await User.findOne({ email });

        if(user){
            throw new Error("Email already exists");
        }

        const salt = bcrypt.genSaltSync(saltRounds);
        const hash = bcrypt.hashSync(password, salt);
        
        const newUser = new User({
            email:email,
            name:name,
            password:hash,
            level:level ? level : "customer"
        });

        await newUser.save();

        res.status(200).json({
            status: "ok",
        });

    }catch(err){
        res.status(400).json({ 
            status: "fail",
            message: err.message 
        });
    }
}

module.exports = userController;
