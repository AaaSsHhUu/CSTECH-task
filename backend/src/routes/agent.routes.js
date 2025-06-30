import express from 'express';
import { isAuthenticated, isAdmin } from '../middlewares/authMiddleware.js';
import { createAgent, deleteAgent, getAgentById, getAgentLeads, getAllAgents, getLoggedInUser } from '../controllers/agent.controller.js';

const router = express.Router();

router.post("/create", isAuthenticated, isAdmin, createAgent);

router.get("/all", isAuthenticated, isAdmin, getAllAgents);

router.get("/current-user", isAuthenticated, getLoggedInUser);

router.get("/:id", isAuthenticated, getAgentById);

router.delete("/:id", isAuthenticated, isAdmin, deleteAgent);

router.get("/leads/:id", isAuthenticated, getAgentLeads);
export default router;