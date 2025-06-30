import { useAuth } from '../context/AuthContext';
import { Navigate, Outlet } from 'react-router-dom';

function ProtectedRoute() {
    const { user, loading } = useAuth();
    
    if(loading) return <div>Loading...</div>;

    else if (user) return <Outlet />

    else return <Navigate to={'/login'} />;
}

export default ProtectedRoute;
