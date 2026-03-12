const userModel = require("../models/user.model");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

async function registerUser(req, res) {
    const { fullName, email, password } = req.body;

    const isUserAlreadyExist = await userModel.findOne({
        email
    })

    if(isUserAlreadyExist) {
        return res.status(400).json({
            message: "User already exists"
        })
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await userModel.create({
        fullName,email, password: hashedPassword
    })

    const token = jwt.sign({ id: user._id },process.env.JWT_SECRET); 
    res.cookie("token", token)

    res.status(201).json({
        message: "User registered successfully",
        user : {
            _id : user._id,
            fullName : user.fullName,
            email : user.email
        }
    })

}

async function loginUser(req,res){
    const {email,password} = req.body;

    const userExists = await userModel.findOne({
        email 
    })

    if (!userExists) {
        return res.status(404).json({
            message: "User not found"
        })
    }

    const isPasswordValid = await bcrypt.compare(password, userExists.password);

    if (!isPasswordValid) {
        return res.status(401).json({
            message: "Invalid password"
        })
    }

    const token = jwt.sign({ id: userExists._id }, process.env.JWT_SECRET);
    res.cookie("token", token);

    res.status(200).json({
        message: "User logged in successfully",
        user: {
            _id: userExists._id,
            fullName: userExists.fullName,
            email: userExists.email
        }
    });
}

async function logoutUser(req,res){
    res.clearCookie("token");
    res.status(200).json({
        message: "User logged out successfully"
    });
}


module.exports = {registerUser, loginUser, logoutUser}