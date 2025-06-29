import express from "express";
import {isAuthenticated, isAdmin} from "../middlewares/authMiddleware.js";
import { uploadAndDistribute } from "../controllers/upload.controller.js";
import upload from "../middlewares/multer.js";

const router = express.Router();

router.post("/upload", isAuthenticated, isAdmin, upload.single('file'),uploadAndDistribute);

export default router;