import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import { toast } from 'sonner';

function Header() {
    const { user, setUser } = useAuth();

    const handleLogout = async () => {
        try {
            const res = await axios.post(
                `${import.meta.env.VITE_BACKEND_URL}/auth/logout`,
                {}, // empty body
                {
                    withCredentials: true,
                },
            );
            if (res.data.success) {
                toast.success(res.data.message || 'Logout successfull');
                setUser(null);
            }
        } catch (error) {
            console.log('Logout error - ', error);
            toast.error(error.response.data.message || 'Logout Failed');
        }
    };
    return (
        <header className="flex items-center justify-between px-6 py-4 bg-slate-800 shadow">
            <div className="text-2xl font-bold text-blue-600">CSTECH</div>
            {!user && (
                <Link
                    to={'/login'}
                    className="bg-blue-500 cursor-pointer text-sm font-semibold text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors"
                >
                    Login
                </Link>
            )}
            {user && (
                <button
                    onClick={handleLogout}
                    className="bg-red-500/90 text-white cursor-pointer text-sm font-semibold px-4 py-2 rounded hover:bg-red-500"
                >
                    Logout
                </button>
            )}
        </header>
    );
}

export default Header;
