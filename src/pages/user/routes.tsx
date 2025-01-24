import { redirect, RouteObject } from 'react-router-dom';
import { Dashboard } from './dashboard/dashboard';
import { Home } from './dashboard/nested/home/homepage'; 

const routes : RouteObject[] = [
    {
        path: "user/dashboard",
        element: <Dashboard />,
        id: "dashboard",
        children: [
            {
                index: true,
                loader: async () => redirect('/user/dashboard/home')
            },
            {
                path: "home",
                element: <Home />,
                id: "home"
                
            }
        ]
    }
]

export default routes;