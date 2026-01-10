import React from "react";
import userAvatar from "../../assets/userAvatar.png";
import { use } from "react";
import LoaderBar from "../LoaderBar";
import { AuthContext } from "../../Context/Auth/AuthContext";
import { Link } from "react-router";
import { useState } from "react";
import { MdOutlineArrowDropDownCircle } from "react-icons/md";

const UserProfileDropdown = () => {
  const { user, logOutUser, loading } = use(AuthContext);
  const [openDropdown, setOpenDropdown] = useState(false);

  const handleLogOut = () => {
    logOutUser().then(() => {});
  };

  if (loading) {
    return <LoaderBar></LoaderBar>;
  }

  const userProfile =
    user?.photoURL || user?.providerData[0]?.photoURL || userAvatar;

  return (
    <div className="flex ietms-center gap-2">
      <div
        className="flex items-center gap-2 cursor-pointer"
        onClick={() => setOpenDropdown(!openDropdown)}
      >
        <img
          src={userProfile}
          alt=""
          referrerPolicy="no-referrer"
          className="w-10 md:w-12 rounded-full"
        />
        <MdOutlineArrowDropDownCircle className="text-2xl" />
      </div>

      <div
        className={`absolute top-21 right-5 md:right-10 bg-surface p-3 rounded-lg shadow-lg z-35 ${
          openDropdown
            ? "top-21 opacity-100 pointer-events-auto"
            : "top-25 opacity-0 pointer-events-none"
        } transition-all duration-500`}
      >
        <div className="flex flex-col space-y-1.5">
          <div>
            <p className="text-sm md:text-base">{user?.displayName}</p>
            <p className="text-sm md:text-base text-muted mb-2">
              {user?.email}
            </p>
          </div>

          <Link to="/dashboard" className="hover:underline text-accent">
            Dashboard
          </Link>
          <Link to="/manage-profile" className="hover:underline text-accent">
            Manage Profile
          </Link>
          <button
            onClick={handleLogOut}
            className="btn btn-sm md:btn-md self-center bg-surface border border-red-500 mt-4 w-full"
          >
            Log Out
          </button>
        </div>
      </div>
    </div>
  );
};

export default UserProfileDropdown;
