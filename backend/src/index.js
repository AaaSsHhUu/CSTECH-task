import express from "express";
import dotenv from "dotenv";
dotenv.config();
import cors from "cors";    
import connectDB from "./utils/db.js";
import errorMiddleware from "./middlewares/errorMiddleware.js";
import cookieParser from "cookie-parser";
import morgan from 'morgan';

// Import routes
import authRoutes from "./routes/auth.routes.js";
import agentRoutes from "./routes/agent.routes.js";
import uploadRoutes from "./routes/uploads.routes.js";

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors({
    origin : process.env.FRONTEND_URL,
    credentials : true
}));
app.use(morgan("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/agent", agentRoutes);
app.use("/api/v1/file", uploadRoutes);

app.use(errorMiddleware);

connectDB().then(() => {
    app.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`);
    });
}).catch((error) => {
    console.error("Error connecting to the database:", error);
    process.exit(1);
});