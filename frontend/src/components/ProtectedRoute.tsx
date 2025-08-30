import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

interface ProtectedRouteProps {
  children: React.ReactNode;
  adminOnly?: boolean;
  moderatorOnly?: boolean;
  redirectTo?: string;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ 
  children, 
  adminOnly = false, 
  moderatorOnly = false,
  redirectTo = '/login'
}) => {
  const { user, isAuthenticated, isLoading } = useAuth();
  const location = useLocation();

  // Show loading state while checking authentication
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  // Redirect to login if not authenticated
  if (!isAuthenticated || !user) {
    return <Navigate to={redirectTo} state={{ from: location }} replace />;
  }

  // Check admin access
  if (adminOnly && user.role !== 'admin') {
    return <Navigate to="/unauthorized" replace />;
  }

  // Check moderator access (moderators and admins can access)
  if (moderatorOnly && !['moderator', 'admin'].includes(user.role)) {
    return <Navigate to="/unauthorized" replace />;
  }

  // User is authenticated and has required permissions
  return <>{children}</>;
};

export default ProtectedRoute;
