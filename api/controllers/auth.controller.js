import User from "../models/user.model.js";
import bcryptjs from 'bcryptjs';
import { errorHandler } from "../utils/error.js";

export const signup = async (req, res, next) => {
    const { username, email, password } = req.body;

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