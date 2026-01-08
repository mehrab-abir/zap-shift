import React, { use } from 'react';
import { AuthContext } from '../Context/Auth/AuthContext';
import { Navigate, useLocation } from 'react-router';
import LoaderBar from '../Shared Components/LoaderBar';

const PrivateRoute = ({children}) => {
    const {user, loading} = use(AuthContext);
    const location = useLocation();

    if(loading) return <LoaderBar></LoaderBar>

    if(!user){
        return <Navigate state={location.pathname} to='/auth/login' replace></Navigate>
    }
    return children;
};

export default PrivateRoute;