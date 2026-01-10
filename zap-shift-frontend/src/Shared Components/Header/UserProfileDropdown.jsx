import React from 'react';
import userAvatar from "../../assets/userAvatar.png";
import { use } from 'react';
import LoaderBar from '../LoaderBar';
import { AuthContext } from '../../Context/Auth/AuthContext';

const UserProfileDropdown = () => {
    const { user, logOutUser, loading } = use(AuthContext);

    const handleLogOut = () => {
      logOutUser().then(() => {});
    };

    if(loading){
        return <LoaderBar></LoaderBar>
    }

    const userProfile =
      user?.photoURL || user?.providerData[0]?.photoURL || userAvatar;
    return (
      <div className="flex ietms-center gap-2">
        <img src={userProfile} alt="" className="w-10 md:w-12 rounded-full" />
        <button
          onClick={handleLogOut}
          className="btn btn-sm md:btn-md self-center bg-surface border border-red-500"
        >
          Log Out
        </button>
      </div>
    );
};

export default UserProfileDropdown;