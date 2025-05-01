import User from "../models/user.model.js"
import { errorHandler } from "../utils/error.js"
import bcryptjs from 'bcryptjs'
import nodemailer from 'nodemailer'
import dotenv from 'dotenv';

dotenv.config()

export const updateUser = async (req, res, next) => {
    if (req.user.id !== req.params.userId) {
        return next(errorHandler(403, 'Your are not allowed to update this user'))
    }
    if (req.body.password) {
        if (req.body.password.length < 6) {
            return next(errorHandler(400, 'Password must be at least 6 characters'))
        }
        req.body.password = bcryptjs.hashSync(req.body.password, 12)
    }
    if (req.body.username) {
        if (req.body.username.length < 7 || req.body.username.length > 20) {
            return next(errorHandler(400, 'Username must be between 7 and 20 characters'))
        }
        if (req.body.username.includes(' ')) {
            return next(errorHandler(400, 'Username cannot contain spaces'))
        }
        if (req.body.username !== req.body.username.toLowerCase()) {
            return next(errorHandler(400, 'Username must be lowercase'))
        }
        if (!req.body.username.match(/^[a-zA-Z0-9]+$/)) {
            return next(errorHandler(400, 'Username must only contain letters and numbers'))
        }
    }
    try {
        const updateUser = await User.findByIdAndUpdate(req.params.userId, {
            $set: {
                username: req.body.username,
                email: req.body.email,
                emailNotifs: req.body.emailNotifs,
                profilePicture: req.body.profilePicture,
                password: req.body.password
            }
        }, {new: true})
        const {password, ...userinfo} = updateUser._doc
        res.status(200).json(userinfo)
    } catch (error) {
        next(error)
    }
}

export const deleteUser = async (req, res, next) => {
    if (!req.user.isAdmin && req.user.id !== req.params.userId) {
        return next(errorHandler(403, 'Your are not allowed to update this user'))
    }
    try {
        await User.findByIdAndDelete(req.params.userId)
        res.status(200).json('User has been deleted')
    } catch (error) {
        next(error)
    }
}

export const signout = (req, res, next) => {
    try {
        res.clearCookie('refresh_token')
        res.clearCookie('access_token').status(200).json("User has been signed out")
    } catch (error) {
        next(error)
    }
}

export const getUsers = async (req, res, next) => {
    if (!req.user.isAdmin) {
        return next(errorHandler(403, "You do not have permission to view all users"))
    }
    try {
        const startIndex = parseInt(req.query.startIndex) || 0
        const limit = parseInt(req.query.limit) || 9
        const sortDirection = parseInt(req.query.sort) === 'asc' ? 1: -1

        const users = await User.find().sort({createdAt: sortDirection}).skip(startIndex).limit(limit)
        const usersWithoutPassword = users.map((user) => {
            const { password, ...userInfo } = user._doc
            return userInfo
        })
        const totalUsers = await User.countDocuments()
        const now = new Date()
        const oneMonthAgo = new Date(
            now.getFullYear(),
            now.getMonth() - 1,
            now.getDate()
        )

        const lastMonthUsers = await User.countDocuments({createdAt: {$gte: oneMonthAgo}})
        res.status(200).json({users: usersWithoutPassword, totalUsers, lastMonthUsers})
    } catch (error) {
        next(error)
    }
}

export const getUser = async (req, res, next) => {
    try {
        const user = await User.findById(req.params.userId)
        if (!user) {
            return next(errorHandler(404, "User not found"))
        }
        const {password, ...userInfo} = user._doc
        res.status(200).json(userInfo)
    } catch (error) {
        next(error)
    }
}

export const emailNotification = async (postData, slug) => {
    // sending an email to users about a new post
    const users = await User.find({emailNotifs: true}, 'email')
    const emails = users.map((user) => user.email)

    const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
            user: process.env.EMAILUSER,
            pass: process.env.EMAILPASS
        }
    })

    const mailOptions = {
        from: process.env.EMAILUSER,
        bcc: emails,
        subject: `${postData.title} [NEW POST]`,
        html: `
        <h2>Hey there! A new post is available to read on my blog: www.kevincodex.com/post/${slug}</h2>
        <h1>${postData.title}</h1>
        <img src=${postData.image} alt="blog face-image" width="1000"/>
        <p>${postData.content.substring(0, 300)}...</p>
        <br><br>
        <h4>You're receiving this email because you have opted in to email notifications. To turn this off, please navigate to your profile and deselect email notifications and press update.
        www.kevincodex.com/dashboard?tab=profile</h4>
        `,
        headers: {
            'Content-Type': 'text/html; charset=UTF-8',
          },
    }

    try {
        const info = await transporter.sendMail(mailOptions)
        console.log("Email notifications have been sent.")
    } catch (error) {
        console.log(error)
    }
}