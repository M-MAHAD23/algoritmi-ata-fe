import { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import useUserInfo from '../hooks/hooks';

// Define role-based access control for routes
const ProtectedRoute = ({ children, allowedRoles, token, userInfo }) => {


    if (token && userInfo) {
        return <Navigate to="/dashboard" replace />;
    }

    if (!token) {
        // Redirect to SignIn if not logged in
        return <Navigate to="/signin" replace />;
    }

    if (!allowedRoles.includes(userInfo.role)) {
        // Redirect to a "Not Authorized" page or the Landing page if access is not allowed
        return <Navigate to="/" replace />;
    }

    return children;
};

export default ProtectedRoute;
