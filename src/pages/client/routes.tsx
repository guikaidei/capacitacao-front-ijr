import { redirect, RouteObject } from 'react-router-dom';
import { Menu } from './menu/menu';
import { Login } from './auth/login/login';
import { PrivateRoute } from './auth/privateRoute';


const routes: RouteObject[] = [
  {
    path: "client/menu",
    element: (
        <PrivateRoute>
            <Menu />
        </PrivateRoute>
        ),  
    id: "clientMenu", 
  },

  {
    path: "client/login",
    element: <Login />,
    id: "clientLogin",
  },

];

export default routes;
