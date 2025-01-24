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

        const response = await fetch('http://127.0.0.1:8000/client/auth/check/token', {
          method: 'POST',
          credentials: 'include', 
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({}), 
        });
  
        if (!response.ok) {
          throw new Error('Falha ao verificar autenticação');
        }
  
        const data = await response.json();

        console.log(data);
        
        setIsAuthenticated(data.status === 'success');
        localStorage.setItem('menuUser', JSON.stringify(data.user));



      } catch (error) {
        console.error('Erro ao verificar autenticação:', error);
        setIsAuthenticated(false);
      }
    };
  
    checkAuth();
  }, []);
  

  if (isAuthenticated === null) {
    return <div>Loading...</div>;
  }

  if (isAuthenticated === false) {
    return <Navigate to="/client/login" state={{ from: location }} replace />;
  }

  return <>{children}</>;
};