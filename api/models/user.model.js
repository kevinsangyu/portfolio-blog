import mongoose, { mongo } from "mongoose";

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        require: true,
        unique: true
    },
    email: {
        type: String,
        require: true,
        unique: true
    },
    password: {
        type: String,
        require: true
    },
    profilePicture: {
        type: String,
        default: "https://static.vecteezy.com/system/resources/thumbnails/030/504/836/small_2x/avatar-account-flat-isolated-on-transparent-background-for-graphic-and-web-design-default-social-media-profile-photo-symbol-profile-and-people-silhouette-user-icon-vector.jpg"
    },
    isAdmin: {
        type: Boolean,
        default: false
    }
}, {timestamps: true})

const User = mongoose.model("User", userSchema)

export default User;