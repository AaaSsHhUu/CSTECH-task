import { Schema } from "mongoose";

const UserSchema = new Schema({
    name : {
        type: String,
        required: true,
    },
    email : {
        type: String,
        required: true,
        unique: true,
    },
    password : {
        type: String,
        required: true,
    },
    role : {
        type: String,
        enum: ['agent', 'admin'],
        default: 'agent',
    },
    mobile : {
        type: String,
        required: true,
        unique: true,
    },
    countryCode : {
        type: String,
        required: true,
    },
}, {timestamps: true});

const User = mongoose.model('User', UserSchema);
export default User;