import { Navigate } from 'react-router-dom';
import { useAuth } from '../services/AuthContext';

const ProtectedRoute = ({ children, allowedRoles }) => {
    const { user, loading } = useAuth();

    if (loading) {
        return (
            <div style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                height: '100vh'
            }}>
                <p>Loading...</p>
            </div>
        );
    }

    if (!user) {
        // Not logged in, redirect to login
        return <Navigate to="/login" replace />;
    }

    if (allowedRoles && !allowedRoles.includes(user.role)) {
        // Logged in but wrong role, redirect to home
        return <Navigate to="/" replace />;
    }

    return children;
};

export default ProtectedRoute;
