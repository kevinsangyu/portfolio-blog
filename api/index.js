import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import testRoutes from './routes/test.route.js'
import authRoutes from './routes/auth.route.js'

dotenv.config()

mongoose.connect(process.env.MONGOURI).then(
    () => { console.log("Database connected") }
).catch((err) => {
    console.log(err)
})

const app = express();
app.use(express.json())

app.listen(3000, () => {
    console.log("Server running on 3000")
})

app.use('/api/test', testRoutes)
app.use('/api/auth', authRoutes)