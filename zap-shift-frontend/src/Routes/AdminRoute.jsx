import React from 'react';
import useRole from '../Hook/useRole';
import ForbiddenRoute from '../Shared Components/ForbiddenRoute';

const AdminRoute = ({children}) => {
    const {isLoading, role} = useRole();

    if(isLoading){
        return <p><i>Loading...</i></p>
    }

    if(role !== "admin"){
        return <ForbiddenRoute></ForbiddenRoute>
    }

    return children;
};

export default AdminRoute;