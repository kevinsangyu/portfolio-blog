import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import testRoutes from './routes/test.route.js'

dotenv.config()

mongoose.connect(process.env.MONGOURI).then(
    () => { console.log("Database connected") }
).catch((err) => {
    console.log(err)
})

const app = express();

app.listen(3000, () => {
    console.log("Server running on 3000")
})

app.use('/api/test', testRoutes)