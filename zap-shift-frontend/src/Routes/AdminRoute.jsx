import React from 'react';
import useRole from '../Hook/useRole';
import ForbiddenRoute from '../Shared Components/ForbiddenRoute';
import LoaderBar from '../Shared Components/LoaderBar';

const AdminRoute = ({children}) => {
    const {isLoading, role} = useRole();

    if(isLoading){
        return <LoaderBar></LoaderBar>
    }

    if(role !== "admin"){
        return <ForbiddenRoute></ForbiddenRoute>
    }

    return children;
};

export default AdminRoute;