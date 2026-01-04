import React from 'react';
import useRole from '../Hook/useRole';
import ForbiddenRoute from '../Shared Components/ForbiddenRoute';

const RiderRoute = ({children}) => {
    const {isLoading, role} = useRole();

    if(isLoading){
        return <p><i>Loading...</i></p>
    }

    if(role !== "rider"){
        return <ForbiddenRoute></ForbiddenRoute>
    }

    return children;
};

export default RiderRoute;