import React, { use } from 'react';
import { AuthContext } from '../Context/Auth/AuthContext';
import useAxios from './useAxios';
import { useQuery } from '@tanstack/react-query';

const useRole = () => {
    const {user} = use(AuthContext);
    const axios = useAxios();

    const {isLoading, data : role = 'user'} = useQuery({
        queryKey : ["user-role",user?.email],
        queryFn : async ()=>{
            const response = await axios.get(`/users/${user?.email}/role`);
            console.log(response);
            return response.data.role;
        }
    })

    return {isLoading, role};
};

export default useRole;