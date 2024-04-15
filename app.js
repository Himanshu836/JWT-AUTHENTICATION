//ES-6
import dotenv from "dotenv"
dotenv.config()
import express from "express"
import cors from "cors"
import connectDB from "./config/connectdb.js"
import userRoutes from "./routes/userRoutes.js"

const app =express()
const port = process.env.PORT2
const DATABASE_URL=process.env.DATABASE_URL

//CORS POLICY
app.use(cors())

connectDB(DATABASE_URL)

//JSON
app.use(express.json())

//LOAD ROUTES
app.use("/api/user",userRoutes)

app.listen(port,()=>{
    console.log(`server running on ${port}`)
})