import { RouteObject } from 'react-router-dom';
import { Dashboard } from './dashboard/dashboard';
import { Login } from './auth/login';
import { PrivateRoute } from './auth/privateRoute';

const routes: RouteObject[] = [
  {
    path: "admin/dashboard",
    element: (
      <PrivateRoute>
        <Dashboard />
      </PrivateRoute>
    ), 
    id: "adminDashboard", 
  },
  {
    path: "admin/login",
    element: <Login />, 
    id: "adminLogin", 
  },
];

export default routes;