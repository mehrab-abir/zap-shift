import React from "react";
import { use } from "react";
import { NavLink, useNavigate } from "react-router";
import { LiaTimesCircleSolid } from "react-icons/lia";
import { AuthContext } from "../../Context/Auth/AuthContext";

const NavbarSmallDevice = ({ openMenu, setOpenMenu }) => {
  const { user, logOutUser } = use(AuthContext);
  const navigate = useNavigate();

  const handleLogOut = async () => {
    navigate("/", { replace: true });
    await logOutUser();
  };

  return (
    <div
      className={`fixed top-0 left-0 w-full h-screen bg-surface z-50 ${
        !openMenu && "-translate-x-full"
      } transition-all duration-500`}
    >
      <LiaTimesCircleSolid
        onClick={() => setOpenMenu(false)}
        className="absolute top-6 right-8 text-4xl cursor-pointer"
      />
      <nav className="flex flex-col items-center justify-center text-center space-y-4 mt-14 text-lg">
        <NavLink
          to="/"
          className="hover:tracking-wider transition-all duration-300 hover:text-lime-400"
          onClick={() => setOpenMenu(!openMenu)}
        >
          Home
        </NavLink>
        {user && (
          <>
            <NavLink
              to="/dashboard"
              className="hover:tracking-wider transition-all duration-300 hover:text-lime-400"
              onClick={() => setOpenMenu(!openMenu)}
            >
              Dashboard
            </NavLink>

            <NavLink
              to="/sendparcel"
              className="hover:tracking-wider transition-all duration-300 hover:text-lime-400"
              onClick={() => setOpenMenu(!openMenu)}
            >
              Send a Parcel
            </NavLink>
          </>
        )}

        <NavLink
          to="/coverage"
          className="hover:tracking-wider transition-all duration-300 hover:text-lime-400"
          onClick={() => setOpenMenu(!openMenu)}
        >
          Coverage
        </NavLink>
        <NavLink
          to="/calculate-cost"
          className="hover:tracking-wider transition-all duration-300 hover:text-lime-400"
          onClick={() => setOpenMenu(!openMenu)}
        >
          Calculate Cost
        </NavLink>

        <NavLink
          to="/rider-registration"
          className="hover:tracking-wider transition-all duration-300 hover:text-lime-400"
          onClick={() => setOpenMenu(!openMenu)}
        >
          Be A Rider
        </NavLink>
        <NavLink
          to="/about-us"
          className="hover:tracking-wider transition-all duration-300 hover:text-lime-400"
          onClick={() => setOpenMenu(!openMenu)}
        >
          About Us
        </NavLink>

        {user ? (
          <button
            onClick={handleLogOut}
            className="btn btn-sm md:btn-md self-center bg-surface border border-red-500"
          >
            Log Out
          </button>
        ) : (
          <>
            <NavLink
              to="/auth/login"
              className="hover:tracking-wider transition-all duration-300 hover:text-lime-400"
              onClick={() => setOpenMenu(!openMenu)}
            >
              Log In
            </NavLink>
            <NavLink
              to="/auth/register"
              className="hover:tracking-wider transition-all duration-300 hover:text-lime-400"
              onClick={() => setOpenMenu(!openMenu)}
            >
              Register
            </NavLink>
          </>
        )}
      </nav>
    </div>
  );
};

export default NavbarSmallDevice;
