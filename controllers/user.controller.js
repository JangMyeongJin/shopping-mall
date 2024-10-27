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

userController.loginUser = async (req,res) => {
    try{
        const {email,password} = req.body;

        const user = await User.findOne({
            email:email
        },"-__v -createdAt -updatedAt");
        
        if(user) {

            // bcrypt 이용해서 hash password 비교
            const isMatch = await bcrypt.compareSync(password, user.password);
            if(isMatch) {
                const token = user.generateToken();

                return res.status(200).json({
                    status: "ok",
                    user,
                    token
                });
            }else {
                throw new Error("Is not match password.");
            }
        }else {
            throw new Error("Is not match email.");
        }

    }catch(err){
        res.status(400).json({
            status: "fail",
            message: err.message
        });
    }
}

userController.getUser = async (req,res) => {
    try {
        const {userId} = req;
        const user = await User.findById(userId);

        if(!user) {
            throw new Error("can not find user");
        }
        
        res.status(200).json({
            status: "ok",
            user
        });

    }catch(err) {
        res.status(400).json({
            status: "fail",
            message: err.message
        });
    }
}

module.exports = userController;
