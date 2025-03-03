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

    if (!email || !password || email === "" || password === "") {
        next(errorHandler(400, 'All fields are required'))
    }
    try {
        const validUser = await User.findOne({ email })
        if (!validUser) {
            return next(errorHandler(404, "Invalid credentials"))
        }
        const validPassword = bcryptjs.compareSync(password, validUser.password)
        if (!validPassword) {
            return next(errorHandler(400, "Invalid credentials"))
        }

        const { password: _, ...user_info } = validUser._doc

        const token = jwt.sign({ id:validUser._id, isAdmin: validUser.isAdmin }, process.env.JWTSECRET, {expiresIn: 8})
        const refresh_token = jwt.sign({ id: validUser._id, isAdmin:validUser.isAdmin }, process.env.JWTREFRESH, {expiresIn: '60d'})

        res.status(200).cookie('access_token', token, {httpOnly: true}).cookie('refresh_token', refresh_token, {httpOnly: true}).json(user_info)
    } catch (error) {
        next(error)
    }
}

export const google = async (req, res, next) => {
    const { email, name, googlePhotoUrl} = req.body

    try {
        const user = await User.findOne({email})
        if (user) {
            const token = jwt.sign({id: user._id, isAdmin: user.isAdmin}, process.env.JWTSECRET)
            const refresh_token = jwt.sign({id: user._id, isAdmin:validUser.isAdmin}, process.env.JWTREFRESH, {expiresIn: '60d'})
            const {password, ...user_info} = user._doc
            res.cookie('refresh_token', refresh_token, {httpOnly: true})
            res.status(200).cookie('access_token', token, {
                httpOnly: true
            }).json(user_info)
        } else {
            const generatedPassword = Math.random().toString(36).slice(-8) + Math.random().toString(36).slice(-8)
            const hashedPwd = bcryptjs.hashSync(generatedPassword, 12)
            const newUser = new User({
                username: name.toLowerCase().split(' ').join('') + Math.random().toString(9).slice(-4),
                email,
                password: hashedPwd,
                profilePicture: googlePhotoUrl
            })
            await newUser.save();
            const token = jwt.sign({id: newUser._id, isAdmin: newUser.isAdmin}, process.env.JWTSECRET, {expiresIn: 8})
            const refresh_token = jwt.sign({id: newUser._id, isAdmin:validUser.isAdmin}, process.env.JWTREFRESH, {expiresIn: '60d'})
            const {password, ...user_info} = user._doc
            res.status(200).cookie('access_token', token, {httpOnly: true}).cookie('refresh_token', refresh_token, {httpOnly: true}).json(user_info)
        }
    } catch (error) {
        next(error)
    }
}