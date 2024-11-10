import express from  "express"
import dotenv from  "dotenv"
import connectDB from "./config/db.js";
import cookieParser from "cookie-parser";
import router from "./routes/route.js";
import cors from "cors";
dotenv.config();
connectDB();
const port = process.env.PORT
const app = express();

app.use(cookieParser())

app.use(cors({
    origin:process.env.FRONTEND_URL,
    credentials:true
}))
app.use(express.json())
app.use(express.urlencoded({extended:true}))

app.use('/api',router)

app.listen(port,()=>{
    console.log(`Server is running on http://localhost:${port}`)
})