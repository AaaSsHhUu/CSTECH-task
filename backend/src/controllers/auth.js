import User from "../models/user.models.js";
import {asyncHandler} from "../utils/asyncHandler.js";
import ErrorHandler from "../utils/ErrorHandler.js";

export const signup = asyncHandler(async (req, res, next) => {
    const {name, email, password, mobile, countryCode} = req.body;
    
    if ([name, email, password, mobile, countryCode].some(field => field?.trim() === "")) {
        throw new ErrorHandler("Invalid Inputs", 411);
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
        throw new ErrorHandler("User already exists with this email", 409);
    }

    const newUser = await User.create({
        name,
        email,
        password,
        mobile,
        countryCode
    });

    if(!newUser) {
        throw new ErrorHandler("User creation failed", 500);
    }

    res.status(201).json({
        success : true,
        message: "User created successfully",
        user: {
            id: newUser._id,
            name: newUser.name,
            email: newUser.email,
            mobile: newUser.mobile,
            countryCode: newUser.countryCode,
            role: newUser.role
        }
    });
})

export const login = asyncHandler(async (req, res, next) => {
    const {email, password} = req.body;

    if ([email, password].some(field => field?.trim() === "")) {
        throw new ErrorHandler("Invalid Inputs", 411);
    }

    const user = await User.findOne({ email });

    if (!user) {
        throw new ErrorHandler("Invalid email or password", 401);
    }

    res.status(200).json({
        success: true,
        message: "Login successful",
        user: {
            id: user._id,
            name: user.name,
            email: user.email,
            mobile: user.mobile,
            countryCode: user.countryCode,
            role: user.role
        }
    });
});