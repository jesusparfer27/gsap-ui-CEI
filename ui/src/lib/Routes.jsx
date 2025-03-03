import { createBrowserRouter } from "react-router-dom";
import App from '../App';
import { ErrorPage } from "../pages/ErrorPage";
import FurnitureDisplay from "../pages/FurnitureDisplay";

const router = createBrowserRouter([
    {
        path: '/', 
        element: <App />,
        errorElement: <ErrorPage />,
        children: [
            { index: true, element: <FurnitureDisplay /> },
        ]
    }
]);

export default router;
