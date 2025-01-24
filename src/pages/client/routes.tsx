import { redirect, RouteObject } from 'react-router-dom';
import { Menu } from './menu/menu';

const routes: RouteObject[] = [
  {
    path: "client/menu",
    element: <Menu />, 
    id: "clientMenu", 
  },

];

export default routes;
