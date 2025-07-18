import mongoose from "mongoose";
import dotenv from "dotenv";

export const connectDB = async () => {
    dotenv.config();
    try {
        const connect = await mongoose.connect(process.env.MONGO_URI)
        console.log(`MongoDB Connected: ${connect.connection.host}`)
    } catch (err) {
        console.error(`Error: ${err.message}`)
        process.exit(1)
    }
}