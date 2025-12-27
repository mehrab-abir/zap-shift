import { createBrowserRouter } from "react-router";
import Root from "../Pages/Root";
import HomePage from "../Pages/Home/HomePage";
import ServiceCoverage from "../Pages/ServiceCoverage";
import Login from "../Pages/Auth/Login";
import AuthLayout from "../Pages/Auth/AuthLayout";
import Register from "../Pages/Auth/Register";
import ForgetPassword from "../Pages/Auth/ForgetPassword";

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
    },
    {
        path : '/auth',
        Component : AuthLayout,
        children : [
            {
                index : true,
                Component : Login
            },
            {
                path : '/auth/login',
                Component : Login 
            },
            {
                path : '/auth/register',
                Component : Register
            },
            {
                path : '/auth/resetpassword',
                Component : ForgetPassword
            }
        ]
    }
])

export default router;