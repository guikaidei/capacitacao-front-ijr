import { createBrowserRouter } from "react-router-dom";
import App from "./App";
import userRoutes from './pages/user/routes';
import adminRoutes from './pages/admin/routes';
import clientRoutes from './pages/client/routes';


export const router = createBrowserRouter([
    ...userRoutes,
    ...adminRoutes,
    ...clientRoutes,
    {
        path: "/",
        element: <App />,
    }
]);

