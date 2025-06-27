import express from "express";
import dotenv from "dotenv";
dotenv.config();
import cors from "cors";    
import connectDB from "./utils/db.js";
import errorMiddleware from "./middlewares/errorMiddleware.js";

// Import routes
import authRoutes from "./routes/auth.routes.js";

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use("/api/v1/auth", authRoutes);

app.use(errorMiddleware);

connectDB().then(() => {
    app.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`);
    });
}).catch((error) => {
    console.error("Error connecting to the database:", error);
    process.exit(1);
});