import { asyncHandler } from "../utils/asyncHandler.js";
import ErrorHandler from "../utils/ErrorHandler.js";
import { randomPasswordGenerator } from "../utils/passwordGenerator.js";

export const createAgent = asyncHandler(async (req, res) => {
    const { name, email, mobile, countryCode, role = "agent" } = req.body;

    if ([name, email, mobile, countryCode, role].some(field => field?.trim() === '')) {
        throw new ErrorHandler("Invalid Inputs", 411);
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
        throw new ErrorHandler("User already exists with this email", 409);
    }

    const password = randomPasswordGenerator();

    const newUser = new User({
        name,
        email,
        password,
        mobile,
        countryCode,
        role
    });

    if (!newUser) {
        throw new ErrorHandler("User creation failed", 500);
    }

    await newUser.save();
    
    // send password to the user via email
    await sendEmail(email, password);

    res.status(201).json({
        success: true,
        message: "Agent created successfully",
        user: {
            id: newUser._id,
            name: newUser.name,
            email: newUser.email,
            mobile: newUser.mobile,
            countryCode: newUser.countryCode,
            role: newUser.role
        }
    });
});

export const getAllAgents = asyncHandler(async (req, res) => {
    const agents = await User.find({ role: 'agent' }).select('-password');

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

    const agent = await User.findById(id).select('-password');

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

    const agent = await User.findByIdAndDelete(id);

    if (!agent) {
        throw new ErrorHandler("Agent not found", 404);
    }

    res.status(200).json({
        success: true,
        message: "Agent deleted successfully"
    });
});