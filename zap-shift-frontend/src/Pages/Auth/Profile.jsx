import React from 'react';
import { use } from 'react';
import { AuthContext } from '../../Context/Auth/AuthContext';
import userAvatar from "../../assets/userAvatar.png";
import { MdOutlineMailOutline } from "react-icons/md";
import { FaRegUser } from 'react-icons/fa6';
import Footer from '../../Shared Components/Footer';

const Profile = () => {
    const {user} = use(AuthContext);

    const userProfilePic =
        user?.photoURL || user?.providerData[0]?.photoURL || userAvatar;

    return (
      <div>
        <title>Profile</title>
        <div className="w-full md:w-11/12 mx-auto flex flex-col items-center justify-center bg-surface mt-10 rounded-xl">
          <h1 className="text-2xl font-semibold text-center mt-5">
            My Profile
          </h1>
          <div className="w-full md:w-1/2 px-2 py-6 shadow-2xl mb-10 bg-surface md:rounded-lg mt-10">
            <div className="flex flex-col items-center justify-center">
              <img
                src={userProfilePic}
                alt=""
                className="w-28 h-auto object-cover rounded-md"
              />
              <h3 className="text-xl font-semibold text-secondary mt-2">
                {user?.displayName}
              </h3>
            </div>

            <div className="mt-10 px-5">
              <div className="bg-base p-2 mb-5 rounded-xl">
                <span className="text-gray-500 flex items-center gap-2">
                  <FaRegUser className="text-lg" />
                  Name
                </span>
                <p>{user?.displayName}</p>
              </div>

              <div className="bg-base p-2 mb-5 rounded-xl">
                <span className="text-gray-500 flex items-center gap-2">
                  <MdOutlineMailOutline className="text-lg" />
                  Email Address
                </span>
                <p>{user?.email}</p>
              </div>
              <button
                
                className="btn bg-primary outline-none border-none text-black w-full"
              >
                Update Profile
              </button>
            </div>
          </div>
        </div>

        {/* update profile modal  */}
        
      </div>
    );
};

export default Profile;