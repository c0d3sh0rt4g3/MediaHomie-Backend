import userRoutes from "./routes/user.routes.js";
import {connectDB} from "./config/db.js";
import cors from "cors";
import express from "express";

const app = express();
app.use(express.json());

const PORT = 3000;

// Allowed origins
const allowedOrigins = [
    "http://localhost:5173",
    "http://localhost:3000"
];

// CORS config
const corsOptions = {
    origin: (origin, callback) => {
        if (!origin || allowedOrigins.includes(origin)) {
            callback(null, true);
        } else {
            console.log(`CORS blocked origin: ${origin}`);
            callback(new Error("Not allowed by CORS"));
        }
    },
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: [
        "Content-Type",
        "Authorization",
        "X-Requested-With",
        "Accept",
        "Origin"
    ],
    credentials: true
};

app.use(cors(corsOptions));

app.use('/users', userRoutes);

app.listen(PORT, async () => {
  await connectDB();
  console.log(`Server is running on http://localhost:${PORT}`);
});
