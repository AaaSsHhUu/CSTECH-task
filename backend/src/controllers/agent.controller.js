import Agent from "../models/agent.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import ErrorHandler from "../utils/ErrorHandler.js";
import { sendEmail } from "../utils/nodemailer.js";
import { randomPasswordGenerator } from "../utils/passwordGenerator.js";

export const createAgent = asyncHandler(async (req, res) => {
    const { name, email, mobile, countryCode, role = "agent" } = req.body;
    if ([name, email, mobile, countryCode, role].some(field => field?.trim() === '')) {
        throw new ErrorHandler("Invalid Inputs", 411);
    }

    const existingUser = await Agent.findOne({ email });
    if (existingUser) {
        throw new ErrorHandler("User already exists with this email", 409);
    }

    const password = randomPasswordGenerator();

    const newAgent = new Agent({
        name,
        email,
        password,
        mobile,
        countryCode,
        role
    });

    if (!newAgent) {
        throw new ErrorHandler("User creation failed", 500);
    }

    const agentRes = await newAgent.save();

    const emailRes = await sendEmail(newAgent.email, password);
    console.log("emailRes - ", emailRes)

    if(!emailRes) {
        await Agent.findByIdAndDelete(agentRes._id); // Clean up if email fails
        throw new ErrorHandler("Failed to send email", 500);
    }

    res.status(201).json({
        success: true,
        message: "Agent created successfully",
        agent: {
            id: newAgent._id,
            name: newAgent.name,
            email: newAgent.email,
            mobile: newAgent.mobile,
            countryCode: newAgent.countryCode,
            role: newAgent.role
        }
    });
});

export const getAllAgents = asyncHandler(async (req, res) => {
    const agents = await Agent.find({ role: 'agent' }).select('-password');

    if (!agents || agents.length === 0) {
        throw new ErrorHandler("No agents found", 404);
    }

    res.status(200).json({
        success: true,
        message: "Agents retrieved successfully",
        agents
    });
});

export const getAgentById = asyncHandler(async (req, res) => {
    const { id } = req.params;

    if (!id) {
        throw new ErrorHandler("Agent ID is required", 400);
    }

    const agent = await Agent.findById(id).select('-password');

    if (!agent) {
        throw new ErrorHandler("Agent not found", 404);
    }

    res.status(200).json({
        success: true,
        message: "Agent retrieved successfully",
        agent
    });
});

export const deleteAgent = asyncHandler(async (req, res) => {
    const { id } = req.params;

    if (!id) {
        throw new ErrorHandler("Agent ID is required", 400);
    }

    const agent = await Agent.findByIdAndDelete(id);

    if (!agent) {
        throw new ErrorHandler("Agent not found", 404);
    }

    res.status(200).json({
        success: true,
        message: "Agent deleted successfully"
    });
});

export const getLoggedInUser = asyncHandler(async (req, res) => {
    if(!req.user){
        throw new ErrorHandler("Please Login First");
    }

    res.status(200).json({
        success : true,
        user : req.user
    })
})