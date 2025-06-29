import Agent from '../models/agent.model.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import ErrorHandler from '../utils/ErrorHandler.js';

export const login = asyncHandler(async (req, res, next) => {
    const { email, password } = req.body;
    if ([email, password].some((field) => field?.trim() === '')) {
        throw new ErrorHandler('Invalid Inputs', 411);
    }

    const agent = await Agent.findOne({ email });

    const isPasswordCorrect = agent
        ? await agent.isPasswordCorrect(password)
        : false;

    if (!agent || !isPasswordCorrect) {
        throw new ErrorHandler('Invalid email or password', 401);
    }

    const token = agent.generateAuthToken();

    res.cookie('accessToken', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'none',
        maxAge: 24 * 60 * 60 * 1000, // 1 day
    });

    res.status(200).json({
        success: true,
        message: 'Login successful',
        newAgent: {
            id: agent._id,
            name: agent.name,
            email: agent.email,
            mobile: agent.mobile,
            countryCode: agent.countryCode,
            role : agent.role
        },
    });
});

export const logout = asyncHandler(async (req, res, next) => {
    res.clearCookie('accessToken', {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'none',
    });

    res.status(200).json({
        success: true,
        message: 'Logout successful',
    });
});