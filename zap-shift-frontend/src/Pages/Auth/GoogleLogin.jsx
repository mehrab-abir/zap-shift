import React, { use } from 'react';
import { FcGoogle } from "react-icons/fc";
import { AuthContext } from '../../Context/Auth/AuthContext';
import { useLocation, useNavigate } from 'react-router';

const GoogleLogin = () => {
    const {googleSignIn, setUser} = use(AuthContext);
    const navigate = useNavigate();
    const location = useLocation();

    const googleLogin = ()=>{
        googleSignIn()
        .then((result)=>{
            setUser(result.user)
            navigate(location?.state || '/',{replace : true})
        })
    }
    return (
      <div className='mt-2'>
        <button type='button' onClick={googleLogin} className='btn bg-surface w-full'>
          <FcGoogle className='text-2xl' />
          Log In With Google
        </button>
      </div>
    );
};

export default GoogleLogin;