import express from 'express'
import mongoose from 'mongoose'
import dotenv from 'dotenv'
import userRoutes from './routes/user.route.js'
import cors from 'cors'
import cookieParser from "cookie-parser";

dotenv.config()

const app = express();

app.use(cors({
    origin: 'http://localhost:5173',
    credentials: true, // If your frontend sends credentials (like cookies)
}));

mongoose.connect(process.env.MONGODB_URL).then(()=>{
    console.log("mongodb connected");
})
.catch((err)=>{
    console.log('mongodb error:'+err);
}) 


app.use(express.json())
app.use(express.urlencoded({extended:true}));
app.use(cookieParser())

app.listen(8000,()=>{
    console.log('Server listening on port 8000!!!');
}) 

app.use('/api/user',userRoutes)
app.use((err,req,res,next)=>{
    const statusCode = err.statusCode || 500
    const message = err.message || "Internal Server Error"
    return res.status(statusCode).json({
        success:false,
        message,
        statusCode,
    })
})