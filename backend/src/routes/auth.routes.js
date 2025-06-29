import express from 'express';
import { login, logout } from '../controllers/auth.controller.js';
import { isAuthenticated } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.post("/login", login);
router.post("/logout", isAuthenticated, logout);


export default router;