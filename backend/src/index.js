import express from "express";
import dotenv from "dotenv";
dotenv.config();
import cors from "cors";    
import connectDB from "./utils/db.js";

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

connectDB().then(() => {
    app.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`);
    });
}).catch((error) => {
    console.error("Error connecting to the database:", error);
    process.exit(1);
});