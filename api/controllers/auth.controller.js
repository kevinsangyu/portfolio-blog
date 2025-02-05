import User from "../models/user.model.js";
import bcryptjs from 'bcryptjs';

export const signup = async (req, res) => {
    const { username, email, password } = req.body;

    if (!username || !email || !password || username === "" || email === "" || password === "") {
        return res.status(400).json({message: "All fields are required", body: {...req.body}})
    }

    const hashedPwd = bcryptjs.hashSync(password, 12)

    const newUser = new User({
        username, email, password: hashedPwd
    })
    try {
        await newUser.save()
        res.json({message: "Signup successful.", user: {...newUser._doc}})
    } catch (error) {
        res.status(500).json({message: error.message, code: error.code, name: error.name})
    }
}