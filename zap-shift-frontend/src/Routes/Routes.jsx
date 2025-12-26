import { createBrowserRouter } from "react-router";
import Root from "../Pages/Root";
import HomePage from "../Pages/Home/HomePage";
import ServiceCoverage from "../Pages/ServiceCoverage";

const router = createBrowserRouter([
    {
        path : '/',
        Component : Root,
        children : [
            {
                index : true,
                Component : HomePage
            },
            {
                path : 'coverage',
                Component : ServiceCoverage
            }
        ]
    }
])

export default router;