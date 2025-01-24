import React, { useState, useEffect } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import axios from 'axios';

interface PrivateRouteProps {
  children: React.ReactNode;
}

export const PrivateRoute: React.FC<PrivateRouteProps> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const location = useLocation();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        console.log('Token:' + localStorage.getItem('admin_auth_token'));
        const response = await axios.post('http://127.0.0.1:8000/admin/auth/check/token', {
          withCredentials: true
        });

        // Verify user is an admin
        setIsAuthenticated(response.data.role === 'admin');
      } catch (error) {
        setIsAuthenticated(false);
      }
    };

    checkAuth();
  }, []);

  // Null means still checking authentication
  if (isAuthenticated === null) {
    return <div>Loading...</div>;
  }

  // Not authenticated, redirect to login
  if (isAuthenticated === false) {
    return <Navigate to="/admin/login" state={{ from: location }} replace />;
  }

  // Authenticated, render children
  return <>{children}</>;
};