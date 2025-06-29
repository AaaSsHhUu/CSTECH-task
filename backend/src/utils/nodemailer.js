import nodemailer from "nodemailer";
import dotenv from "dotenv";
dotenv.config();

const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: process.env.EMAIL_USER,  
        pass: process.env.EMAIL_PASS   
    }
});

export const sendEmail = async (email, password) => {
    const mailOptions = {
        from: process.env.EMAIL_USER,
        to: email,
        subject: "Your Account Credentials",
        text: `Your account has been created successfully. Here are your credentials:\n\nEmail: ${email}\nPassword: ${password}`,
    };

    try {
        await transporter.sendMail(mailOptions);
    } catch (error) {
        console.log("email error - ", error);
        return false; // Return false if email sending fails
    }

    return true; // Return true if email is sent successfully
};

// Send otp for password reset