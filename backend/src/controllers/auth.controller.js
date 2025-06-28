import User from '../models/user.models.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import ErrorHandler from '../utils/ErrorHandler.js';

export const login = asyncHandler(async (req, res, next) => {
    const { email, password } = req.body;

    if ([email, password].some((field) => field?.trim() === '')) {
        throw new ErrorHandler('Invalid Inputs', 411);
    }

    const user = await User.findOne({ email });

    const isPasswordCorrect = user
        ? await user.isPasswordCorrect(password)
        : false;

    if (!user || !isPasswordCorrect) {
        throw new ErrorHandler('Invalid email or password', 401);
    }

    const token = user.generateAuthToken();

    res.cookie('accessToken', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'none',
        maxAge: 24 * 60 * 60 * 1000, // 1 day
    });

    res.status(200).json({
        success: true,
        message: 'Login successful',
        user: {
            id: user._id,
            name: user.name,
            email: user.email,
            mobile: user.mobile,
            countryCode: user.countryCode,
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