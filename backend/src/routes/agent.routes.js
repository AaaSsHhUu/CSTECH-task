import express from 'express';
import { isAuthenticated, isAdmin } from '../middlewares/authMiddleware.js';
import { createAgent, getAgentById, getAllAgents, getLoggedInUser } from '../controllers/agent.controller.js';

const router = express.Router();

router.post("/create", isAuthenticated, isAdmin, createAgent);
router.get("/all", isAuthenticated, isAdmin, getAllAgents);
router.get("/:id", isAuthenticated, getAgentById);
router.get("/current-user", isAuthenticated, getLoggedInUser)
export default router;