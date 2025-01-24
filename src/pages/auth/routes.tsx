import { redirect, RouteObject } from 'react-router-dom';
import { Login } from './login/login';

const routes: RouteObject[] = [
  {
    path: "login",
    element: <Login />, 
    id: "login", 
  },

];

export default routes;
