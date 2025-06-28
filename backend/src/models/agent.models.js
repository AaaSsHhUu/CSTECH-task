import mongoose, { Schema } from 'mongoose';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const agentSchema = new Schema(
    {
        name: {
            type: String,
            required: true,
        },
        email: {
            type: String,
            required: true,
            unique: true,
        },
        password: {
            type: String,
            required: true,
        },
        role: {
            type: String,
            enum: ['agent', 'admin'],
            default: 'agent',
        },
        mobile: {
            type: String,
            required: true,
            unique: true,
        },
        countryCode: {
            type: String,
            required: true,
        },
    },
    { timestamps: true },
);

agentSchema.pre('save', async function (next) {
    if (this.isModified('password')) {
        this.password = await bcrypt.hash(this.password, 10);
        next();
    }
    return next();
});

agentSchema.methods.isPasswordCorrect = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
};

agentSchema.methods.generateAuthToken = function () {
    const token = jwt.sign(
        {
            id: this._id,
            email: this.email,
            name: this.name,
        },
        process.env.ACCESS_TOKEN_SECRET,
        {
            expiresIn: process.env.ACCESS_TOKEN_EXPIRY || '1d',
        },
    );
    return token;
};

const Agent = mongoose.model('Agent', agentSchema);
export default Agent;
