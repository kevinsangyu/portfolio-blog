import User from "../models/user.model.js";
import bcryptjs from 'bcryptjs';
import { errorHandler } from "../utils/error.js";
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
dotenv.config()

export const signup = async (req, res, next) => {
    const { username, email, password } = req.body;
    console.log("Signup request received with body: ", req.body)

    if (!username || !email || !password || username === "" || email === "" || password === "") {
        next(errorHandler(400, 'All fields are required'))
    }

    const hashedPwd = bcryptjs.hashSync(password, 12)

    const newUser = new User({
        username, email, password: hashedPwd
    })
    try {
        await newUser.save()
        res.json({message: "Signup successful.", user: {...newUser._doc}})
    } catch (error) {
        next(error)
    }
}

export const signin = async (req, res, next) => {
    const { email, password } = req.body;
    console.log("Signin request received with body: ", req.body)

    if (!email || !password || email === "" || password === "") {
        next(errorHandler(400, 'All fields are required'))
    }
    try {
        const validUser = await User.findOne({ email })
        if (!validUser) {
            return next(errorHandler(404, "User not found"))
            // todo change to "Wrong credentials"
        }
        const validPassword = bcryptjs.compareSync(password, validUser.password)
        if (!validPassword) {
            return next(errorHandler(400, "Invalid password"))
            // todo change to "Wrong credentials"
        }

        const { password: _, ...user_info } = validUser._doc

        const token = jwt.sign({ id:validUser._id, isAdmin: false }, process.env.JWTSECRET)
        res.status(200).cookie('access_token', token, {httpOnly: true}).json(user_info)
    } catch (error) {
        next(error)
    }
}