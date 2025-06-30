import { useAuth } from '../context/AuthContext';
import { Navigate, Outlet } from 'react-router-dom';
import Loader from './Loader';

function ProtectedRoute() {
    const { user, loading } = useAuth();
    
    if(loading) return <Loader />;

    else if (user) return <Outlet />

    else return <Navigate to={'/login'} />;
}

export default ProtectedRoute;
