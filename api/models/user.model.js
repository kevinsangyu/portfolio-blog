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
        default: "https://www.google.com/url?sa=i&url=https%3A%2F%2Fthenounproject.com%2Fbrowse%2Ficons%2Fterm%2Fblank-profile%2F&psig=AOvVaw3C_Qix5XEgdSKwnO8xLp_W&ust=1739440700705000&source=images&cd=vfe&opi=89978449&ved=0CBQQjRxqFwoTCND7pt_vvYsDFQAAAAAdAAAAABAJ"
    }
}, {timestamps: true})

const User = mongoose.model("User", userSchema)

export default User;