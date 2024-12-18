import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../provider/AuthProvider';

interface ProtectedRouteProps {
  allowedRoles: string;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ allowedRoles }) => {
    const { loading, session: { user } } = useAuth();

    if(loading){
      return null;
    }

    const userRole = user?.role; // Extract role from user object

    if (userRole !== allowedRoles) {
      // Redirect if the role doesn't match
      return <Navigate to="/unauthorized" replace />;
    }
  
    return <Outlet />; // Render the child routes if allowed
  };

export default ProtectedRoute;
