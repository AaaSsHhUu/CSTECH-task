import axios from 'axios';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Eye, EyeOff } from 'lucide-react';
import {toast} from "sonner";

function Login() {
    const [showPassword, setShowPassword] = useState(false);

    const {register, handleSubmit, formState: { errors }} = useForm();

    const onSubmit = async (credentials) => {
        if(!credentials.email || !credentials.password){
            return ;
        }
        try {
            const res = await axios.post(
                `${import.meta.env.VITE_BACKEND_URL}/auth/login`,
                {
                    email: credentials.email,
                    password: credentials.password,
                },
                { withCredentials: true },
            );
    
            console.log('login res - ', res);
            if(res.data.success){
                toast.success(res.data.message || "Login successfull")
            }
        } catch (error) {
            console.log("login error - ", error);
            toast.error(error.response.data.message || "Login Failed");
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100">
            <form
                className="bg-white p-8 rounded shadow-md w-full max-w-sm"
                onSubmit={handleSubmit(onSubmit)}
            >
                <h2 className="text-2xl font-bold mb-6 text-center">Login</h2>

                <div className="mb-4">
                    <label className="block text-gray-700 mb-2" htmlFor="email">
                        Email
                    </label>
                    <input
                        id="email"
                        className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
                        placeholder="Enter your email"
                        {...register('email', {
                            required: 'Email is required',
                        })}
                    />
                    {errors.email && (
                        <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>
                    )}
                </div>
                <div className="mb-4">
                    <label
                        className="block text-gray-700 mb-2"
                        htmlFor="password"
                    >
                        Password
                    </label>
                    <div className="relative">
                        <input
                            id="password"
                            type={showPassword ? 'text' : 'password'}
                            className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
                            placeholder="Enter your password"
                            {...register('password', {
                                required: 'Password is required',
                            })}
                        />
                        <button
                            type="button"
                            className="absolute right-2 top-2 text-sm  focus:outline-none"
                            onClick={() => setShowPassword(!showPassword)}
                        >
                            {showPassword ? <EyeOff /> : <Eye />}
                        </button>
                    </div>
                    {errors.password && (
                        <p className="text-red-500 text-xs mt-1">{errors.password.message}</p>
                    )}
                </div>
                <button
                    type="submit"
                    className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600 transition-colors"
                >
                    Login
                </button>
            </form>
        </div>
    );
}

export default Login;
