import React from "react";
import { Navigate } from "react-router-dom";    
import { useAuthentication } from "../auth/auth";    

interface ProtectedRouteProps {
    children: React.ReactNode; // Define the type for children
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
    const { isAuthorized } = useAuthentication();

    if (isAuthorized === null) {
        return <div>Loading...........</div>;
    }

    if (
        isAuthorized &&
        (window.location.pathname === "/login" || window.location.pathname === "/register")
    ) {
        return <Navigate to="/" />;
    }

    return <>{children}</>; // Wrap children in a fragment
};

export default ProtectedRoute;
