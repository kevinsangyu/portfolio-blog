import mongoose from 'mongoose'

const postSchema = new mongoose.Schema({
    userId: {
        type: String,
        required: true
    },
    content: {
        type: String,
        required: true,
    },
    title: {
        type: String,
        required: true,
        unique: true
    },
    image: {
        type: String,
        default: 'https://cdn-icons-png.flaticon.com/512/8136/8136031.png'
    },
    category: {
        type: String,
        default: "general"
    },
    slug: {
        type: String,
        required: true,
        unique: true
    }
}, {timestamps: true})

const Post = mongoose.model('Post', postSchema)

export default Post