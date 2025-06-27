import mongoose from "mongoose";

const connectDB = async () => {
	try {
        const connectionInstance = await mongoose.connect(process.env.MONGODB_URI);
        console.log("Database connected | DB Host :", connectionInstance.connection.host);
    } catch (error) {
        throw error;
    }
};

export default connectDB;
