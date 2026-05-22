import React, { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const ProtectedRoute = ({ children, requireAdmin = false }) => {
    const { user, isAdmin } = useContext(AuthContext);

    if (!user) {
        // Redirect to login if not authenticated
        return <Navigate to="/login" replace />;
    }

    if (requireAdmin && !isAdmin) {
        // Redirect to home if admin is required but user is not admin
        return <Navigate to="/" replace />;
    }

    return children;
};

export default ProtectedRoute;
